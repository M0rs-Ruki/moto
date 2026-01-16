"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const whatsapp_1 = require("../lib/whatsapp");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create delivery ticket
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { firstName, lastName, whatsappNumber, email, address, description, deliveryDate, modelId, variantId, scheduleOption, } = req.body;
    if (!firstName || !lastName || !whatsappNumber || !deliveryDate || !modelId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    const deliveryDateObj = new Date(deliveryDate);
    if (isNaN(deliveryDateObj.getTime())) {
        res.status(400).json({ error: "Invalid delivery date" });
        return;
    }
    const ticket = await db_1.default.deliveryTicket.create({
        data: {
            firstName,
            lastName,
            whatsappNumber,
            email: email || null,
            address: address || null,
            description: description || null,
            deliveryDate: deliveryDateObj,
            whatsappContactId: null,
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
    const template = await db_1.default.whatsAppTemplate.findFirst({
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
    if (!template || !template.templateId || !template.templateName) {
        // Template not configured or missing
    }
    else {
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
                await whatsapp_1.whatsappClient.sendTemplate({
                    contactNumber: whatsappNumber,
                    templateName: template.templateName,
                    templateId: template.templateId,
                    templateLanguage: template.language,
                    parameters: [modelName, deliveryDateFormatted],
                });
                messageStatus = "sent";
                await db_1.default.deliveryTicket.update({
                    where: { id: ticket.id },
                    data: { messageSent: true },
                });
            }
            catch (error) {
                console.error("Failed to send delivery message:", error);
                messageStatus = "failed";
                messageError = error.message || "Failed to send message";
            }
        }
        else {
            const daysBefore = scheduleOption === "d3" ? 3 : scheduleOption === "d2" ? 2 : 1;
            const scheduledFor = new Date(deliveryDateObj);
            scheduledFor.setDate(scheduledFor.getDate() - daysBefore);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const scheduledDateNormalized = new Date(scheduledFor);
            scheduledDateNormalized.setHours(0, 0, 0, 0);
            if (scheduledDateNormalized > today) {
                const scheduledMessage = await db_1.default.scheduledMessage.create({
                    data: {
                        deliveryTicketId: ticket.id,
                        scheduledFor,
                        status: "pending",
                    },
                });
                scheduledMessageId = scheduledMessage.id;
            }
            else {
                try {
                    const modelName = ticket.model
                        ? `${ticket.model.category.name} - ${ticket.model.name}`
                        : "N/A";
                    const daysBeforeStr = String(daysBefore);
                    await whatsapp_1.whatsappClient.sendTemplate({
                        contactNumber: whatsappNumber,
                        templateName: template.templateName,
                        templateId: template.templateId,
                        templateLanguage: template.language,
                        parameters: [modelName, daysBeforeStr],
                    });
                    messageStatus = "sent";
                    await db_1.default.deliveryTicket.update({
                        where: { id: ticket.id },
                        data: { messageSent: true },
                    });
                }
                catch (error) {
                    console.error("Failed to send delivery message:", error);
                    messageStatus = "failed";
                    messageError = error.message || "Failed to send message";
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
}));
// Get delivery tickets
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const limit = parseInt(req.query.limit || "50", 10);
    const skip = parseInt(req.query.skip || "0", 10);
    const total = await db_1.default.deliveryTicket.count({
        where: {
            dealershipId: req.user.dealershipId,
        },
    });
    const tickets = await db_1.default.deliveryTicket.findMany({
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
}));
// Send now
router.post("/:id/send-now", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id: ticketId } = req.params;
    const ticket = await db_1.default.deliveryTicket.findFirst({
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
    const template = await db_1.default.whatsAppTemplate.findFirst({
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
        await db_1.default.scheduledMessage.updateMany({
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
        await whatsapp_1.whatsappClient.sendTemplate({
            contactNumber: ticket.whatsappNumber,
            templateName: template.templateName,
            templateId: template.templateId,
            templateLanguage: template.language,
            parameters: [modelName, deliveryDateFormatted],
        });
        await db_1.default.deliveryTicket.update({
            where: { id: ticket.id },
            data: { messageSent: true },
        });
    }
    catch (error) {
        console.error("Failed to send delivery message:", error);
        messageStatus = "failed";
        messageError = error.message || "Failed to send message";
    }
    res.json({
        success: true,
        message: {
            status: messageStatus,
            error: messageError,
        },
    });
}));
// Send completion
router.post("/:id/send-completion", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id: ticketId } = req.params;
    const ticket = await db_1.default.deliveryTicket.findFirst({
        where: {
            id: ticketId,
            dealershipId: req.user.dealershipId,
        },
    });
    if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
    }
    const template = await db_1.default.whatsAppTemplate.findFirst({
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
        await whatsapp_1.whatsappClient.sendTemplate({
            contactNumber: ticket.whatsappNumber,
            templateName: template.templateName,
            templateId: template.templateId,
            templateLanguage: template.language,
            parameters: [],
        });
        await db_1.default.deliveryTicket.update({
            where: { id: ticket.id },
            data: {
                completionSent: true,
                messageSent: true,
                status: "closed",
            },
        });
    }
    catch (error) {
        console.error("Failed to send delivery completion message:", error);
        messageStatus = "failed";
        messageError = error.message || "Failed to send message";
    }
    res.json({
        success: messageStatus === "sent",
        message: {
            status: messageStatus,
            error: messageError,
        },
    });
}));
exports.default = router;
//# sourceMappingURL=delivery-tickets.js.map