"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create variant
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name, modelId } = req.body;
    if (!name || !modelId) {
        res.status(400).json({ error: "Variant name and model ID are required" });
        return;
    }
    // Verify model belongs to user's dealership through category
    const model = await db_1.default.vehicleModel.findFirst({
        where: {
            id: modelId,
            category: {
                dealershipId: req.user.dealershipId,
            },
        },
    });
    if (!model) {
        res.status(404).json({ error: "Model not found" });
        return;
    }
    const variant = await db_1.default.vehicleVariant.create({
        data: {
            name,
            modelId,
        },
    });
    res.json({ success: true, variant });
}));
// Delete variant
router.delete("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: "Variant ID is required" });
        return;
    }
    // Verify variant belongs to user's dealership through model and category
    const variant = await db_1.default.vehicleVariant.findFirst({
        where: {
            id,
            model: {
                category: {
                    dealershipId: req.user.dealershipId,
                },
            },
        },
    });
    if (!variant) {
        res.status(404).json({ error: "Variant not found" });
        return;
    }
    // Delete variant
    await db_1.default.vehicleVariant.delete({
        where: { id },
    });
    res.json({ success: true, message: "Variant deleted" });
}));
exports.default = router;
//# sourceMappingURL=variants.js.map