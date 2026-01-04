import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * Database connection test endpoint
 * GET /api/debug/db-test
 * 
 * This endpoint helps diagnose database connection issues in production
 */
export async function GET() {
  try {
    // Test 1: Check if DATABASE_URL is set
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const databaseUrlPreview = process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")
      : "NOT SET";

    // Test 2: Try to connect
    await prisma.$connect();
    const isConnected = true;

    // Test 3: Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    const queryWorks = !!result;

    // Test 4: Try to query a table (User table)
    let tableQueryWorks = false;
    try {
      await prisma.user.count();
      tableQueryWorks = true;
    } catch (error) {
      tableQueryWorks = false;
    }

    return NextResponse.json({
      success: true,
      database: {
        urlConfigured: hasDatabaseUrl,
        urlPreview: databaseUrlPreview,
        connected: isConnected,
        queryWorks: queryWorks,
        tableQueryWorks: tableQueryWorks,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
        database: {
          urlConfigured: !!process.env.DATABASE_URL,
          urlPreview: process.env.DATABASE_URL
            ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")
            : "NOT SET",
          nodeEnv: process.env.NODE_ENV,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

