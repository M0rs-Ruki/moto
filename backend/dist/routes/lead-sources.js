"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const DEFAULT_LEAD_SOURCES = [
    "Ads",
    "Instagram",
    "Social Media",
    "Websites",
    "Customer Word-of-Mouth",
    "Other",
];
// Get lead sources
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    let leadSources = await db_1.default.leadSource.findMany({
        where: {
            dealershipId: req.user.dealershipId,
        },
        orderBy: [
            { order: "asc" },
            { name: "asc" },
        ],
    });
    // If no lead sources exist, seed defaults
    if (leadSources.length === 0) {
        const dealershipId = req.user.dealershipId;
        leadSources = await Promise.all(DEFAULT_LEAD_SOURCES.map((name, index) => db_1.default.leadSource.create({
            data: {
                name,
                order: index,
                isDefault: true,
                dealershipId,
            },
        })));
    }
    res.json({ leadSources });
}));
// Create lead source
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name, order } = req.body;
    if (!name || !name.trim()) {
        res.status(400).json({ error: "Name is required" });
        return;
    }
    // Check if name already exists
    const existing = await db_1.default.leadSource.findFirst({
        where: {
            dealershipId: req.user.dealershipId,
            name: name.trim(),
        },
    });
    if (existing) {
        res.status(400).json({ error: "Lead source with this name already exists" });
        return;
    }
    // Get max order if not provided
    const maxOrder = order !== undefined
        ? order
        : await db_1.default.leadSource
            .findMany({
            where: { dealershipId: req.user.dealershipId },
            orderBy: { order: "desc" },
            take: 1,
        })
            .then((sources) => (sources[0]?.order ?? -1) + 1);
    const leadSource = await db_1.default.leadSource.create({
        data: {
            name: name.trim(),
            order: maxOrder,
            isDefault: false,
            dealershipId: req.user.dealershipId,
        },
    });
    res.json({ leadSource });
}));
// Update lead source
router.put("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id, name, order } = req.body;
    if (!id) {
        res.status(400).json({ error: "ID is required" });
        return;
    }
    // Check if lead source exists
    const existing = await db_1.default.leadSource.findFirst({
        where: {
            id,
            dealershipId: req.user.dealershipId,
        },
    });
    if (!existing) {
        res.status(404).json({ error: "Lead source not found" });
        return;
    }
    // If name is being changed, check for duplicates
    if (name && name.trim() !== existing.name) {
        const duplicate = await db_1.default.leadSource.findFirst({
            where: {
                dealershipId: req.user.dealershipId,
                name: name.trim(),
                id: { not: id },
            },
        });
        if (duplicate) {
            res.status(400).json({ error: "Lead source with this name already exists" });
            return;
        }
    }
    const updateData = {};
    if (name)
        updateData.name = name.trim();
    if (order !== undefined)
        updateData.order = order;
    const leadSource = await db_1.default.leadSource.update({
        where: { id },
        data: updateData,
    });
    res.json({ leadSource });
}));
// Delete lead source
router.delete("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: "ID is required" });
        return;
    }
    // Check if lead source exists
    const existing = await db_1.default.leadSource.findFirst({
        where: {
            id,
            dealershipId: req.user.dealershipId,
        },
    });
    if (!existing) {
        res.status(404).json({ error: "Lead source not found" });
        return;
    }
    // Delete the lead source
    await db_1.default.leadSource.delete({
        where: { id },
    });
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=lead-sources.js.map