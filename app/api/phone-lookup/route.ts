import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get("phone");

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Check if phone number exists in different sections
    const [visitors, digitalEnquiries, deliveryTickets] = await Promise.all([
      prisma.visitor.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: phoneNumber,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
        take: 1,
      }),
      prisma.digitalEnquiry.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: phoneNumber,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
        take: 1,
      }),
      prisma.deliveryTicket.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: phoneNumber,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
        take: 1,
      }),
    ]);

    const results = {
      dailyWalkins: visitors.length > 0,
      digitalEnquiry: digitalEnquiries.length > 0,
      deliveryUpdate: deliveryTickets.length > 0,
      // Include IDs for navigation if needed
      visitorId: visitors[0]?.id || null,
      enquiryId: digitalEnquiries[0]?.id || null,
      ticketId: deliveryTickets[0]?.id || null,
    };

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Phone lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

