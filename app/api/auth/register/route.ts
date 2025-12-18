import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      dealershipName,
      dealershipLocation,
      theme,
      accentColor,
    } = body;

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

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        dealershipId: dealership.id,
        theme: theme || "light",
        accentColor: accentColor || "#3b82f6",
      },
      include: { dealership: true },
    });

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
        accentColor: user.accentColor,
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
