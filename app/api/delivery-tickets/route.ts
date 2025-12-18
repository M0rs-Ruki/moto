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
    const {
      firstName,
      lastName,
      whatsappNumber,
      email,
      address,
      description,
      deliveryDate,
      modelId,
      sendNow,
    } = body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !whatsappNumber ||
      !deliveryDate ||
      !modelId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deliveryDateObj = new Date(deliveryDate);
    if (isNaN(deliveryDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid delivery date" },
        { status: 400 }
      );
    }

    // Check if contact already exists in any model (Visitor, DigitalEnquiry, or DeliveryTicket)
    const [existingVisitor, existingEnquiry, existingTicket] =
      await Promise.all([
        prisma.visitor.findFirst({
          where: {
            dealershipId: user.dealershipId,
            whatsappNumber: whatsappNumber,
            whatsappContactId: { not: null },
          },
          select: { whatsappContactId: true },
        }),
        prisma.digitalEnquiry.findFirst({
          where: {
            dealershipId: user.dealershipId,
            whatsappNumber: whatsappNumber,
            whatsappContactId: { not: null },
          },
          select: { whatsappContactId: true },
        }),
        prisma.deliveryTicket.findFirst({
          where: {
            dealershipId: user.dealershipId,
            whatsappNumber: whatsappNumber,
            whatsappContactId: { not: null },
          },
          select: { whatsappContactId: true },
        }),
      ]);

    // Get contact ID from any existing record
    let whatsappContactId =
      existingTicket?.whatsappContactId ||
      existingEnquiry?.whatsappContactId ||
      existingVisitor?.whatsappContactId ||
      "";

    // Create WhatsApp contact if it doesn't exist anywhere
    if (!whatsappContactId) {
      try {
        const contactResult = await whatsappClient.createContact({
          firstName,
          lastName,
          contact_number: whatsappNumber,
          email: email || "",
          address: address || "",
        });

        whatsappContactId = contactResult.contactId;

        if (!whatsappContactId) {
          throw new Error("No contact ID returned from WhatsApp API");
        }
      } catch (error: unknown) {
        console.error(
          "Failed to create WhatsApp contact:",
          (error as Error).message
        );
        return NextResponse.json(
          {
            error: "Failed to create WhatsApp contact",
            details: (error as Error).message,
          },
          { status: 500 }
        );
      }
    }

    // Create delivery ticket
    const ticket = await prisma.deliveryTicket.create({
      data: {
        firstName,
        lastName,
        whatsappNumber,
        email: email || null,
        address: address || null,
        description: description || null,
        deliveryDate: deliveryDateObj,
        whatsappContactId,
        dealershipId: user.dealershipId,
        modelId,
        messageSent: sendNow || false,
      },
      include: {
        model: {
          include: {
            category: true,
          },
        },
      },
    });

    let scheduledMessageId = null;
    let messageStatus = "not_sent";
    let messageError = null;

    // Get WhatsApp template for delivery (check section-specific first, then global)
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

    // Always send template message immediately when ticket is created (if template is configured and contact exists)
    if (
      template &&
      whatsappContactId &&
      template.templateId &&
      template.templateName
    ) {
      // Send message immediately with car model
      try {
        const modelName = ticket.model
          ? `${ticket.model.category.name} - ${ticket.model.name}`
          : "N/A";

        await whatsappClient.sendTemplate({
          contactId: whatsappContactId,
          contactNumber: whatsappNumber,
          templateName: template.templateName,
          templateId: template.templateId,
          templateLanguage: template.language,
          parameters: [modelName],
        });
        messageStatus = "sent";

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

      // Also schedule reminder for 3 days before delivery (if date is in the future)
      const scheduledFor = new Date(deliveryDateObj);
      scheduledFor.setDate(scheduledFor.getDate() - 3);

      // Only schedule if the date is in the future
      if (scheduledFor > new Date()) {
        const scheduledMessage = await prisma.scheduledMessage.create({
          data: {
            deliveryTicketId: ticket.id,
            scheduledFor,
            status: "pending",
          },
        });
        scheduledMessageId = scheduledMessage.id;
      }
    } else if (template && !whatsappContactId) {
      // Template exists but contact creation failed - log warning
      console.warn(
        "Template configured but no contact ID available for delivery ticket"
      );
    } else if (template && (!template.templateId || !template.templateName)) {
      // Template exists but not fully configured - log warning
      console.warn(
        "Delivery reminder template exists but Template ID or Template Name is missing. Please configure it in Global Settings."
      );
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        firstName: ticket.firstName,
        lastName: ticket.lastName,
      },
      scheduledMessageId,
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  } catch (error: unknown) {
    console.error("Create delivery ticket error:", error);
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

    const tickets = await prisma.deliveryTicket.findMany({
      where: {
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
          orderBy: {
            scheduledFor: "asc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ tickets });
  } catch (error: unknown) {
    console.error("Get delivery tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
