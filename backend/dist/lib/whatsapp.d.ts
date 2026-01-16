/**
 * Reusable axios client for WhatsApp API
 */
declare class WhatsAppClient {
    private client;
    constructor();
    /**
     * Format phone number to include country code if missing
     */
    private formatPhoneNumber;
    /**
     * Get a contact by phone number
     */
    getContactByPhone(phoneNumber: string): Promise<{
        contactId: string;
    } | null>;
    /**
     * Create a new contact in WhatsApp
     */
    createContact(data: {
        firstName: string;
        lastName: string;
        contact_number: string;
        email?: string;
        address?: string;
    }): Promise<{
        contactId: string;
        success: boolean;
    }>;
    /**
     * Send a WhatsApp template message
     */
    sendTemplate(data: {
        contactId?: string;
        contactNumber: string;
        templateName: string;
        templateId: string;
        templateLanguage?: string;
        defaultMedia?: boolean;
        mediaType?: string;
        mediaLink?: string;
        parameters?: string[];
        couponCode?: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
    }>;
}
export declare const whatsappClient: WhatsAppClient;
export {};
//# sourceMappingURL=whatsapp.d.ts.map