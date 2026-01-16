/**
 * Create Field Inquiry DTO
 */
export interface CreateFieldInquiryDto {
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
