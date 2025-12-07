import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const templates = await prisma.whatsAppTemplate.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      orderBy: {
        type: "asc",
      },
    });

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error("Get templates error:", error);
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
    const { id, name, templateId, templateName, language } = body;

    if (!id || !name || !templateId || !templateName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify template belongs to user's dealership
    const existingTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        id,
        dealershipId: user.dealershipId,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const template = await prisma.whatsAppTemplate.update({
      where: { id },
      data: {
        name,
        templateId,
        templateName,
        language: language || "en_US",
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    console.error("Update template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
