import { CreateDigitalEnquiryDto } from "../dto/request/create-digital-enquiry.dto";
import { UpdateLeadScopeDto } from "../dto/request/update-lead-scope.dto";
import { BulkUploadProcessingResult, BulkUploadSummary } from "../dto/request/bulk-upload.dto";
import { DigitalEnquiryWithRelations, CreateDigitalEnquiryResponse, UpdateLeadScopeResponse } from "../dto/response/digital-enquiry.response";
import { BulkUploadRequest } from "../dto/request/bulk-upload.dto";
export declare class DigitalEnquiryService {
    private repository;
    constructor();
    /**
     * Create a digital enquiry
     */
    createEnquiry(data: CreateDigitalEnquiryDto, dealershipId: string): Promise<CreateDigitalEnquiryResponse>;
    /**
     * Get digital enquiries with pagination
     */
    getEnquiries(dealershipId: string, limit?: number, skip?: number): Promise<{
        enquiries: DigitalEnquiryWithRelations[];
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
     * Bulk upload digital enquiries from JSON data
     */
    bulkUpload(data: BulkUploadRequest, dealershipId: string): Promise<{
        success: boolean;
        summary: BulkUploadSummary;
        results: BulkUploadProcessingResult[];
    }>;
}
//# sourceMappingURL=digital-enquiry.service.d.ts.map