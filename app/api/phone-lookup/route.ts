import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = 'nodejs';

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
    const [visitors, digitalEnquiries, fieldInquiries, deliveryTickets] = await Promise.all([
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
      prisma.fieldInquiry.findMany({
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
      fieldInquiry: fieldInquiries.length > 0,
      deliveryUpdate: deliveryTickets.length > 0,
      // Include IDs for navigation if needed
      visitorId: visitors[0]?.id || null,
      enquiryId: digitalEnquiries[0]?.id || null,
      fieldInquiryId: fieldInquiries[0]?.id || null,
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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { phones } = body;

    if (!phones || !Array.isArray(phones) || phones.length === 0) {
      return NextResponse.json(
        { error: "Phone numbers array is required" },
        { status: 400 }
      );
    }

    // Limit batch size to prevent overwhelming the database
    const phoneNumbers = phones.slice(0, 1000);
    const uniquePhones = [...new Set(phoneNumbers)];

    // Batch query all phone numbers at once
    const [visitors, digitalEnquiries, fieldInquiries, deliveryTickets] = await Promise.all([
      prisma.visitor.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: { in: uniquePhones },
        },
        select: {
          id: true,
          whatsappNumber: true,
          firstName: true,
          lastName: true,
        },
      }),
      prisma.digitalEnquiry.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: { in: uniquePhones },
        },
        select: {
          id: true,
          whatsappNumber: true,
          firstName: true,
          lastName: true,
        },
      }),
      prisma.fieldInquiry.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: { in: uniquePhones },
        },
        select: {
          id: true,
          whatsappNumber: true,
          firstName: true,
          lastName: true,
        },
      }),
      prisma.deliveryTicket.findMany({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: { in: uniquePhones },
        },
        select: {
          id: true,
          whatsappNumber: true,
          firstName: true,
          lastName: true,
        },
      }),
    ]);

    // Create maps for quick lookup
    const visitorMap = new Map(visitors.map(v => [v.whatsappNumber, v]));
    const enquiryMap = new Map(digitalEnquiries.map(e => [e.whatsappNumber, e]));
    const fieldInquiryMap = new Map(fieldInquiries.map(f => [f.whatsappNumber, f]));
    const ticketMap = new Map(deliveryTickets.map(t => [t.whatsappNumber, t]));

    // Build results for each phone number
    const results: Record<string, {
      dailyWalkins: boolean;
      digitalEnquiry: boolean;
      fieldInquiry: boolean;
      deliveryUpdate: boolean;
      visitorId: string | null;
      enquiryId: string | null;
      fieldInquiryId: string | null;
      ticketId: string | null;
    }> = {};

    uniquePhones.forEach(phone => {
      const visitor = visitorMap.get(phone);
      const enquiry = enquiryMap.get(phone);
      const fieldInquiry = fieldInquiryMap.get(phone);
      const ticket = ticketMap.get(phone);

      results[phone] = {
        dailyWalkins: !!visitor,
        digitalEnquiry: !!enquiry,
        fieldInquiry: !!fieldInquiry,
        deliveryUpdate: !!ticket,
        visitorId: visitor?.id || null,
        enquiryId: enquiry?.id || null,
        fieldInquiryId: fieldInquiry?.id || null,
        ticketId: ticket?.id || null,
      };
    });

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Batch phone lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

