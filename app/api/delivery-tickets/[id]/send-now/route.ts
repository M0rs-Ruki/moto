import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const ticketId = params.id;

    // Get ticket
    const ticket = await prisma.deliveryTicket.findFirst({
      where: {
        id: ticketId,
        dealershipId: user.dealershipId,
      },
      include: {
        model: true,
        scheduledMessages: {
          where: {
            status: "pending",
          },
        },
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

    // Get WhatsApp template
    // Get delivery template (check section-specific first, then global)
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "delivery_reminder",
        OR: [
          { section: "delivery_update" },
          { section: "global" },
          { section: null },
        ],
      },
      orderBy: [
        { section: "asc" }, // Prefer section-specific over global
      ],
    });

    if (!template) {
      return NextResponse.json(
        { error: "Delivery template not configured. Please add a Delivery Reminder template in Global Settings." },
        { status: 400 }
      );
    }

    if (!template.templateId || !template.templateName) {
      return NextResponse.json(
        { error: "Delivery template is not fully configured. Please fill in Template ID and Template Name in Global Settings." },
        { status: 400 }
      );
    }

    // Cancel any pending scheduled messages
    if (ticket.scheduledMessages.length > 0) {
      await prisma.scheduledMessage.updateMany({
        where: {
          id: { in: ticket.scheduledMessages.map((m) => m.id) },
          status: "pending",
        },
        data: {
          status: "failed",
        },
      });
    }

    // Send message now
    let messageStatus = "sent";
    let messageError = null;

    try {
      const name = `${ticket.firstName} ${ticket.lastName}`;
      const deliveryDateStr = new Date(ticket.deliveryDate).toLocaleDateString();

      await whatsappClient.sendTemplate({
        contactId: ticket.whatsappContactId,
        contactNumber: ticket.whatsappNumber,
        templateName: template.templateName,
        templateId: template.templateId,
        templateLanguage: template.language,
        parameters: [name, deliveryDateStr],
      });

      // Update ticket
      await prisma.deliveryTicket.update({
        where: { id: ticket.id },
        data: { messageSent: true },
      });
    } catch (error: unknown) {
      console.error("Failed to send delivery message:", error);
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
    console.error("Send now error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

