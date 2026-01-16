import { Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { FieldInquiryWithRelations } from "../dto/response/field-inquiry.response";
export declare class FieldInquiryRepository extends BaseRepository<FieldInquiryWithRelations> {
    /**
     * Find field inquiry by ID and dealership
     */
    findByIdAndDealership(id: string, dealershipId: string): Promise<FieldInquiryWithRelations | null>;
    /**
     * Find field inquiry by WhatsApp number and dealership
     */
    findByWhatsAppNumberAndDealership(whatsappNumber: string, dealershipId: string): Promise<FieldInquiryWithRelations | null>;
    /**
     * Find all field inquiries for a dealership with pagination
     */
    findByDealership(dealershipId: string, options?: {
        limit?: number;
        skip?: number;
    }): Promise<FieldInquiryWithRelations[]>;
    /**
     * Count field inquiries for a dealership
     */
    countByDealership(dealershipId: string): Promise<number>;
    /**
     * Create a field inquiry
     */
    createInquiry(data: Prisma.FieldInquiryCreateInput): Promise<FieldInquiryWithRelations>;
    /**
     * Update a field inquiry
     */
    update(id: string, data: Prisma.FieldInquiryUpdateInput): Promise<FieldInquiryWithRelations>;
}
//# sourceMappingURL=field-inquiry.repository.d.ts.map