import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, modelId, variantId, outcome, feedback } = body;

    if (!sessionId || !modelId) {
      return NextResponse.json(
        { error: "Session ID and model ID are required" },
        { status: 400 }
      );
    }

    // Verify session belongs to user's dealership
    const session = await prisma.visitorSession.findFirst({
      where: {
        id: sessionId,
        visitor: {
          dealershipId: user.dealershipId,
        },
      },
      include: {
        visitor: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Create test drive record
    const testDrive = await prisma.testDrive.create({
      data: {
        sessionId,
        modelId,
        variantId: variantId || null,
        outcome: outcome || null,
        feedback: feedback || null,
      },
      include: {
        model: true,
        variant: true,
      },
    });

    // Update session status
    await prisma.visitorSession.update({
      where: { id: sessionId },
      data: { status: "test_drive" },
    });

    // Send test drive follow-up WhatsApp message
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "test_drive",
      },
    });

    if (template && session.visitor.whatsappNumber) {
      try {
        const fullName = `${session.visitor.firstName} ${
          session.visitor.lastName || ""
        }`.trim();
        const modelName = testDrive.variant
          ? `${testDrive.model.name}.${testDrive.variant.name}`
          : testDrive.model.name;

        await whatsappClient.sendTemplate({
          contactId: session.visitor.whatsappContactId || undefined,
          contactNumber: session.visitor.whatsappNumber,
          templateName: template.templateName,
          templateId: template.templateId,
          templateLanguage: template.language,
          parameters: [fullName, modelName],
        });
      } catch (error: unknown) {
        console.error("Failed to send test drive message:", error);
      }
    }

    return NextResponse.json({
      success: true,
      testDrive: {
        id: testDrive.id,
      },
    });
  } catch (error: unknown) {
    console.error("Create test drive error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const testDrives = await prisma.testDrive.findMany({
      where: {
        session: {
          visitor: {
            dealershipId: user.dealershipId,
          },
        },
      },
      include: {
        model: {
          include: {
            category: true,
          },
        },
        session: {
          include: {
            visitor: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ testDrives });
  } catch (error: unknown) {
    console.error("Get test drives error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
