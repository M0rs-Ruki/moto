"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get dealership
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const dealership = await db_1.default.dealership.findUnique({
        where: { id: req.user.dealershipId },
        select: {
            id: true,
            name: true,
            location: true,
            showroomNumber: true,
        },
    });
    if (!dealership) {
        res.status(404).json({ error: "Dealership not found" });
        return;
    }
    res.json({ dealership });
}));
// Update dealership
router.put("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name, location, showroomNumber } = req.body;
    if (!name || !location) {
        res.status(400).json({ error: "Name and location are required" });
        return;
    }
    const dealership = await db_1.default.dealership.update({
        where: { id: req.user.dealershipId },
        data: {
            name,
            location,
            showroomNumber: showroomNumber || null,
        },
        select: {
            id: true,
            name: true,
            location: true,
            showroomNumber: true,
        },
    });
    res.json({ success: true, dealership });
}));
exports.default = router;
//# sourceMappingURL=dealership.js.map