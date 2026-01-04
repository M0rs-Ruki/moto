import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * Health check endpoint
 * Used to verify the application is running and database is accessible
 * GET /api/health
 */
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: (error as Error).message,
      },
      { status: 503 }
    );
  }
}

