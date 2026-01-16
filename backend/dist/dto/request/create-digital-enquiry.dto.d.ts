/**
 * Create Digital Enquiry DTO
 */
export interface CreateDigitalEnquiryDto {
    firstName: string;
    lastName: string;
    whatsappNumber: string;
    email?: string;
    address?: string;
    reason: string;
    leadSourceId?: string;
    leadScope?: "hot" | "warm" | "cold";
    interestedModelId?: string;
    interestedVariantId?: string;
}
//# sourceMappingURL=create-digital-enquiry.dto.d.ts.map