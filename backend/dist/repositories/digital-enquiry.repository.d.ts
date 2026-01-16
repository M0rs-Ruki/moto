import { Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { DigitalEnquiryWithRelations } from "../dto/response/digital-enquiry.response";
export declare class DigitalEnquiryRepository extends BaseRepository<DigitalEnquiryWithRelations> {
    /**
     * Find digital enquiry by ID and dealership
     */
    findByIdAndDealership(id: string, dealershipId: string): Promise<DigitalEnquiryWithRelations | null>;
    /**
     * Find digital enquiry by WhatsApp number and dealership
     */
    findByWhatsAppNumberAndDealership(whatsappNumber: string, dealershipId: string): Promise<DigitalEnquiryWithRelations | null>;
    /**
     * Find all digital enquiries for a dealership with pagination
     */
    findByDealership(dealershipId: string, options?: {
        limit?: number;
        skip?: number;
    }): Promise<DigitalEnquiryWithRelations[]>;
    /**
     * Count digital enquiries for a dealership
     */
    countByDealership(dealershipId: string): Promise<number>;
    /**
     * Create a digital enquiry
     */
    createEnquiry(data: Prisma.DigitalEnquiryCreateInput): Promise<DigitalEnquiryWithRelations>;
    /**
     * Update a digital enquiry
     */
    update(id: string, data: Prisma.DigitalEnquiryUpdateInput): Promise<DigitalEnquiryWithRelations>;
}
//# sourceMappingURL=digital-enquiry.repository.d.ts.map