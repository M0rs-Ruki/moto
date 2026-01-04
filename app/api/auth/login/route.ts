import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { dealership: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      dealershipId: user.dealershipId || undefined,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        theme: user.theme,
        profilePicture: user.profilePicture,
        dealership: user.dealership,
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    
    // Check if it's a database connection error
    if (error instanceof Error) {
      // Prisma connection errors
      if (error.message.includes("Can't reach database server") || 
          error.message.includes("P1001") ||
          error.message.includes("connection")) {
        console.error("Database connection error:", error.message);
        return NextResponse.json(
          { 
            error: "Database connection failed",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
          },
          { status: 503 }
        );
      }
      
      // Other Prisma errors
      if (error.message.includes("Prisma") || error.message.includes("P")) {
        console.error("Database error:", error.message);
        return NextResponse.json(
          { 
            error: "Database error occurred",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" 
          ? (error instanceof Error ? error.message : String(error))
          : undefined
      },
      { status: 500 }
    );
  }
}
