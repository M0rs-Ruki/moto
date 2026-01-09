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

    // Check if completion message was already sent or ticket is closed
    if (ticket.completionSent || ticket.status === "closed") {
      return NextResponse.json(
        { error: "Completion message has already been sent for this ticket. Ticket is closed." },
        { status: 400 }
      );
    }

    // Send completion message
    let messageStatus = "sent";
    let messageError = null;

    try {
      await whatsappClient.sendTemplate({
        contactId: whatsappContactId || undefined,
        contactNumber: ticket.whatsappNumber,
        templateName: template.templateName,
        templateId: template.templateId,
        templateLanguage: template.language,
        parameters: [], // No parameters - just send the template
      });

      // Mark ticket as completion sent, message sent, and closed in database
      await prisma.deliveryTicket.update({
        where: { id: ticket.id },
        data: { 
          completionSent: true,
          messageSent: true,
          status: "closed",
        },
      });
    } catch (error: unknown) {
      console.error("Failed to send delivery completion message:", error);
      messageStatus = "failed";
      messageError = (error as Error).message || "Failed to send message";
    }

    return NextResponse.json({
      success: messageStatus === "sent",
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

