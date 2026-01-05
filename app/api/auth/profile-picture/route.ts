import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { put, del } from "@vercel/blob";

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
    const filename = `profile-pictures/${user.userId}-${timestamp}.${fileExtension}`;

    // Get existing user to check for old profile picture
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { profilePicture: true },
    });

    // Delete old profile picture from Vercel Blob if it exists
    if (existingUser?.profilePicture && existingUser.profilePicture.startsWith("https://")) {
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

    // Update user record with new profile picture URL
    await prisma.user.update({
      where: { id: user.userId },
      data: { profilePicture: blob.url },
    });

    return NextResponse.json({
      success: true,
      profilePicture: blob.url,
    });
  } catch (error: unknown) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}

