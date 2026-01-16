/**
 * Create Visitor DTO
 */
export interface CreateVisitorDto {
    firstName: string;
    lastName: string;
    whatsappNumber: string;
    email?: string;
    address?: string;
    reason: string;
    modelIds?: (string | {
        modelId: string;
        variantId?: string;
    })[];
}
//# sourceMappingURL=create-visitor.dto.d.ts.map