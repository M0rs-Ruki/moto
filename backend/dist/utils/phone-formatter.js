/**
 * Phone number formatting utilities
 */
/**
 * Format phone number to include country code if missing
 */
export function formatPhoneNumber(phone) {
    // Remove any non-digit characters and plus sign
    let cleaned = phone.replace(/\D/g, "");
    // If already has country code and is 12 digits, use as-is
    if (cleaned.length === 12) {
        // Return with + prefix for WhatsApp API
        return "+" + cleaned;
    }
    // If 10 digits, assume India and add 91
    if (cleaned.length === 10) {
        // Return with + prefix for WhatsApp API
        return "+91" + cleaned;
    }
    // For any other case, try to add +
    return "+" + cleaned;
}
/**
 * Normalize phone number for comparison (remove +, spaces, etc.)
 */
export function normalizePhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");
    // If it starts with 91 and is 12 digits, remove the 91 prefix for comparison
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
        return cleaned.substring(2);
    }
    // Return last 10 digits (in case of any other formatting)
    return cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
}
//# sourceMappingURL=phone-formatter.js.map