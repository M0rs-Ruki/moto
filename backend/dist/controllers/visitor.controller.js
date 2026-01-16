"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorController = void 0;
const visitor_service_1 = require("../services/visitor.service");
const constants_1 = require("../config/constants");
class VisitorController {
    constructor() {
        /**
         * Create a visitor
         * POST /api/visitors
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
                const result = await this.service.createVisitor(data, req.user.dealershipId);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        /**
         * Get visitors
         * GET /api/visitors
         */
        this.getAll = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const phoneNumber = req.query.phone;
            // If phone number provided, do lookup
            if (phoneNumber) {
                try {
                    const result = await this.service.lookupByPhone(phoneNumber, req.user.dealershipId);
                    res.json(result);
                    return;
                }
                catch (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
            }
            // Otherwise, get paginated list
            const limit = parseInt(req.query.limit || String(constants_1.PAGINATION.DEFAULT_LIMIT), 10);
            const skip = parseInt(req.query.skip || String(constants_1.PAGINATION.DEFAULT_SKIP), 10);
            try {
                const result = await this.service.getVisitors(req.user.dealershipId, limit, skip);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        /**
         * Create session for existing visitor
         * POST /api/visitors/session
         */
        this.createSession = async (req, res) => {
            if (!req.user || !req.user.dealershipId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            const data = req.body;
            // Validate required fields
            if (!data.visitorId || !data.reason) {
                res.status(400).json({ error: "Missing required fields: visitorId and reason" });
                return;
            }
            try {
                const result = await this.service.createSession(data, req.user.dealershipId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error.message;
                if (errorMessage === "Visitor not found") {
                    res.status(404).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: errorMessage });
                }
            }
        };
        this.service = new visitor_service_1.VisitorService();
    }
}
exports.VisitorController = VisitorController;
//# sourceMappingURL=visitor.controller.js.map