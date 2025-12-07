import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, year, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Model name and category are required" },
        { status: 400 }
      );
    }

    // Verify category belongs to user's dealership
    const category = await prisma.vehicleCategory.findFirst({
      where: {
        id: categoryId,
        dealershipId: user.dealershipId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const model = await prisma.vehicleModel.create({
      data: {
        name,
        year: year ? parseInt(year) : null,
        categoryId,
      },
    });

    return NextResponse.json({ success: true, model });
  } catch (error: any) {
    console.error("Create model error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
