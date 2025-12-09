import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessions = await prisma.visitorSession.findMany({
      where: {
        visitor: {
          dealershipId: user.dealershipId,
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
    });

    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
