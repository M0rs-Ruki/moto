import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: enquiryId } = await params;

    const body = await request.json();
    const { leadScope } = body;

    // Validate leadScope
    if (!leadScope || !["hot", "warm", "cold"].includes(leadScope)) {
      return NextResponse.json(
        { error: "Invalid leadScope. Must be 'hot', 'warm', or 'cold'" },
        { status: 400 }
      );
    }

    // Check if enquiry exists and belongs to user's dealership
    const enquiry = await prisma.digitalEnquiry.findFirst({
      where: {
        id: enquiryId,
        dealershipId: user.dealershipId,
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    // Update the leadScope
    const updatedEnquiry = await prisma.digitalEnquiry.update({
      where: {
        id: enquiryId,
      },
      data: {
        leadScope,
      },
      include: {
        leadSource: true,
        model: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      enquiry: updatedEnquiry,
    });
  } catch (error: unknown) {
    console.error("Update digital enquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

