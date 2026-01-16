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
// Create test drive
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { sessionId, modelId, variantId } = req.body;
    if (!sessionId || !modelId) {
        res.status(400).json({ error: "Session ID and model ID are required" });
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
    // Create test drive record
    const testDrive = await db_1.default.testDrive.create({
        data: {
            sessionId,
            modelId,
            variantId: variantId || null,
        },
        include: {
            model: true,
            variant: true,
        },
    });
    // Update session status
    await db_1.default.visitorSession.update({
        where: { id: sessionId },
        data: { status: "test_drive" },
    });
    // Send test drive message
    const template = await db_1.default.whatsAppTemplate.findFirst({
        where: {
            dealershipId: req.user.dealershipId,
            type: "test_drive",
        },
    });
    let messageStatus = "not_sent";
    let messageError = null;
    if (template && session.visitor.whatsappNumber) {
        try {
            const dealership = await db_1.default.dealership.findUnique({
                where: { id: req.user.dealershipId },
                select: { showroomNumber: true },
            });
            const showroomNumber = dealership?.showroomNumber || "999999999";
            await whatsapp_1.whatsappClient.sendTemplate({
                contactNumber: session.visitor.whatsappNumber,
                templateName: template.templateName,
                templateId: template.templateId,
                templateLanguage: template.language,
                parameters: [showroomNumber],
            });
            messageStatus = "sent";
        }
        catch (error) {
            console.error("Failed to send test drive message:", error);
            messageStatus = "failed";
            messageError = error.message || "Failed to send test drive message";
        }
    }
    res.json({
        success: true,
        testDrive: {
            id: testDrive.id,
        },
        message: {
            status: messageStatus,
            error: messageError,
        },
    });
}));
// Get test drives
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const testDrives = await db_1.default.testDrive.findMany({
        where: {
            session: {
                visitor: {
                    dealershipId: req.user.dealershipId,
                },
            },
        },
        include: {
            model: {
                include: {
                    category: true,
                },
            },
            session: {
                include: {
                    visitor: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    res.json({ testDrives });
}));
exports.default = router;
//# sourceMappingURL=test-drives.js.map