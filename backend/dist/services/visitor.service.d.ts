import { CreateVisitorDto } from "../dto/request/create-visitor.dto";
import { CreateSessionDto } from "../dto/request/create-session.dto";
import { VisitorWithRelations, CreateVisitorResponse, CreateSessionResponse, VisitorLookupResponse } from "../dto/response/visitor.response";
export declare class VisitorService {
    private repository;
    constructor();
    /**
     * Create a visitor (or update existing) and create a session
     */
    createVisitor(data: CreateVisitorDto, dealershipId: string): Promise<CreateVisitorResponse>;
    /**
     * Get visitors with pagination and deduplication
     */
    getVisitors(dealershipId: string, limit?: number, skip?: number): Promise<{
        visitors: VisitorWithRelations[];
        hasMore: boolean;
        total: number;
        skip: number;
        limit: number;
    }>;
    /**
     * Lookup visitor by phone number
     */
    lookupByPhone(phoneNumber: string, dealershipId: string): Promise<VisitorLookupResponse>;
    /**
     * Create session for existing visitor
     */
    createSession(data: CreateSessionDto, dealershipId: string): Promise<CreateSessionResponse>;
}
//# sourceMappingURL=visitor.service.d.ts.map