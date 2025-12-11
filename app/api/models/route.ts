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
  } catch (error: unknown) {
    console.error("Create model error:", error);
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
      return NextResponse.json(
        { error: "Model ID is required" },
        { status: 400 }
      );
    }

    // Verify model belongs to user's dealership through category
    const model = await prisma.vehicleModel.findFirst({
      where: {
        id,
        category: {
          dealershipId: user.dealershipId,
        },
      },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Delete model (visitor interests and test drives will be cascade deleted)
    await prisma.vehicleModel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Model deleted" });
  } catch (error: unknown) {
    console.error("Delete model error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
