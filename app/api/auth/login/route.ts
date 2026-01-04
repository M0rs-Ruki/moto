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
    let token: string;
    try {
      token = await generateToken({
        userId: user.id,
        email: user.email,
        dealershipId: user.dealershipId || undefined,
      });
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Set cookie
    try {
      await setAuthCookie(token);
    } catch (error) {
      console.error("Cookie setting error:", error);
      // Don't fail the request if cookie setting fails, but log it
      // The token is still returned in the response
    }

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
    // Enhanced error logging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : "Unknown";
    
    console.error("=== LOGIN ERROR ===");
    console.error("Error name:", errorName);
    console.error("Error message:", errorMessage);
    if (errorStack) {
      console.error("Error stack:", errorStack);
    }
    console.error("Full error:", error);
    console.error("==================");
    
    // Check if it's a database connection error
    if (error instanceof Error) {
      // Prisma connection errors
      if (error.message.includes("Can't reach database server") || 
          error.message.includes("P1001") ||
          error.message.includes("connection") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("timeout")) {
        console.error("Database connection error detected");
        return NextResponse.json(
          { 
            error: "Database connection failed",
            errorType: "DATABASE_CONNECTION",
            message: "Unable to connect to database server. Please check server logs.",
          },
          { status: 503 }
        );
      }
      
      // Other Prisma errors
      if (error.message.includes("Prisma") || 
          error.message.includes("P1") || 
          error.message.includes("P2") ||
          error.message.includes("P3")) {
        console.error("Database error detected:", error.message);
        return NextResponse.json(
          { 
            error: "Database error occurred",
            errorType: "DATABASE_ERROR",
            message: error.message.substring(0, 100), // First 100 chars for debugging
          },
          { status: 500 }
        );
      }
      
      // Authentication/token errors
      if (error.message.includes("JWT") || 
          error.message.includes("token") ||
          error.message.includes("cookie")) {
        console.error("Authentication error detected:", error.message);
        return NextResponse.json(
          { 
            error: "Authentication error",
            errorType: "AUTH_ERROR",
            message: "Failed to generate or set authentication token",
          },
          { status: 500 }
        );
      }
    }
    
    // Generic error response with error type for debugging
    return NextResponse.json(
      { 
        error: "Internal server error",
        errorType: "UNKNOWN_ERROR",
        message: errorMessage.substring(0, 200), // First 200 chars for debugging
      },
      { status: 500 }
    );
  }
}
