import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: ticketId } = await params;

    // Get ticket
    const ticket = await prisma.deliveryTicket.findFirst({
      where: {
        id: ticketId,
        dealershipId: user.dealershipId,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    if (!ticket.whatsappContactId) {
      return NextResponse.json(
        { error: "WhatsApp contact not found for this ticket" },
        { status: 400 }
      );
    }

    // Get Delivery Completion template
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "delivery_completion",
        section: "delivery_update",
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Delivery Completion template not configured. Please add a Delivery Completion template in Global Settings." },
        { status: 400 }
      );
    }

    if (!template.templateId || !template.templateName) {
      return NextResponse.json(
        { error: "Delivery Completion template is not fully configured. Please fill in Template ID and Template Name in Global Settings." },
        { status: 400 }
      );
    }

    // Send completion message (no parameters)
    let messageStatus = "sent";
    let messageError = null;

    try {
      await whatsappClient.sendTemplate({
        contactId: ticket.whatsappContactId,
        contactNumber: ticket.whatsappNumber,
        templateName: template.templateName,
        templateId: template.templateId,
        templateLanguage: template.language,
        parameters: [], // No parameters - just send the template
      });
    } catch (error: unknown) {
      console.error("Failed to send delivery completion message:", error);
      messageStatus = "failed";
      messageError = (error as Error).message || "Failed to send message";
    }

    return NextResponse.json({
      success: true,
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  } catch (error: unknown) {
    console.error("Send completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

