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
// Get sessions
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const visitorId = req.query.visitorId;
    const limit = parseInt(req.query.limit || "30", 10);
    const skip = parseInt(req.query.skip || "0", 10);
    // Get total count
    const totalCount = await db_1.default.visitorSession.count({
        where: {
            visitor: {
                dealershipId: req.user.dealershipId,
                ...(visitorId ? { id: visitorId } : {}),
            },
        },
    });
    const sessions = await db_1.default.visitorSession.findMany({
        where: {
            visitor: {
                dealershipId: req.user.dealershipId,
                ...(visitorId ? { id: visitorId } : {}),
            },
        },
        include: {
            visitor: true,
            testDrives: {
                include: {
                    model: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
            visitorInterests: {
                where: {
                    sessionId: {
                        not: null,
                    },
                },
                include: {
                    model: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
        skip: skip,
    });
    const hasMore = skip + limit < totalCount;
    res.json({
        sessions,
        hasMore,
        total: totalCount,
        skip,
        limit,
    });
}));
// Exit session
router.post("/exit", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { sessionId } = req.body;
    if (!sessionId) {
        res.status(400).json({ error: "Session ID is required" });
        return;
    }
    // Verify session belongs to user's dealership
    const session = await db_1.default.visitorSession.findFirst({
        where: {
            id: sessionId,
            visitor: {
                dealershipId: req.user.dealershipId,
            },
        },
        include: {
            visitor: true,
        },
    });
    if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
    }
    // Update session status
    await db_1.default.visitorSession.update({
        where: { id: sessionId },
        data: {
            status: "exited",
        },
    });
    // Send exit message
    const template = await db_1.default.whatsAppTemplate.findFirst({
        where: {
            dealershipId: req.user.dealershipId,
            type: "exit",
        },
    });
    let messageStatus = "not_sent";
    let messageError = null;
    if (template && session.visitor.whatsappNumber) {
        try {
            await whatsapp_1.whatsappClient.sendTemplate({
                contactNumber: session.visitor.whatsappNumber,
                templateName: template.templateName,
                templateId: template.templateId,
                templateLanguage: template.language,
                parameters: [],
            });
            messageStatus = "sent";
        }
        catch (error) {
            console.error("Failed to send exit message:", error);
            messageStatus = "failed";
            messageError = error.message || "Failed to send exit message";
        }
    }
    res.json({
        success: true,
        message: {
            status: messageStatus,
            error: messageError,
        },
    });
}));
exports.default = router;
//# sourceMappingURL=sessions.js.map