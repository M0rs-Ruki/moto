import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dealership = await prisma.dealership.findUnique({
      where: { id: user.dealershipId },
      select: {
        id: true,
        name: true,
        location: true,
        showroomNumber: true,
      },
    });

    if (!dealership) {
      return NextResponse.json(
        { error: "Dealership not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ dealership });
  } catch (error: unknown) {
    console.error("Get dealership error:", error);
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
    const { name, location, showroomNumber } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: "Name and location are required" },
        { status: 400 }
      );
    }

    const dealership = await prisma.dealership.update({
      where: { id: user.dealershipId },
      data: {
        name,
        location,
        showroomNumber: showroomNumber || null,
      },
      select: {
        id: true,
        name: true,
        location: true,
        showroomNumber: true,
      },
    });

    return NextResponse.json({ success: true, dealership });
  } catch (error: unknown) {
    console.error("Update dealership error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

