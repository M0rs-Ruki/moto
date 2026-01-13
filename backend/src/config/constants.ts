/**
 * Application constants
 */

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 1000,
  DEFAULT_SKIP: 0,
} as const;

export const LEAD_SCOPE = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
} as const;

export type LeadScope = typeof LEAD_SCOPE[keyof typeof LEAD_SCOPE];

export const SESSION_STATUS = {
  ACTIVE: "active",
  EXITED: "exited",
} as const;

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];

export const WHATSAPP_TEMPLATE_TYPES = {
  DIGITAL_ENQUIRY: "digital_enquiry",
  FIELD_INQUIRY: "field_inquiry",
  DELIVERY_TICKET: "delivery_ticket",
} as const;

export const EXCEL = {
  SUPPORTED_EXTENSIONS: [".xlsx", ".xls"],
  REQUIRED_COLUMNS: {
    DIGITAL_ENQUIRY: ["Date", "Name", "WhatsApp Number", "Model"],
    FIELD_INQUIRY: ["Date", "Name", "WhatsApp Number", "Model"],
  },
} as const;

export const PHONE_NUMBER = {
  INDIA_COUNTRY_CODE: "91",
  MIN_LENGTH: 10,
  MAX_LENGTH: 15,
} as const;
