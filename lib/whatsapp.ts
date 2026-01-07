import axios, { AxiosInstance } from "axios";

/**
 * Reusable axios client for WhatsApp API
 */
class WhatsAppClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.WHATSAPP_API_URL || "https://api.chati.ai/v1/public/api",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        "x-access-key": process.env.WHATSAPP_API_ACCESS_KEY,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  /**
   * Format phone number to include country code if missing
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters and plus sign
    let cleaned = phone.replace(/\D/g, "");

    console.log(`formatPhoneNumber: input="${phone}" cleaned="${cleaned}"`);

    // If already has country code and is 12 digits, use as-is
    if (cleaned.length === 12) {
      // Return with + prefix for WhatsApp API
      const formatted = "+" + cleaned;
      console.log(
        `formatPhoneNumber: 12-digit format, returning "${formatted}"`
      );
      return formatted;
    }

    // If 10 digits, assume India and add 91
    if (cleaned.length === 10) {
      // Return with + prefix for WhatsApp API
      const formatted = "+91" + cleaned;
      console.log(
        `formatPhoneNumber: 10-digit format, adding +91, returning "${formatted}"`
      );
      return formatted;
    }

    // For any other case, try to add +
    const formatted = "+" + cleaned;
    console.log(
      `formatPhoneNumber: unexpected length ${cleaned.length}, returning "${formatted}"`
    );
    return formatted;
  }

  /**
   * Get a contact by phone number
   */
  async getContactByPhone(
    phoneNumber: string
  ): Promise<{ contactId: string } | null> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      console.log(
        `Attempting to fetch existing contact for: ${formattedPhone}`
      );

      // Try multiple possible endpoints
      let response;
      try {
        // Try direct contact lookup
        response = await this.client.get(`/contact/${formattedPhone}`);
      } catch (err) {
        // If that fails, try search endpoint
        console.log("Direct lookup failed, trying search...");
        response = await this.client.get(`/contact`, {
          params: { contact_number: formattedPhone },
        });
      }

      console.log("Get contact response:", JSON.stringify(response.data));

      // Check if response has contacts array
      if (
        response.data?.data?.contacts &&
        Array.isArray(response.data.data.contacts)
      ) {
        // Search for the contact with matching phone number (without +)
        const phoneWithoutPlus = formattedPhone.replace("+", "");
        const contact = response.data.data.contacts.find(
          (c: {
            countryCode?: string;
            contact_number?: string;
            _id?: string;
          }) => {
            const contactPhone =
              (c.countryCode || "") + (c.contact_number || "");
            return (
              contactPhone === phoneWithoutPlus ||
              c.contact_number === phoneWithoutPlus
            );
          }
        );

        if (contact && contact._id) {
          console.log(`Found existing contact with ID: ${contact._id}`);
          return { contactId: contact._id };
        }
      }

      // Try single contact response
      const contactId =
        response.data?.data?._id ||
        response.data?.data?.id ||
        response.data?._id ||
        response.data?.id ||
        "";

      if (contactId) {
        console.log(`Found existing contact with ID: ${contactId}`);
        return { contactId };
      }

      return null;
    } catch (error) {
      const axiosError = error as {
        response?: {
          data?: Record<string, unknown>;
          status?: number;
        };
      };
      console.log(
        `Contact not found for phone: ${phoneNumber}`,
        axiosError.response?.data
      );
      return null;
    }
  }

  /**
   * Create a new contact in WhatsApp
   */
  async createContact(data: {
    firstName: string;
    lastName: string;
    contact_number: string;
    email?: string;
    address?: string;
  }): Promise<{ contactId: string; success: boolean }> {
    try {
      const formattedPhone = this.formatPhoneNumber(data.contact_number);

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        contact_number: formattedPhone,
        email: data.email || "",
        address: data.address || "",
      };

      console.log(
        "WhatsApp API - Creating contact with payload:",
        JSON.stringify(payload)
      );

      const response = await this.client.post("/contact", payload);

      console.log("WhatsApp API - Response:", JSON.stringify(response.data));

      // Extract contact ID from nested response structure
      const contactId =
        response.data?.data?._id ||
        response.data?.data?.id ||
        response.data?.id ||
        response.data?.contactId ||
        response.data?.contact_id ||
        "";

      if (!contactId) {
        console.error("No contact ID in response:", response.data);
        throw new Error("No contact ID returned from API response");
      }

      console.log(`Successfully created contact with ID: ${contactId}`);

      return {
        contactId,
        success: true,
      };
    } catch (error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; statusCode?: string };
          status?: number;
          statusText?: string;
        };
      };

      // If contact already exists, try to fetch the existing contact
      const errorMessage = axiosError.response?.data?.message || "";
      const errorMessageLower = errorMessage.toLowerCase();
      
      if (
        errorMessageLower.includes("already exist") ||
        errorMessageLower.includes("already exists") ||
        errorMessageLower.includes("contact already") ||
        axiosError.response?.status === 400
      ) {
        console.log(`Contact already exists, attempting to fetch existing contact...`);
        try {
          const existingContact = await this.getContactByPhone(
            data.contact_number
          );
          if (existingContact) {
            console.log(`Successfully retrieved existing contact ID: ${existingContact.contactId}`);
            return {
              contactId: existingContact.contactId,
              success: true,
            };
          } else {
            // Contact exists but we can't fetch ID - that's okay, we can still send messages with phone number
            console.log("Contact already exists. Will use phone number for messaging.");
            // Return success with empty contactId - caller can use phone number instead
            return {
              contactId: "",
              success: true,
            };
          }
        } catch (fetchError) {
          console.log("Could not fetch existing contact ID, but contact exists. Will use phone number for messaging.");
          // Contact exists but we can't fetch ID - that's okay, we can still send messages with phone number
          return {
            contactId: "",
            success: true,
          };
        }
      }

      console.error(
        "WhatsApp API - Create Contact Error:",
        JSON.stringify(
          {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
          },
          null,
          2
        )
      );

      throw new Error(
        axiosError.response?.data?.message || "Failed to create contact"
      );
    }
  }

  /**
   * Send a WhatsApp template message
   */
  async sendTemplate(data: {
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
  }): Promise<{ success: boolean; messageId?: string }> {
    try {
      // Format the contact number
      const formattedPhone = this.formatPhoneNumber(data.contactNumber);

      // Use simplified payload format that matches API requirements
      const payload = {
        templateId: data.templateId,
        templateName: data.templateName,
        templateLanguage: data.templateLanguage || "en_US",
        contactNumber: formattedPhone,
        parameters: data.parameters || [],
      };

      console.log(
        "WhatsApp API - Sending template with payload:",
        JSON.stringify(payload)
      );

      const response = await this.client.post("/send-template/", payload);

      console.log(
        "WhatsApp API - Template sent successfully:",
        JSON.stringify(response.data)
      );

      return {
        success: true,
        messageId: response.data?.messageId || response.data?.id,
      };
    } catch (error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; statusCode?: string };
          status?: number;
          statusText?: string;
        };
      };
      console.error(
        "WhatsApp API - Send Template Error:",
        JSON.stringify(
          {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
          },
          null,
          2
        )
      );
      throw new Error(
        axiosError.response?.data?.message || "Failed to send template message"
      );
    }
  }
}

// Export singleton instance
export const whatsappClient = new WhatsAppClient();
