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

    if (!hasDatabaseUrl) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
        database: {
          urlConfigured: false,
          urlPreview: "NOT SET",
          connected: false,
          queryWorks: false,
          tableQueryWorks: false,
          nodeEnv: process.env.NODE_ENV,
        },
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Test 2: Try to connect
    let isConnected = false;
    let connectionError: string | null = null;
    try {
      await prisma.$connect();
      isConnected = true;
    } catch (error) {
      connectionError = error instanceof Error ? error.message : String(error);
      isConnected = false;
    }

    // Test 3: Try a simple query
    let queryWorks = false;
    let queryError: string | null = null;
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      queryWorks = !!result;
    } catch (error) {
      queryError = error instanceof Error ? error.message : String(error);
      queryWorks = false;
    }

    // Test 4: Try to query a table (User table)
    let tableQueryWorks = false;
    let tableQueryError: string | null = null;
    try {
      await prisma.user.count();
      tableQueryWorks = true;
    } catch (error) {
      tableQueryError = error instanceof Error ? error.message : String(error);
      tableQueryWorks = false;
    }

    return NextResponse.json({
      success: isConnected && queryWorks && tableQueryWorks,
      database: {
        urlConfigured: hasDatabaseUrl,
        urlPreview: databaseUrlPreview,
        connected: isConnected,
        connectionError: connectionError,
        queryWorks: queryWorks,
        queryError: queryError,
        tableQueryWorks: tableQueryWorks,
        tableQueryError: tableQueryError,
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

