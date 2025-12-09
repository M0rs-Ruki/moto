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
    const { sessionId, exitFeedback, exitRating } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
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

    // Update session with exit feedback
    await prisma.visitorSession.update({
      where: { id: sessionId },
      data: {
        status: "exited",
        exitFeedback: exitFeedback || null,
        exitRating: exitRating ? parseInt(exitRating) : null,
      },
    });

    // Send exit thank you WhatsApp message
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "exit",
      },
    });

    if (template && session.visitor.whatsappNumber) {
      try {
        const CRM = 999999999;
        await whatsappClient.sendTemplate({
          contactId: session.visitor.whatsappContactId || undefined,
          contactNumber: session.visitor.whatsappNumber,
          templateName: template.templateName,
          templateId: template.templateId,
          templateLanguage: template.language,
          parameters: [CRM.toString()],
        });
      } catch (error: unknown) {
        console.error("Failed to send exit message:", error);
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error("Exit session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
