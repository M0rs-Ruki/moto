import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

// Default lead sources
const DEFAULT_LEAD_SOURCES = [
  "Ads",
  "Instagram",
  "Social Media",
  "Websites",
  "Customer Word-of-Mouth",
  "Other",
];

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let leadSources = await prisma.leadSource.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      orderBy: [
        { order: "asc" },
        { name: "asc" },
      ],
    });

    // If no lead sources exist, seed defaults
    if (leadSources.length === 0) {
      const dealershipId = user.dealershipId; // Type narrowing
      leadSources = await Promise.all(
        DEFAULT_LEAD_SOURCES.map((name, index) =>
          prisma.leadSource.create({
            data: {
              name,
              order: index,
              isDefault: true,
              dealershipId,
            },
          })
        )
      );
    }

    return NextResponse.json({ leadSources });
  } catch (error: unknown) {
    console.error("Get lead sources error:", error);
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
    const { name, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if name already exists for this dealership
    const existing = await prisma.leadSource.findFirst({
      where: {
        dealershipId: user.dealershipId,
        name: name.trim(),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Lead source with this name already exists" },
        { status: 400 }
      );
    }

    // Get max order if not provided
    const maxOrder = order !== undefined ? order : await prisma.leadSource
      .findMany({
        where: { dealershipId: user.dealershipId },
        orderBy: { order: "desc" },
        take: 1,
      })
      .then((sources) => (sources[0]?.order ?? -1) + 1);

    const leadSource = await prisma.leadSource.create({
      data: {
        name: name.trim(),
        order: maxOrder,
        isDefault: false,
        dealershipId: user.dealershipId,
      },
    });

    return NextResponse.json({ leadSource });
  } catch (error: unknown) {
    console.error("Create lead source error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Check if lead source exists and belongs to user's dealership
    const existing = await prisma.leadSource.findFirst({
      where: {
        id,
        dealershipId: user.dealershipId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lead source not found" },
        { status: 404 }
      );
    }

    // If name is being changed, check for duplicates
    if (name && name.trim() !== existing.name) {
      const duplicate = await prisma.leadSource.findFirst({
        where: {
          dealershipId: user.dealershipId,
          name: name.trim(),
          id: { not: id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Lead source with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (order !== undefined) updateData.order = order;

    const leadSource = await prisma.leadSource.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ leadSource });
  } catch (error: unknown) {
    console.error("Update lead source error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Check if lead source exists and belongs to user's dealership
    const existing = await prisma.leadSource.findFirst({
      where: {
        id,
        dealershipId: user.dealershipId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lead source not found" },
        { status: 404 }
      );
    }

    // Delete the lead source (even if it's being used by digital enquiries)
    await prisma.leadSource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete lead source error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

