"use strict";
/**
 * Application constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHONE_NUMBER = exports.EXCEL = exports.WHATSAPP_TEMPLATE_TYPES = exports.SESSION_STATUS = exports.LEAD_SCOPE = exports.PAGINATION = void 0;
exports.PAGINATION = {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 1000,
    DEFAULT_SKIP: 0,
};
exports.LEAD_SCOPE = {
    HOT: "hot",
    WARM: "warm",
    COLD: "cold",
};
exports.SESSION_STATUS = {
    ACTIVE: "active",
    EXITED: "exited",
};
exports.WHATSAPP_TEMPLATE_TYPES = {
    DIGITAL_ENQUIRY: "digital_enquiry",
    FIELD_INQUIRY: "field_inquiry",
    DELIVERY_TICKET: "delivery_ticket",
};
exports.EXCEL = {
    SUPPORTED_EXTENSIONS: [".xlsx", ".xls"],
    REQUIRED_COLUMNS: {
        DIGITAL_ENQUIRY: ["Date", "Name", "WhatsApp Number", "Model"],
        FIELD_INQUIRY: ["Date", "Name", "WhatsApp Number", "Model"],
    },
};
exports.PHONE_NUMBER = {
    INDIA_COUNTRY_CODE: "91",
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
};
//# sourceMappingURL=constants.js.map