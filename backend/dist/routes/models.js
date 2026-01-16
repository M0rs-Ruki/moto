"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create model
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name, year, categoryId } = req.body;
    if (!name || !categoryId) {
        res.status(400).json({ error: "Model name and category are required" });
        return;
    }
    // Verify category belongs to user's dealership
    const category = await db_1.default.vehicleCategory.findFirst({
        where: {
            id: categoryId,
            dealershipId: req.user.dealershipId,
        },
    });
    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }
    const model = await db_1.default.vehicleModel.create({
        data: {
            name,
            year: year ? parseInt(year) : null,
            categoryId,
        },
    });
    res.json({ success: true, model });
}));
// Delete model
router.delete("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: "Model ID is required" });
        return;
    }
    // Verify model belongs to user's dealership through category
    const model = await db_1.default.vehicleModel.findFirst({
        where: {
            id,
            category: {
                dealershipId: req.user.dealershipId,
            },
        },
    });
    if (!model) {
        res.status(404).json({ error: "Model not found" });
        return;
    }
    // Delete model
    await db_1.default.vehicleModel.delete({
        where: { id },
    });
    res.json({ success: true, message: "Model deleted" });
}));
exports.default = router;
//# sourceMappingURL=models.js.map