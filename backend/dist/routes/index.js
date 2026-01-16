"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const categories_1 = __importDefault(require("./categories"));
const models_1 = __importDefault(require("./models"));
const variants_1 = __importDefault(require("./variants"));
const dealership_1 = __importDefault(require("./dealership"));
const lead_sources_1 = __importDefault(require("./lead-sources"));
const templates_1 = __importDefault(require("./templates"));
const visitors_routes_1 = __importDefault(require("./visitors.routes"));
const sessions_1 = __importDefault(require("./sessions"));
const test_drives_1 = __importDefault(require("./test-drives"));
const digital_enquiry_routes_1 = __importDefault(require("./digital-enquiry.routes"));
const field_inquiry_routes_1 = __importDefault(require("./field-inquiry.routes"));
const delivery_tickets_1 = __importDefault(require("./delivery-tickets"));
const statistics_1 = __importDefault(require("./statistics"));
const phone_lookup_1 = __importDefault(require("./phone-lookup"));
const cron_1 = __importDefault(require("./cron"));
const health_1 = __importDefault(require("./health"));
const debug_1 = __importDefault(require("./debug"));
const router = (0, express_1.Router)();
// Auth routes
router.use("/auth", auth_1.default);
// Data routes
router.use("/categories", categories_1.default);
router.use("/models", models_1.default);
router.use("/variants", variants_1.default);
router.use("/dealership", dealership_1.default);
router.use("/lead-sources", lead_sources_1.default);
router.use("/templates", templates_1.default);
// Visitor & Session routes
router.use("/visitors", visitors_routes_1.default);
router.use("/sessions", sessions_1.default);
router.use("/test-drives", test_drives_1.default);
// Business routes
router.use("/digital-enquiry", digital_enquiry_routes_1.default);
router.use("/field-inquiry", field_inquiry_routes_1.default);
router.use("/delivery-tickets", delivery_tickets_1.default);
// System routes
router.use("/statistics", statistics_1.default);
router.use("/phone-lookup", phone_lookup_1.default);
router.use("/cron", cron_1.default);
router.use("/health", health_1.default);
router.use("/debug", debug_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map