import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * Health check endpoint
 * Used to verify the application is running and database is accessible
 * GET /api/health
 */
export async function GET() {
  try {
    // Check if DATABASE_URL is set
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    if (!hasDatabaseUrl) {
      return NextResponse.json(
        {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          database: "not_configured",
          error: "DATABASE_URL environment variable is not set",
        },
        { status: 503 }
      );
    }

    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        nodeEnv: process.env.NODE_ENV,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: errorMessage,
        nodeEnv: process.env.NODE_ENV,
        databaseUrlConfigured: !!process.env.DATABASE_URL,
      },
      { status: 503 }
    );
  }
}

