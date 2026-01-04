import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." },
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
    const filename = `${user.userId}-${timestamp}.${fileExtension}`;
    const filepath = join(process.cwd(), "public", "profile-pictures", filename);

    // Ensure directory exists
    const dirPath = join(process.cwd(), "public", "profile-pictures");
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Get existing user to check for old profile picture
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { profilePicture: true },
    });

    // Delete old profile picture if it exists
    if (existingUser?.profilePicture) {
      const oldFilePath = join(process.cwd(), "public", existingUser.profilePicture);
      if (existsSync(oldFilePath)) {
        const { unlink } = await import("fs/promises");
        await unlink(oldFilePath).catch(() => {
          // Ignore errors if file doesn't exist
        });
      }
    }

    // Update user record with new profile picture path
    const relativePath = `profile-pictures/${filename}`;
    await prisma.user.update({
      where: { id: user.userId },
      data: { profilePicture: relativePath },
    });

    return NextResponse.json({
      success: true,
      profilePicture: relativePath,
    });
  } catch (error: unknown) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}

