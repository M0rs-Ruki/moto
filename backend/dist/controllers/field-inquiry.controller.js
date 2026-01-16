"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldInquiryController = void 0;
const field_inquiry_service_1 = require("../services/field-inquiry.service");
const constants_1 = require("../config/constants");
class FieldInquiryController {
    constructor() {
        /**
         * Create a field inquiry
         * POST /api/field-inquiry
         */
        this.create = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const data = req.body;
            // Validate required fields
            if (!data.firstName || !data.lastName || !data.whatsappNumber || !data.reason) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }
            try {
                const result = await this.service.createInquiry(data, req.user.dealershipId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error.message;
                if (errorMessage.includes("Failed to create WhatsApp contact")) {
                    res.status(500).json({
                        error: "Failed to create WhatsApp contact",
                        details: errorMessage,
                    });
                }
                else {
                    res.status(500).json({ error: errorMessage });
                }
            }
        };
        /**
         * Get field inquiries
         * GET /api/field-inquiry
         */
        this.getAll = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const limit = parseInt(req.query.limit || String(constants_1.PAGINATION.DEFAULT_LIMIT), 10);
            const skip = parseInt(req.query.skip || String(constants_1.PAGINATION.DEFAULT_SKIP), 10);
            try {
                const result = await this.service.getInquiries(req.user.dealershipId, limit, skip);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        /**
         * Update lead scope
         * PATCH /api/field-inquiry/:id
         */
        this.updateLeadScope = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const { id } = req.params;
            const data = req.body;
            try {
                const result = await this.service.updateLeadScope(id, data, req.user.dealershipId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error.message;
                if (errorMessage === "Inquiry not found") {
                    res.status(404).json({ error: errorMessage });
                }
                else if (errorMessage.includes("Invalid leadScope")) {
                    res.status(400).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: errorMessage });
                }
            }
        };
        /**
         * Bulk upload field inquiries
         * POST /api/field-inquiry/bulk
         */
        this.bulkUpload = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const { rows } = req.body;
            if (!rows || !Array.isArray(rows) || rows.length === 0) {
                res.status(400).json({ error: "No data provided or invalid format" });
                return;
            }
            try {
                const result = await this.service.bulkUpload({ rows }, req.user.dealershipId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error.message;
                if (errorMessage.includes("Missing required columns") ||
                    errorMessage.includes("No data provided")) {
                    res.status(400).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: errorMessage });
                }
            }
        };
        this.service = new field_inquiry_service_1.FieldInquiryService();
    }
}
exports.FieldInquiryController = FieldInquiryController;
//# sourceMappingURL=field-inquiry.controller.js.map