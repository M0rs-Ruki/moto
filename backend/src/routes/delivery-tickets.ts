import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { whatsappClient } from "../lib/whatsapp";
import { authenticate, asyncHandler } from "../middleware/auth";

const router = Router();

// Create delivery ticket
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

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
      scheduleOption,
    } = req.body;

    if (!firstName || !lastName || !whatsappNumber || !deliveryDate || !modelId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const deliveryDateObj = new Date(deliveryDate);
    if (isNaN(deliveryDateObj.getTime())) {
      res.status(400).json({ error: "Invalid delivery date" });
      return;
    }

    const [existingVisitor, existingEnquiry, existingTicket] = await Promise.all([
      prisma.visitor.findFirst({
        where: {
          dealershipId: req.user.dealershipId,
          whatsappNumber: whatsappNumber,
          whatsappContactId: { not: null },
        },
        select: { whatsappContactId: true },
      }),
      prisma.digitalEnquiry.findFirst({
        where: {
          dealershipId: req.user.dealershipId,
          whatsappNumber: whatsappNumber,
          whatsappContactId: { not: null },
        },
        select: { whatsappContactId: true },
      }),
      prisma.deliveryTicket.findFirst({
        where: {
          dealershipId: req.user.dealershipId,
          whatsappNumber: whatsappNumber,
          whatsappContactId: { not: null },
        },
        select: { whatsappContactId: true },
      }),
    ]);

    let whatsappContactId =
      existingTicket?.whatsappContactId ||
      existingEnquiry?.whatsappContactId ||
      existingVisitor?.whatsappContactId ||
      "";

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
      } catch (error: unknown) {
        console.error("Failed to create WhatsApp contact:", (error as Error).message);
        whatsappContactId = "";
      }
    }

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
        dealershipId: req.user.dealershipId,
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

    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "delivery_reminder",
        OR: [
          { section: "delivery_update" },
          { section: "global" },
          { section: null },
        ],
      },
      orderBy: [{ section: "asc" }],
    });

    if (
      !template ||
      (!whatsappContactId && !whatsappNumber) ||
      !template.templateId ||
      !template.templateName
    ) {
      // Template not configured or missing
    } else {
      if (scheduleOption === "now") {
        try {
          const modelName = ticket.model
            ? `${ticket.model.category.name} - ${ticket.model.name}`
            : "N/A";

          const deliveryDateFormatted = deliveryDateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          await whatsappClient.sendTemplate({
            contactId: whatsappContactId,
            contactNumber: whatsappNumber,
            templateName: template.templateName,
            templateId: template.templateId,
            templateLanguage: template.language,
            parameters: [modelName, deliveryDateFormatted],
          });
          messageStatus = "sent";

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
        const daysBefore = scheduleOption === "d3" ? 3 : scheduleOption === "d2" ? 2 : 1;
        const scheduledFor = new Date(deliveryDateObj);
        scheduledFor.setDate(scheduledFor.getDate() - daysBefore);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduledDateNormalized = new Date(scheduledFor);
        scheduledDateNormalized.setHours(0, 0, 0, 0);

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
          try {
            const modelName = ticket.model
              ? `${ticket.model.category.name} - ${ticket.model.name}`
              : "N/A";

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

    res.json({
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
  })
);

// Get delivery tickets
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const limit = parseInt((req.query.limit as string) || "50", 10);
    const skip = parseInt((req.query.skip as string) || "0", 10);

    const total = await prisma.deliveryTicket.count({
      where: {
        dealershipId: req.user.dealershipId,
      },
    });

    const tickets = await prisma.deliveryTicket.findMany({
      where: {
        dealershipId: req.user.dealershipId,
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

    res.json({
      tickets,
      total,
      hasMore,
    });
  })
);

// Send now
router.post(
  "/:id/send-now",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id: ticketId } = req.params;

    const ticket = await prisma.deliveryTicket.findFirst({
      where: {
        id: ticketId,
        dealershipId: req.user.dealershipId,
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
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    let whatsappContactId = ticket.whatsappContactId;
    if (!whatsappContactId) {
      try {
        const existingContact = await whatsappClient.getContactByPhone(
          ticket.whatsappNumber
        );

        if (existingContact?.contactId) {
          whatsappContactId = existingContact.contactId;
        } else {
          const contactResult = await whatsappClient.createContact({
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            contact_number: ticket.whatsappNumber,
            email: ticket.email || "",
            address: ticket.address || "",
          });

          whatsappContactId = contactResult.contactId || "";
        }

        if (whatsappContactId) {
          await prisma.deliveryTicket.update({
            where: { id: ticket.id },
            data: { whatsappContactId },
          });
        }
      } catch (error) {
        console.error("Failed to create/fetch WhatsApp contact:", error);
      }
    }

    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "delivery_reminder",
        OR: [
          { section: "delivery_update" },
          { section: "global" },
          { section: null },
        ],
      },
      orderBy: [{ section: "asc" }],
    });

    if (!template) {
      res.status(400).json({
        error: "Delivery template not configured. Please add a Delivery Reminder template in Global Settings.",
      });
      return;
    }

    if (!template.templateId || !template.templateName) {
      res.status(400).json({
        error: "Delivery template is not fully configured. Please fill in Template ID and Template Name in Global Settings.",
      });
      return;
    }

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

    let messageStatus = "sent";
    let messageError = null;

    try {
      const modelName = ticket.model
        ? `${ticket.model.category.name} - ${ticket.model.name}`
        : "N/A";

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

      await prisma.deliveryTicket.update({
        where: { id: ticket.id },
        data: { messageSent: true },
      });
    } catch (error: unknown) {
      console.error("Failed to send delivery message:", error);
      messageStatus = "failed";
      messageError = (error as Error).message || "Failed to send message";
    }

    res.json({
      success: true,
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  })
);

// Send completion
router.post(
  "/:id/send-completion",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id: ticketId } = req.params;

    const ticket = await prisma.deliveryTicket.findFirst({
      where: {
        id: ticketId,
        dealershipId: req.user.dealershipId,
      },
    });

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    let whatsappContactId = ticket.whatsappContactId;
    if (!whatsappContactId) {
      try {
        const existingContact = await whatsappClient.getContactByPhone(
          ticket.whatsappNumber
        );

        if (existingContact?.contactId) {
          whatsappContactId = existingContact.contactId;
        } else {
          const contactResult = await whatsappClient.createContact({
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            contact_number: ticket.whatsappNumber,
            email: ticket.email || "",
            address: ticket.address || "",
          });

          whatsappContactId = contactResult.contactId || "";
        }

        if (whatsappContactId) {
          await prisma.deliveryTicket.update({
            where: { id: ticket.id },
            data: { whatsappContactId },
          });
        }
      } catch (error) {
        console.error("Failed to create/fetch WhatsApp contact:", error);
      }
    }

    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "delivery_completion",
        section: "delivery_update",
      },
    });

    if (!template) {
      res.status(400).json({
        error: "Delivery Completion template not configured. Please add a Delivery Completion template in Global Settings.",
      });
      return;
    }

    if (!template.templateId || !template.templateName) {
      res.status(400).json({
        error: "Delivery Completion template is not fully configured. Please fill in Template ID and Template Name in Global Settings.",
      });
      return;
    }

    if (ticket.completionSent || ticket.status === "closed") {
      res.status(400).json({
        error: "Completion message has already been sent for this ticket. Ticket is closed.",
      });
      return;
    }

    let messageStatus = "sent";
    let messageError = null;

    try {
      await whatsappClient.sendTemplate({
        contactId: whatsappContactId || undefined,
        contactNumber: ticket.whatsappNumber,
        templateName: template.templateName,
        templateId: template.templateId,
        templateLanguage: template.language,
        parameters: [],
      });

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

    res.json({
      success: messageStatus === "sent",
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  })
);

export default router;
