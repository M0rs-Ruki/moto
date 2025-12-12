import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Helper function to count records with date filtering
    const countByDateRange = async (
      model: any,
      whereClause: any,
      dateField: string = "createdAt"
    ) => {
      const today = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: todayStart,
          },
        },
      });

      const week = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: weekStart,
          },
        },
      });

      const month = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: monthStart,
          },
        },
      });

      const year = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: yearStart,
          },
        },
      });

      const total = await model.count({
        where: whereClause,
      });

      return { today, week, month, year, total };
    };

    const baseWhere = { dealershipId: user.dealershipId };

    // Daily Walkins (Visitors)
    const dailyWalkins = await countByDateRange(
      prisma.visitor,
      baseWhere
    );

    // Digital Enquiry
    const digitalEnquiry = await countByDateRange(
      prisma.digitalEnquiry,
      baseWhere
    );

    // Delivery Update (Tickets)
    const deliveryUpdate = await countByDateRange(
      prisma.deliveryTicket,
      baseWhere
    );

    // Field Enquiry (placeholder - return zeros for now)
    const fieldEnquiry = {
      today: 0,
      week: 0,
      month: 0,
      year: 0,
      total: 0,
    };

    return NextResponse.json({
      dailyWalkins,
      digitalEnquiry,
      fieldEnquiry,
      deliveryUpdate,
    });
  } catch (error: unknown) {
    console.error("Get statistics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

