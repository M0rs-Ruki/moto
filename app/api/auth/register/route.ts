import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { put } from "@vercel/blob";

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
      const filename = `profile-pictures/${tempId}.${fileExtension}`;

      // Upload to Vercel Blob Storage
      const blob = await put(filename, profilePictureFile, {
        access: "public",
        contentType: profilePictureFile.type,
      });

      profilePicturePath = blob.url;
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

    // If profile picture was uploaded, update filename to use user ID
    if (profilePicturePath && user.id && profilePicturePath.startsWith("https://")) {
      // Extract file extension from URL
      const urlParts = profilePicturePath.split(".");
      const fileExtension = urlParts[urlParts.length - 1]?.split("?")[0] || "jpg";
      const newFilename = `profile-pictures/${user.id}-${Date.now()}.${fileExtension}`;
      
      // Re-upload with new filename (Vercel Blob doesn't support rename, so we upload again)
      if (profilePictureFile && profilePictureFile.size > 0) {
        const { del } = await import("@vercel/blob");
        const blob = await put(newFilename, profilePictureFile, {
          access: "public",
          contentType: profilePictureFile.type,
        });
        
        // Delete old temp file
        try {
          await del(profilePicturePath);
        } catch (error) {
          console.warn("Failed to delete temp profile picture:", error);
        }
        
        // Update user record with correct URL
        await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture: blob.url },
        });
        
        profilePicturePath = blob.url;
      }
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
