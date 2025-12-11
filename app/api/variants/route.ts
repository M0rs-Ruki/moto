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
    const { name, modelId } = body;

    if (!name || !modelId) {
      return NextResponse.json(
        { error: "Variant name and model ID are required" },
        { status: 400 }
      );
    }

    // Verify model belongs to user's dealership through category
    const model = await prisma.vehicleModel.findFirst({
      where: {
        id: modelId,
        category: {
          dealershipId: user.dealershipId,
        },
      },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    const variant = await prisma.vehicleVariant.create({
      data: {
        name,
        modelId,
      },
    });

    return NextResponse.json({ success: true, variant });
  } catch (error: unknown) {
    console.error("Create variant error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Variant with this name already exists for this model" },
        { status: 400 }
      );
    }
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
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    // Verify variant belongs to user's dealership through model and category
    const variant = await prisma.vehicleVariant.findFirst({
      where: {
        id,
        model: {
          category: {
            dealershipId: user.dealershipId,
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    // Delete variant (visitor interests and test drives will be cascade deleted)
    await prisma.vehicleVariant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Variant deleted" });
  } catch (error: unknown) {
    console.error("Delete variant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
