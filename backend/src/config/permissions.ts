/**
 * Permission constants for RBAC system
 * These constants define the permission keys used throughout the application
 */
export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  DAILY_WALKINS_VISITORS: "dailyWalkinsVisitors",
  DAILY_WALKINS_SESSIONS: "dailyWalkinsSessions",
  DIGITAL_ENQUIRY: "digitalEnquiry",
  FIELD_INQUIRY: "fieldInquiry",
  DELIVERY_UPDATE: "deliveryUpdate",
  SETTINGS_PROFILE: "settingsProfile",
  SETTINGS_VEHICLE_MODELS: "settingsVehicleModels",
  SETTINGS_LEAD_SOURCES: "settingsLeadSources",
  SETTINGS_WHATSAPP: "settingsWhatsApp",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];
