"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all categories
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const categories = await db_1.default.vehicleCategory.findMany({
        where: {
            dealershipId: req.user.dealershipId,
        },
        include: {
            models: {
                include: {
                    variants: {
                        orderBy: {
                            name: "asc",
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
    res.json({ categories });
}));
// Create category
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: "Category name is required" });
        return;
    }
    const category = await db_1.default.vehicleCategory.create({
        data: {
            name,
            dealershipId: req.user.dealershipId,
        },
    });
    res.json({ success: true, category });
}));
// Delete category
router.delete("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: "Category ID is required" });
        return;
    }
    // Verify category belongs to user's dealership
    const category = await db_1.default.vehicleCategory.findFirst({
        where: {
            id,
            dealershipId: req.user.dealershipId,
        },
    });
    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }
    // Delete category (models will be cascade deleted)
    await db_1.default.vehicleCategory.delete({
        where: { id },
    });
    res.json({ success: true, message: "Category deleted" });
}));
exports.default = router;
//# sourceMappingURL=categories.js.map