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
    const { visitorId, reason } = body;

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

