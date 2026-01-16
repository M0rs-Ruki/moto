/**
 * Bulk Upload DTO
 */
export interface ExcelRow {
    Date?: string | number | Date;
    Name?: string;
    "WhatsApp Number"?: string;
    Location?: string;
    Model?: string;
    Source?: string;
}
export interface BulkUploadRequest {
    rows: ExcelRow[];
}
export interface BulkUploadProcessingResult {
    success: boolean;
    rowNumber: number;
    enquiryId?: string;
    error?: string;
}
export interface BulkUploadSummary {
    total: number;
    success: number;
    errors: number;
}
export interface BulkUploadResponse {
    success: boolean;
    summary: BulkUploadSummary;
    results: BulkUploadProcessingResult[];
}
//# sourceMappingURL=bulk-upload.dto.d.ts.map