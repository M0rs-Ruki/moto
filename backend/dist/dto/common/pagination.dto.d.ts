/**
 * Pagination DTO
 */
export interface PaginationDto {
    limit?: number;
    skip?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
}
//# sourceMappingURL=pagination.dto.d.ts.map