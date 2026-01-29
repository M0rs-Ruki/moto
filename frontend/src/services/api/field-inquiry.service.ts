import { BaseApiService } from "./base.service";
import type {
  FieldInquiry,
  FieldInquiryCreateDto,
  PaginatedResponse,
  BulkUploadJob,
} from "@/types";

/**
 * Service for managing field inquiry operations
 */
export class FieldInquiryService extends BaseApiService {
  /**
   * Get paginated list of field inquiries
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise resolving to paginated inquiries
   */
  async getInquiries(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<FieldInquiry>> {
    return this.get(`/api/field-inquiry?page=${page}&limit=${limit}`);
  }

  /**
   * Get a single field inquiry by ID
   * @param id - Inquiry ID
   * @returns Promise resolving to inquiry data
   */
  async getInquiry(id: number): Promise<FieldInquiry> {
    return this.get(`/api/field-inquiry/${id}`);
  }

  /**
   * Create a new field inquiry
   * @param data - Inquiry creation data
   * @returns Promise resolving to created inquiry
   */
  async createInquiry(data: FieldInquiryCreateDto): Promise<FieldInquiry> {
    return this.post("/api/field-inquiry", data);
  }

  /**
   * Update an existing field inquiry
   * @param id - Inquiry ID
   * @param data - Partial inquiry data to update
   * @returns Promise resolving to updated inquiry
   */
  async updateInquiry(
    id: number,
    data: Partial<FieldInquiryCreateDto>,
  ): Promise<FieldInquiry> {
    return this.put(`/api/field-inquiry/${id}`, data);
  }

  /**
   * Delete a field inquiry
   * @param id - Inquiry ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteInquiry(id: number): Promise<void> {
    return this.delete(`/api/field-inquiry/${id}`);
  }

  /**
   * Upload bulk inquiries from Excel file
   * @param file - Excel file to upload
   * @returns Promise resolving to upload job details
   */
  async uploadBulk(file: File): Promise<BulkUploadJob> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post("/api/field-inquiry/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const fieldInquiryService = new FieldInquiryService();
