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
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
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
          variantId: true,
        },
      });

      const existingInterestsSet = new Set(
        existingInterests.map((ei) => `${ei.modelId}:${ei.variantId || ""}`)
      );

      // Process modelIds (support both old string format and new object format)
      const interestsToCreate = modelIds
        .map((item: string | { modelId: string; variantId?: string }) => {
          const modelId = typeof item === "string" ? item : item.modelId;
          const variantId =
            typeof item === "object" ? item.variantId : undefined;
          const key = `${modelId}:${variantId || ""}`;

          if (!existingInterestsSet.has(key)) {
            return {
              visitorId: visitor.id,
              modelId,
              variantId: variantId || null,
              sessionId: session.id,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      if (interestsToCreate.length > 0) {
        await prisma.visitorInterest.createMany({
          data: interestsToCreate,
        });
      }

      // Also link existing interests to this session if they were selected
      const selectedItems = modelIds.filter(
        (item: string | { modelId: string; variantId?: string }) => {
          const modelId = typeof item === "string" ? item : item.modelId;
          const variantId =
            typeof item === "object" ? item.variantId : undefined;
          const key = `${modelId}:${variantId || ""}`;
          return existingInterestsSet.has(key);
        }
      );

      if (selectedItems.length > 0) {
        // Update existing interests to link them to this session
        for (const item of selectedItems) {
          const modelId = typeof item === "string" ? item : item.modelId;
          const variantId =
            typeof item === "object" ? item.variantId : undefined;

          await prisma.visitorInterest.updateMany({
            where: {
              visitorId: visitor.id,
              modelId,
              variantId: variantId || null,
              sessionId: null, // Only update interests not already linked to a session
            },
            data: {
              sessionId: session.id,
            },
          });
        }
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
        const visitLabel =
          visitNumber === 1
            ? "1st"
            : visitNumber === 2
            ? "2nd"
            : visitNumber === 3
            ? "3rd"
            : `${visitNumber}th`;

        // Align parameter count to template type to avoid 500s
        const parameters =
          templateToUse.type === "return_visit"
            ? [visitor.firstName, visitLabel]
            : [visitor.firstName, new Date().toLocaleDateString()];

        await whatsappClient.sendTemplate({
          contactId: visitor.whatsappContactId,
          contactNumber: visitor.whatsappNumber,
          templateName: templateToUse.templateName,
          templateId: templateToUse.templateId,
          templateLanguage: templateToUse.language,
          parameters,
        });
        messageStatus = "sent";
      } catch (error: unknown) {
        console.error("Failed to send return visit message:", error);
        messageStatus = "failed";
        messageError = (error as Error).message || "Failed to send message";
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
  } catch (error: unknown) {
    console.error("Create session for existing visitor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
