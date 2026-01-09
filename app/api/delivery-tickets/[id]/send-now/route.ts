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
      include: {
        model: {
          include: {
            category: true,
          },
        },
        scheduledMessages: {
          where: {
            status: "pending",
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // If contact ID is missing, try to create or fetch it
    let whatsappContactId = ticket.whatsappContactId;
    if (!whatsappContactId) {
      try {
        // First, try to get existing contact by phone number
        const existingContact = await whatsappClient.getContactByPhone(
          ticket.whatsappNumber
        );
        
        if (existingContact?.contactId) {
          whatsappContactId = existingContact.contactId;
        } else {
          // If contact doesn't exist, create it
          const contactResult = await whatsappClient.createContact({
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            contact_number: ticket.whatsappNumber,
            email: ticket.email || "",
            address: ticket.address || "",
          });
          
          whatsappContactId = contactResult.contactId || "";
        }
        
        // Update ticket with contact ID if we got one
        if (whatsappContactId) {
          await prisma.deliveryTicket.update({
            where: { id: ticket.id },
            data: { whatsappContactId },
          });
        }
      } catch (error) {
        console.error("Failed to create/fetch WhatsApp contact:", error);
        // Continue anyway - we can send messages using phone number
      }
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
        {
          error:
            "Delivery template not configured. Please add a Delivery Reminder template in Global Settings.",
        },
        { status: 400 }
      );
    }

    if (!template.templateId || !template.templateName) {
      return NextResponse.json(
        {
          error:
            "Delivery template is not fully configured. Please fill in Template ID and Template Name in Global Settings.",
        },
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
      const modelName = ticket.model
        ? `${ticket.model.category.name} - ${ticket.model.name}`
        : "N/A";
      
      // Format delivery date for "Send Now" option
      const deliveryDateFormatted = new Date(ticket.deliveryDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      await whatsappClient.sendTemplate({
        contactId: whatsappContactId || undefined,
        contactNumber: ticket.whatsappNumber,
        templateName: template.templateName,
        templateId: template.templateId,
        templateLanguage: template.language,
        parameters: [modelName, deliveryDateFormatted],
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
