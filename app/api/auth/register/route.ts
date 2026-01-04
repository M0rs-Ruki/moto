import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const dealershipName = formData.get("dealershipName") as string;
    const dealershipLocation = formData.get("dealershipLocation") as string;
    const theme = (formData.get("theme") as string) || "light";
    const profilePictureFile = formData.get("profilePicture") as File | null;

    // Validation
    if (!email || !password || !dealershipName || !dealershipLocation) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create dealership and user
    const dealership = await prisma.dealership.create({
      data: {
        name: dealershipName,
        location: dealershipLocation,
      },
    });

    // Handle profile picture upload if provided
    let profilePicturePath: string | null = null;
    if (profilePictureFile && profilePictureFile.size > 0) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(profilePictureFile.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (profilePictureFile.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Generate unique filename (we'll use a temporary ID, then update after user creation)
      const tempId = `temp-${Date.now()}`;
      const fileExtension = profilePictureFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `${tempId}.${fileExtension}`;
      const filepath = join(process.cwd(), "public", "profile-pictures", filename);

      // Ensure directory exists
      const dirPath = join(process.cwd(), "public", "profile-pictures");
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }

      // Save file
      const bytes = await profilePictureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      profilePicturePath = `profile-pictures/${filename}`;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        dealershipId: dealership.id,
        theme: theme || "light",
        profilePicture: profilePicturePath,
      },
      include: { dealership: true },
    });

    // If profile picture was uploaded, rename file to use user ID
    if (profilePicturePath && user.id) {
      const oldPath = join(process.cwd(), "public", profilePicturePath);
      const fileExtension = profilePicturePath.split(".").pop() || "jpg";
      const newFilename = `${user.id}-${Date.now()}.${fileExtension}`;
      const newPath = join(process.cwd(), "public", "profile-pictures", newFilename);
      
      // Rename file
      const { rename } = await import("fs/promises");
      await rename(oldPath, newPath);
      
      // Update user record with correct path
      const correctPath = `profile-pictures/${newFilename}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { profilePicture: correctPath },
      });
      
      profilePicturePath = correctPath;
    }

    // Create default WhatsApp templates
    await prisma.whatsAppTemplate.createMany({
      data: [
        {
          name: "Welcome Message",
          templateId: "demo_welcome_123",
          templateName: "welcome_msg",
          language: "en_US",
          type: "welcome",
          section: "global",
          dealershipId: dealership.id,
        },
        {
          name: "Test Drive Follow-up",
          templateId: "demo_testdrive_456",
          templateName: "test_drive_msg",
          language: "en_US",
          type: "test_drive",
          section: "global",
          dealershipId: dealership.id,
        },
        {
          name: "Exit Thank You",
          templateId: "demo_exit_789",
          templateName: "exit_msg",
          language: "en_US",
          type: "exit",
          section: "global",
          dealershipId: dealership.id,
        },
        {
          name: "Delivery Reminder",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_reminder",
          section: "delivery_update",
          dealershipId: dealership.id,
        },
        {
          name: "Digital Enquiry Notification",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "digital_enquiry",
          section: "digital_enquiry",
          dealershipId: dealership.id,
        },
        {
          name: "Delivery Completion",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_completion",
          section: "delivery_update",
          dealershipId: dealership.id,
        },
      ],
    });

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      dealershipId: dealership.id,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        theme: user.theme,
        profilePicture: profilePicturePath,
        dealership: user.dealership,
      },
    });
  } catch (error: unknown) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
