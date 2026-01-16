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
const BATCH_SIZE = 100;
// Send scheduled messages
router.get("/send-scheduled-messages", (0, auth_1.asyncHandler)(async (req, res) => {
    // Vercel cron authentication
    const authHeader = req.headers.authorization;
    const vercelCronHeader = req.headers["x-vercel-cron"];
    const cronSecret = process.env.CRON_SECRET;
    // Check if this is a Vercel cron request
    const isVercelCron = vercelCronHeader === "1";
    // If not a Vercel cron, check for manual authorization
    if (!isVercelCron) {
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
    }
    const now = new Date();
    // Find all pending messages that should be sent now
    const pendingMessages = await db_1.default.scheduledMessage.findMany({
        where: {
            status: "pending",
            scheduledFor: {
                lte: now,
            },
        },
        include: {
            deliveryTicket: {
                include: {
                    model: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
        take: BATCH_SIZE,
        orderBy: {
            scheduledFor: "asc",
        },
    });
    if (pendingMessages.length === 0) {
        res.json({
            success: true,
            processed: 0,
            message: "No pending messages to process",
        });
        return;
    }
    let sentCount = 0;
    let failedCount = 0;
    // Process messages in parallel
    const results = await Promise.allSettled(pendingMessages.map(async (scheduledMessage) => {
        const ticket = scheduledMessage.deliveryTicket;
        // Get delivery template
        const template = await db_1.default.whatsAppTemplate.findFirst({
            where: {
                dealershipId: ticket.dealershipId,
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
            await db_1.default.scheduledMessage.update({
                where: { id: scheduledMessage.id },
                data: {
                    status: "failed",
                    retryCount: scheduledMessage.retryCount + 1,
                },
            });
            return { success: false, reason: "Template not found" };
        }
        if (!template.templateId || !template.templateName) {
            await db_1.default.scheduledMessage.update({
                where: { id: scheduledMessage.id },
                data: {
                    status: "failed",
                    retryCount: scheduledMessage.retryCount + 1,
                },
            });
            return {
                success: false,
                reason: "Template not fully configured",
            };
        }
        try {
            const modelName = ticket.model
                ? `${ticket.model.category.name} - ${ticket.model.name}`
                : "N/A";
            const deliveryDate = new Date(ticket.deliveryDate);
            const scheduledDate = new Date(scheduledMessage.scheduledFor);
            deliveryDate.setHours(0, 0, 0, 0);
            scheduledDate.setHours(0, 0, 0, 0);
            const diffTime = deliveryDate.getTime() - scheduledDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            const daysBeforeStr = String(diffDays);
            await whatsapp_1.whatsappClient.sendTemplate({
                contactNumber: ticket.whatsappNumber,
                templateName: template.templateName,
                templateId: template.templateId,
                templateLanguage: template.language,
                parameters: [modelName, daysBeforeStr],
            });
            await db_1.default.scheduledMessage.update({
                where: { id: scheduledMessage.id },
                data: {
                    status: "sent",
                    sentAt: new Date(),
                },
            });
            await db_1.default.deliveryTicket.update({
                where: { id: ticket.id },
                data: { messageSent: true },
            });
            return { success: true };
        }
        catch (error) {
            const retryCount = scheduledMessage.retryCount + 1;
            const maxRetries = 3;
            if (retryCount >= maxRetries) {
                await db_1.default.scheduledMessage.update({
                    where: { id: scheduledMessage.id },
                    data: {
                        status: "failed",
                        retryCount,
                    },
                });
                return {
                    success: false,
                    reason: error.message || "Failed to send",
                };
            }
            else {
                await db_1.default.scheduledMessage.update({
                    where: { id: scheduledMessage.id },
                    data: {
                        retryCount,
                    },
                });
                return {
                    success: false,
                    reason: error.message || "Failed to send",
                    willRetry: true,
                };
            }
        }
    }));
    // Count results
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            if (result.value.success) {
                sentCount++;
            }
            else {
                failedCount++;
            }
        }
        else {
            failedCount++;
        }
    });
    res.json({
        success: true,
        processed: pendingMessages.length,
        sent: sentCount,
        failed: failedCount,
    });
}));
exports.default = router;
//# sourceMappingURL=cron.js.map