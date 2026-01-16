/**
 * Create Session DTO
 */
export interface CreateSessionDto {
    visitorId: string;
    reason: string;
    modelIds?: (string | {
        modelId: string;
        variantId?: string;
    })[];
}
//# sourceMappingURL=create-session.dto.d.ts.map