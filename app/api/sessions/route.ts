import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if filtering by visitor ID
    const searchParams = request.nextUrl.searchParams;
    const visitorId = searchParams.get("visitorId");
    const limit = parseInt(searchParams.get("limit") || "30"); // Default 30 per page
    const skip = parseInt(searchParams.get("skip") || "0");

    // Get total count for pagination
    const totalCount = await prisma.visitorSession.count({
      where: {
        visitor: {
          dealershipId: user.dealershipId,
          ...(visitorId ? { id: visitorId } : {}),
        },
      },
    });

    const sessions = await prisma.visitorSession.findMany({
      where: {
        visitor: {
          dealershipId: user.dealershipId,
          ...(visitorId ? { id: visitorId } : {}),
        },
      },
      include: {
        visitor: true,
        testDrives: {
          include: {
            model: {
              include: {
                category: true,
              },
            },
          },
        },
        visitorInterests: {
          where: {
            sessionId: {
              not: null, // Only get interests linked to this session
            },
          },
          include: {
            model: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    const hasMore = skip + limit < totalCount;

    return NextResponse.json({ 
      sessions,
      hasMore,
      total: totalCount,
      skip,
      limit
    });
  } catch (error: unknown) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
