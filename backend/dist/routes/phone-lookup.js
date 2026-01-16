"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Single phone lookup
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const phoneNumber = req.query.phone;
    if (!phoneNumber) {
        res.status(400).json({ error: "Phone number is required" });
        return;
    }
    const [visitors, digitalEnquiries, fieldInquiries, deliveryTickets] = await Promise.all([
        db_1.default.visitor.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: phoneNumber,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            take: 1,
        }),
        db_1.default.digitalEnquiry.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: phoneNumber,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            take: 1,
        }),
        db_1.default.fieldInquiry.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: phoneNumber,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            take: 1,
        }),
        db_1.default.deliveryTicket.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: phoneNumber,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            take: 1,
        }),
    ]);
    const results = {
        dailyWalkins: visitors.length > 0,
        digitalEnquiry: digitalEnquiries.length > 0,
        fieldInquiry: fieldInquiries.length > 0,
        deliveryUpdate: deliveryTickets.length > 0,
        visitorId: visitors[0]?.id || null,
        enquiryId: digitalEnquiries[0]?.id || null,
        fieldInquiryId: fieldInquiries[0]?.id || null,
        ticketId: deliveryTickets[0]?.id || null,
    };
    res.json(results);
}));
// Batch phone lookup
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { phones } = req.body;
    if (!phones || !Array.isArray(phones) || phones.length === 0) {
        res.status(400).json({ error: "Phone numbers array is required" });
        return;
    }
    const phoneNumbers = phones.slice(0, 1000);
    const uniquePhones = [...new Set(phoneNumbers)];
    const [visitors, digitalEnquiries, fieldInquiries, deliveryTickets] = await Promise.all([
        db_1.default.visitor.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: { in: uniquePhones },
            },
            select: {
                id: true,
                whatsappNumber: true,
                firstName: true,
                lastName: true,
            },
        }),
        db_1.default.digitalEnquiry.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: { in: uniquePhones },
            },
            select: {
                id: true,
                whatsappNumber: true,
                firstName: true,
                lastName: true,
            },
        }),
        db_1.default.fieldInquiry.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: { in: uniquePhones },
            },
            select: {
                id: true,
                whatsappNumber: true,
                firstName: true,
                lastName: true,
            },
        }),
        db_1.default.deliveryTicket.findMany({
            where: {
                dealershipId: req.user.dealershipId,
                whatsappNumber: { in: uniquePhones },
            },
            select: {
                id: true,
                whatsappNumber: true,
                firstName: true,
                lastName: true,
            },
        }),
    ]);
    const visitorMap = new Map(visitors.map((v) => [v.whatsappNumber, v]));
    const enquiryMap = new Map(digitalEnquiries.map((e) => [e.whatsappNumber, e]));
    const fieldInquiryMap = new Map(fieldInquiries.map((f) => [f.whatsappNumber, f]));
    const ticketMap = new Map(deliveryTickets.map((t) => [t.whatsappNumber, t]));
    const results = {};
    uniquePhones.forEach((phone) => {
        const visitor = visitorMap.get(phone);
        const enquiry = enquiryMap.get(phone);
        const fieldInquiry = fieldInquiryMap.get(phone);
        const ticket = ticketMap.get(phone);
        results[phone] = {
            dailyWalkins: !!visitor,
            digitalEnquiry: !!enquiry,
            fieldInquiry: !!fieldInquiry,
            deliveryUpdate: !!ticket,
            visitorId: visitor?.id || null,
            enquiryId: enquiry?.id || null,
            fieldInquiryId: fieldInquiry?.id || null,
            ticketId: ticket?.id || null,
        };
    });
    res.json(results);
}));
exports.default = router;
//# sourceMappingURL=phone-lookup.js.map