import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get all enquiries with their sessions
    const enquiries = await prisma.digitalEnquiry.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      include: {
        leadSource: true,
        model: {
          include: {
            category: true,
          },
        },
        sessions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error: unknown) {
    console.error("Get digital enquiry sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { digitalEnquiryId, notes, status } = body;

    if (!digitalEnquiryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the enquiry belongs to the user's dealership
    const enquiry = await prisma.digitalEnquiry.findFirst({
      where: {
        id: digitalEnquiryId,
        dealershipId: user.dealershipId,
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: "Digital enquiry not found" },
        { status: 404 }
      );
    }

    const session = await prisma.digitalEnquirySession.create({
      data: {
        digitalEnquiryId,
        notes: notes || null,
        status: status || "active",
      },
      include: {
        digitalEnquiry: {
          include: {
            leadSource: true,
            model: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, session });
  } catch (error: unknown) {
    console.error("Create digital enquiry session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

