/**
 * Application constants
 */
export declare const PAGINATION: {
    readonly DEFAULT_LIMIT: 50;
    readonly MAX_LIMIT: 1000;
    readonly DEFAULT_SKIP: 0;
};
export declare const LEAD_SCOPE: {
    readonly HOT: "hot";
    readonly WARM: "warm";
    readonly COLD: "cold";
};
export type LeadScope = typeof LEAD_SCOPE[keyof typeof LEAD_SCOPE];
export declare const SESSION_STATUS: {
    readonly ACTIVE: "active";
    readonly EXITED: "exited";
};
export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
export declare const WHATSAPP_TEMPLATE_TYPES: {
    readonly DIGITAL_ENQUIRY: "digital_enquiry";
    readonly FIELD_INQUIRY: "field_inquiry";
    readonly DELIVERY_TICKET: "delivery_ticket";
};
export declare const EXCEL: {
    readonly SUPPORTED_EXTENSIONS: readonly [".xlsx", ".xls"];
    readonly REQUIRED_COLUMNS: {
        readonly DIGITAL_ENQUIRY: readonly ["Date", "Name", "WhatsApp Number", "Model"];
        readonly FIELD_INQUIRY: readonly ["Date", "Name", "WhatsApp Number", "Model"];
    };
};
export declare const PHONE_NUMBER: {
    readonly INDIA_COUNTRY_CODE: "91";
    readonly MIN_LENGTH: 10;
    readonly MAX_LENGTH: 15;
};
//# sourceMappingURL=constants.d.ts.map