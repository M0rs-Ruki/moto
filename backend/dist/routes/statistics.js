"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get statistics
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const countByDateRange = async (model, whereClause, dateField = "createdAt") => {
        const today = await model.count({
            where: {
                ...whereClause,
                [dateField]: {
                    gte: todayStart,
                },
            },
        });
        const week = await model.count({
            where: {
                ...whereClause,
                [dateField]: {
                    gte: weekStart,
                },
            },
        });
        const month = await model.count({
            where: {
                ...whereClause,
                [dateField]: {
                    gte: monthStart,
                },
            },
        });
        const year = await model.count({
            where: {
                ...whereClause,
                [dateField]: {
                    gte: yearStart,
                },
            },
        });
        const total = await model.count({
            where: whereClause,
        });
        return { today, week, month, year, total };
    };
    const baseWhere = { dealershipId: req.user.dealershipId };
    const dailyWalkins = await countByDateRange(db_1.default.visitor, baseWhere);
    const digitalEnquiry = await countByDateRange(db_1.default.digitalEnquiry, baseWhere);
    const fieldInquiry = await countByDateRange(db_1.default.fieldInquiry, baseWhere);
    const deliveryUpdate = await countByDateRange(db_1.default.deliveryTicket, baseWhere);
    res.json({
        dailyWalkins,
        digitalEnquiry,
        fieldInquiry,
        deliveryUpdate,
    });
}));
exports.default = router;
//# sourceMappingURL=statistics.js.map