import { BaseApiService } from "./base.service";
import type { Visitor, VisitorCreateDto, PaginatedResponse } from "@/types";

/**
 * Service for managing visitor operations
 */
export class VisitorService extends BaseApiService {
  /**
   * Get paginated list of visitors
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise resolving to paginated visitors
   */
  async getVisitors(page = 1, limit = 10): Promise<PaginatedResponse<Visitor>> {
    return this.get(`/api/visitors?page=${page}&limit=${limit}`);
  }

  /**
   * Get a single visitor by ID
   * @param id - Visitor ID
   * @returns Promise resolving to visitor data
   */
  async getVisitor(id: number): Promise<Visitor> {
    return this.get(`/api/visitors/${id}`);
  }

  /**
   * Create a new visitor
   * @param data - Visitor creation data
   * @returns Promise resolving to created visitor
   */
  async createVisitor(data: VisitorCreateDto): Promise<Visitor> {
    return this.post("/api/visitors", data);
  }

  /**
   * Update an existing visitor
   * @param id - Visitor ID
   * @param data - Partial visitor data to update
   * @returns Promise resolving to updated visitor
   */
  async updateVisitor(
    id: number,
    data: Partial<VisitorCreateDto>,
  ): Promise<Visitor> {
    return this.put(`/api/visitors/${id}`, data);
  }

  /**
   * Delete a visitor
   * @param id - Visitor ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteVisitor(id: number): Promise<void> {
    return this.delete(`/api/visitors/${id}`);
  }
}

export const visitorService = new VisitorService();
