import { Visitor, VisitorSession, VisitorInterest, VehicleModel, VehicleCategory } from "@prisma/client";
/**
 * Visitor Response DTO
 */
export interface VisitorWithRelations extends Visitor {
    sessions: VisitorSession[];
    interests: (VisitorInterest & {
        model: VehicleModel & {
            category: VehicleCategory;
        };
    })[];
}
export interface CreateVisitorResponse {
    success: boolean;
    visitor: {
        id: string;
        firstName: string;
        lastName: string;
    };
    session: {
        id: string;
        status: string;
    };
    message: {
        status: "sent" | "failed" | "not_sent" | "not_configured";
        error: string | null;
    };
}
export interface CreateSessionResponse {
    success: boolean;
    session: {
        id: string;
        status: string;
        visitNumber: number;
    };
    visitor: {
        id: string;
        firstName: string;
        lastName: string;
    };
    message: {
        status: "sent" | "failed" | "not_sent" | "not_configured";
        error: string | null;
    };
}
export interface VisitorLookupResponse {
    visitor: {
        id: string;
        firstName: string;
        lastName: string;
        whatsappNumber: string;
        email: string | null;
        address: string | null;
        sessionCount: number;
        interests: {
            modelId: string;
            modelName: string;
            categoryName: string;
        }[];
    } | null;
    found: boolean;
}
//# sourceMappingURL=visitor.response.d.ts.map