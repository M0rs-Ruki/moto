import { BaseApiService } from "./base.service";
import type {
  DigitalEnquiry,
  DigitalEnquiryCreateDto,
  PaginatedResponse,
  BulkUploadJob,
} from "@/types";

/**
 * Service for managing digital enquiry operations
 */
export class DigitalEnquiryService extends BaseApiService {
  /**
   * Get paginated list of digital enquiries
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise resolving to paginated enquiries
   */
  async getEnquiries(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<DigitalEnquiry>> {
    return this.get(`/api/digital-enquiry?page=${page}&limit=${limit}`);
  }

  /**
   * Get a single digital enquiry by ID
   * @param id - Enquiry ID
   * @returns Promise resolving to enquiry data
   */
  async getEnquiry(id: number): Promise<DigitalEnquiry> {
    return this.get(`/api/digital-enquiry/${id}`);
  }

  /**
   * Create a new digital enquiry
   * @param data - Enquiry creation data
   * @returns Promise resolving to created enquiry
   */
  async createEnquiry(data: DigitalEnquiryCreateDto): Promise<DigitalEnquiry> {
    return this.post("/api/digital-enquiry", data);
  }

  /**
   * Update an existing digital enquiry
   * @param id - Enquiry ID
   * @param data - Partial enquiry data to update
   * @returns Promise resolving to updated enquiry
   */
  async updateEnquiry(
    id: number,
    data: Partial<DigitalEnquiryCreateDto>,
  ): Promise<DigitalEnquiry> {
    return this.put(`/api/digital-enquiry/${id}`, data);
  }

  /**
   * Delete a digital enquiry
   * @param id - Enquiry ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteEnquiry(id: number): Promise<void> {
    return this.delete(`/api/digital-enquiry/${id}`);
  }

  /**
   * Upload bulk enquiries from Excel file
   * @param file - Excel file to upload
   * @returns Promise resolving to upload job details
   */
  async uploadBulk(file: File): Promise<BulkUploadJob> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post("/api/digital-enquiry/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const digitalEnquiryService = new DigitalEnquiryService();
