import { DigitalEnquiryService } from "../services/digital-enquiry.service";
import { PAGINATION } from "../config/constants";
export class DigitalEnquiryController {
    constructor() {
        /**
         * Create a digital enquiry
         * POST /api/digital-enquiry
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
                const result = await this.service.createEnquiry(data, req.user.dealershipId);
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
         * Get digital enquiries
         * GET /api/digital-enquiry
         */
        this.getAll = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const limit = parseInt(req.query.limit || String(PAGINATION.DEFAULT_LIMIT), 10);
            const skip = parseInt(req.query.skip || String(PAGINATION.DEFAULT_SKIP), 10);
            try {
                const result = await this.service.getEnquiries(req.user.dealershipId, limit, skip);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        /**
         * Update lead scope
         * PATCH /api/digital-enquiry/:id
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
                if (errorMessage === "Enquiry not found") {
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
         * Bulk upload digital enquiries
         * POST /api/digital-enquiry/bulk
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
        this.service = new DigitalEnquiryService();
    }
}
//# sourceMappingURL=digital-enquiry.controller.js.map