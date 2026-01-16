import { Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { VisitorWithRelations } from "../dto/response/visitor.response";
export declare class VisitorRepository extends BaseRepository<VisitorWithRelations> {
    /**
     * Find visitor by ID and dealership
     */
    findByIdAndDealership(id: string, dealershipId: string): Promise<VisitorWithRelations | null>;
    /**
     * Find visitor by normalized phone number and dealership
     */
    findByPhoneAndDealership(phoneNumber: string, dealershipId: string): Promise<VisitorWithRelations | null>;
    /**
     * Find all visitors for a dealership with deduplication
     */
    findByDealershipWithDeduplication(dealershipId: string, options?: {
        limit?: number;
        skip?: number;
    }): Promise<{
        visitors: VisitorWithRelations[];
        total: number;
    }>;
    /**
     * Create a visitor
     */
    createVisitor(data: Prisma.VisitorCreateInput): Promise<VisitorWithRelations>;
    /**
     * Update a visitor
     */
    update(id: string, data: Prisma.VisitorUpdateInput): Promise<VisitorWithRelations>;
}
//# sourceMappingURL=visitor.repository.d.ts.map