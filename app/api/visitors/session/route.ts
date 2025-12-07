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
    const { visitorId, reason, modelIds } = body;

    // Validation
    if (!visitorId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields: visitorId and reason" },
        { status: 400 }
      );
    }

    // Verify visitor exists and belongs to the dealership
    const visitor = await prisma.visitor.findFirst({
      where: {
        id: visitorId,
        dealershipId: user.dealershipId,
      },
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!visitor) {
      return NextResponse.json(
        { error: "Visitor not found" },
        { status: 404 }
      );
    }

    // Count existing sessions to determine visit number
    const sessionCount = visitor.sessions.length;
    const visitNumber = sessionCount + 1;

    // Create new session for existing visitor
    const session = await prisma.visitorSession.create({
      data: {
        reason,
        visitorId: visitor.id,
        status: "intake",
      },
    });

    // Add new vehicle interests for this session (if provided)
    if (modelIds && modelIds.length > 0) {
      // Get existing interests to avoid duplicates
      const existingInterests = await prisma.visitorInterest.findMany({
        where: {
          visitorId: visitor.id,
        },
        select: {
          modelId: true,
        },
      });

      const existingModelIds = new Set(existingInterests.map((ei) => ei.modelId));

      // Create new interests that don't already exist, linked to this session
      const newModelIds = modelIds.filter(
        (modelId: string) => !existingModelIds.has(modelId)
      );

      if (newModelIds.length > 0) {
        await prisma.visitorInterest.createMany({
          data: newModelIds.map((modelId: string) => ({
            visitorId: visitor.id,
            modelId,
            sessionId: session.id,
          })),
        });
      }

      // Also link existing interests to this session if they were selected
      const selectedExistingModelIds = modelIds.filter((modelId: string) =>
        existingModelIds.has(modelId)
      );

      if (selectedExistingModelIds.length > 0) {
        // Update existing interests to link them to this session
        await prisma.visitorInterest.updateMany({
          where: {
            visitorId: visitor.id,
            modelId: { in: selectedExistingModelIds },
            sessionId: null, // Only update interests not already linked to a session
          },
          data: {
            sessionId: session.id,
          },
        });
      }
    }

    // Get return visit template (if exists) or use welcome template
    const returnVisitTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "return_visit",
      },
    });

    const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "welcome",
      },
    });

    const templateToUse = returnVisitTemplate || welcomeTemplate;

    let messageStatus = "not_sent";
    let messageError = null;

    if (templateToUse && visitor.whatsappContactId) {
      try {
        await whatsappClient.sendTemplate({
          contactId: visitor.whatsappContactId,
          contactNumber: visitor.whatsappNumber,
          templateName: templateToUse.templateName,
          templateId: templateToUse.templateId,
          templateLanguage: templateToUse.language,
          parameters: [
            visitor.firstName,
            visitNumber === 2 ? "2nd" : visitNumber === 3 ? "3rd" : `${visitNumber}th`,
            new Date().toLocaleDateString(),
          ],
        });
        messageStatus = "sent";
      } catch (error: any) {
        console.error("Failed to send return visit message:", error);
        messageStatus = "failed";
        messageError = error.message || "Failed to send message";
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        visitNumber,
      },
      visitor: {
        id: visitor.id,
        firstName: visitor.firstName,
        lastName: visitor.lastName,
      },
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  } catch (error: any) {
    console.error("Create session for existing visitor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

