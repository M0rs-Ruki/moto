import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `profile-pictures/${user.userId}-${timestamp}.${fileExtension}`;

    // Get existing user to check for old profile picture
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { profilePicture: true },
    });

    // Check if Vercel Blob token is available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    let profilePictureUrl: string;

    if (blobToken) {
      // Use Vercel Blob Storage (production)
      // Delete old profile picture from Vercel Blob if it exists
      if (
        existingUser?.profilePicture &&
        existingUser.profilePicture.startsWith("https://")
      ) {
        try {
          await del(existingUser.profilePicture);
        } catch (error) {
          // Ignore errors if file doesn't exist or deletion fails
          console.warn("Failed to delete old profile picture:", error);
        }
      }

      // Upload to Vercel Blob Storage
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });

      profilePictureUrl = blob.url;
    } else {
      // Fallback to local filesystem (local development)
      const filepath = join(process.cwd(), "public", filename);

      // Ensure directory exists
      const dirPath = join(process.cwd(), "public", "profile-pictures");
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }

      // Delete old profile picture if it exists (local filesystem)
      if (
        existingUser?.profilePicture &&
        !existingUser.profilePicture.startsWith("https://")
      ) {
        const oldFilePath = join(
          process.cwd(),
          "public",
          existingUser.profilePicture
        );
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath);
          } catch (error) {
            console.warn("Failed to delete old profile picture:", error);
          }
        }
      }

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      profilePictureUrl = filename;
    }

    // Update user record with new profile picture URL/path
    await prisma.user.update({
      where: { id: user.userId },
      data: { profilePicture: profilePictureUrl },
    });

    return NextResponse.json({
      success: true,
      profilePicture: profilePictureUrl,
    });
  } catch (error: unknown) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}
