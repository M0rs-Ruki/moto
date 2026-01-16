import { CreateFieldInquiryDto } from "../dto/request/create-field-inquiry.dto";
import { UpdateLeadScopeDto } from "../dto/request/update-lead-scope.dto";
import { BulkUploadProcessingResult, BulkUploadSummary } from "../dto/request/bulk-upload.dto";
import { FieldInquiryWithRelations, CreateFieldInquiryResponse, UpdateLeadScopeResponse } from "../dto/response/field-inquiry.response";
import { BulkUploadRequest } from "../dto/request/bulk-upload.dto";
export declare class FieldInquiryService {
    private repository;
    constructor();
    /**
     * Create a field inquiry
     */
    createInquiry(data: CreateFieldInquiryDto, dealershipId: string): Promise<CreateFieldInquiryResponse>;
    /**
     * Get field inquiries with pagination
     */
    getInquiries(dealershipId: string, limit?: number, skip?: number): Promise<{
        enquiries: FieldInquiryWithRelations[];
        hasMore: boolean;
        total: number;
        skip: number;
        limit: number;
    }>;
    /**
     * Update lead scope
     */
    updateLeadScope(id: string, data: UpdateLeadScopeDto, dealershipId: string): Promise<UpdateLeadScopeResponse>;
    /**
     * Bulk upload field inquiries from JSON data
     */
    bulkUpload(data: BulkUploadRequest, dealershipId: string): Promise<{
        success: boolean;
        summary: BulkUploadSummary;
        results: BulkUploadProcessingResult[];
    }>;
}
//# sourceMappingURL=field-inquiry.service.d.ts.map