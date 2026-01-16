import { Router } from "express";
import prisma from "../lib/db";
import { whatsappClient } from "../lib/whatsapp";
import { authenticate, asyncHandler } from "../middleware/auth";
const router = Router();
// Get sessions
router.get("/", authenticate, asyncHandler(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const visitorId = req.query.visitorId;
    const limit = parseInt(req.query.limit || "30", 10);
    const skip = parseInt(req.query.skip || "0", 10);
    // Get total count
    const totalCount = await prisma.visitorSession.count({
        where: {
            visitor: {
                dealershipId: req.user.dealershipId,
                ...(visitorId ? { id: visitorId } : {}),
            },
        },
    });
    const sessions = await prisma.visitorSession.findMany({
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
router.post("/exit", authenticate, asyncHandler(async (req, res) => {
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
    const session = await prisma.visitorSession.findFirst({
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
    await prisma.visitorSession.update({
        where: { id: sessionId },
        data: {
            status: "exited",
        },
    });
    // Send exit message
    const template = await prisma.whatsAppTemplate.findFirst({
        where: {
            dealershipId: req.user.dealershipId,
            type: "exit",
        },
    });
    let messageStatus = "not_sent";
    let messageError = null;
    if (template && session.visitor.whatsappNumber) {
        try {
            await whatsappClient.sendTemplate({
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
export default router;
//# sourceMappingURL=sessions.js.map