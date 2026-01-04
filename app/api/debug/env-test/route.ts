import { NextResponse } from "next/server";

/**
 * Environment variables test endpoint
 * GET /api/debug/env-test
 * 
 * This endpoint checks if environment variables are loaded without requiring Prisma
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPreview: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@").substring(0, 150)
          : "NOT SET",
        databaseUrlLength: process.env.DATABASE_URL?.length || 0,
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

