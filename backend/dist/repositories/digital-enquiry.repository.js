import { BaseRepository } from "./base.repository";
export class DigitalEnquiryRepository extends BaseRepository {
    /**
     * Find digital enquiry by ID and dealership
     */
    async findByIdAndDealership(id, dealershipId) {
        return this.findOne(this.prisma.digitalEnquiry, {
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
     * Find digital enquiry by WhatsApp number and dealership
     */
    async findByWhatsAppNumberAndDealership(whatsappNumber, dealershipId) {
        return this.findOne(this.prisma.digitalEnquiry, {
            whatsappNumber,
            dealershipId,
        });
    }
    /**
     * Find all digital enquiries for a dealership with pagination
     */
    async findByDealership(dealershipId, options) {
        return this.findMany(this.prisma.digitalEnquiry, { dealershipId }, {
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
     * Count digital enquiries for a dealership
     */
    async countByDealership(dealershipId) {
        return this.count(this.prisma.digitalEnquiry, { dealershipId });
    }
    /**
     * Create a digital enquiry
     */
    async createEnquiry(data) {
        return this.create(this.prisma.digitalEnquiry, data);
    }
    /**
     * Update a digital enquiry
     */
    async update(id, data) {
        return super.update(this.prisma.digitalEnquiry, { id }, data, {
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
//# sourceMappingURL=digital-enquiry.repository.js.map