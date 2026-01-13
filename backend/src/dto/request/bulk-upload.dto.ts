/**
 * Bulk Upload DTO
 */
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
