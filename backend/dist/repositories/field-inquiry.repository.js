import { BaseRepository } from "./base.repository";
export class FieldInquiryRepository extends BaseRepository {
    /**
     * Find field inquiry by ID and dealership
     */
    async findByIdAndDealership(id, dealershipId) {
        return this.findOne(this.prisma.fieldInquiry, {
            id,
            dealershipId,
        }, {
            include: {
                leadSource: true,
                model: {
                    include: {
                        category: true,
                    },
                },
            },
        });
    }
    /**
     * Find field inquiry by WhatsApp number and dealership
     */
    async findByWhatsAppNumberAndDealership(whatsappNumber, dealershipId) {
        return this.findOne(this.prisma.fieldInquiry, {
            whatsappNumber,
            dealershipId,
        });
    }
    /**
     * Find all field inquiries for a dealership with pagination
     */
    async findByDealership(dealershipId, options) {
        return this.findMany(this.prisma.fieldInquiry, { dealershipId }, {
            include: {
                leadSource: true,
                model: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: options?.limit,
            skip: options?.skip,
        });
    }
    /**
     * Count field inquiries for a dealership
     */
    async countByDealership(dealershipId) {
        return this.count(this.prisma.fieldInquiry, { dealershipId });
    }
    /**
     * Create a field inquiry
     */
    async createInquiry(data) {
        return this.create(this.prisma.fieldInquiry, data);
    }
    /**
     * Update a field inquiry
     */
    async update(id, data) {
        return super.update(this.prisma.fieldInquiry, { id }, data, {
            include: {
                leadSource: true,
                model: {
                    include: {
                        category: true,
                    },
                },
            },
        });
    }
}
//# sourceMappingURL=field-inquiry.repository.js.map