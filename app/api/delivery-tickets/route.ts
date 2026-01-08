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
      variantId,
      scheduleOption, // "d3", "d2", "d1", or "now"
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

        whatsappContactId = contactResult.contactId || "";

        // If contact exists but ID can't be retrieved, that's okay
        // We can still send messages using phone number directly
        if (!whatsappContactId) {
          console.warn("No contact ID returned, but contact may exist. Will use phone number for messaging.");
        }
      } catch (error: unknown) {
        // Log error but continue - don't block ticket creation
        console.error(
          "Failed to create WhatsApp contact, continuing without contact ID:",
          (error as Error).message
        );
        // Continue with empty contact ID - ticket will be created but messages will use phone number
        whatsappContactId = "";
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
        variantId: variantId || null,
        messageSent: scheduleOption === "now" || false,
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

    if (
      !template ||
      (!whatsappContactId && !whatsappNumber) ||
      !template.templateId ||
      !template.templateName
    ) {
      if (template && !whatsappContactId && !whatsappNumber) {
        console.warn(
          "Template configured but no contact ID or phone number available for delivery ticket"
        );
      } else if (template && (!template.templateId || !template.templateName)) {
        console.warn(
          "Delivery reminder template exists but Template ID or Template Name is missing. Please configure it in Global Settings."
        );
      }
    } else {
      // Handle based on schedule option
      if (scheduleOption === "now") {
        // Send message immediately
        try {
          const modelName = ticket.model
            ? `${ticket.model.category.name} - ${ticket.model.name}`
            : "N/A";

          // Format delivery date for "Send Now" option
          const deliveryDateFormatted = deliveryDateObj.toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
            }
          );

          await whatsappClient.sendTemplate({
            contactId: whatsappContactId,
            contactNumber: whatsappNumber,
            templateName: template.templateName,
            templateId: template.templateId,
            templateLanguage: template.language,
            parameters: [modelName, deliveryDateFormatted],
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
      } else {
        // Schedule message for D-3, D-2, or D-1 days before delivery
        const daysBefore =
          scheduleOption === "d3" ? 3 : scheduleOption === "d2" ? 2 : 1;
        const scheduledFor = new Date(deliveryDateObj);
        scheduledFor.setDate(scheduledFor.getDate() - daysBefore);

        // Normalize dates to compare only the date portion (set time to midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduledDateNormalized = new Date(scheduledFor);
        scheduledDateNormalized.setHours(0, 0, 0, 0);

        // Only schedule if the date is in the future (after today)
        if (scheduledDateNormalized > today) {
          const scheduledMessage = await prisma.scheduledMessage.create({
            data: {
              deliveryTicketId: ticket.id,
              scheduledFor,
              status: "pending",
            },
          });
          scheduledMessageId = scheduledMessage.id;
        } else {
          // If scheduled date is today or in the past, send immediately instead
          try {
            const modelName = ticket.model
              ? `${ticket.model.category.name} - ${ticket.model.name}`
              : "N/A";

            // Send days before (3, 2, or 1) as second parameter
            const daysBeforeStr = String(daysBefore);

            await whatsappClient.sendTemplate({
              contactId: whatsappContactId,
              contactNumber: whatsappNumber,
              templateName: template.templateName,
              templateId: template.templateId,
              templateLanguage: template.language,
              parameters: [modelName, daysBeforeStr],
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
        }
      }
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

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    // Get total count for pagination
    const total = await prisma.deliveryTicket.count({
      where: {
        dealershipId: user.dealershipId,
      },
    });

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
      take: limit,
      skip: skip,
    });

    const hasMore = skip + tickets.length < total;

    return NextResponse.json({
      tickets,
      total,
      hasMore,
    });
  } catch (error: unknown) {
    console.error("Get delivery tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
