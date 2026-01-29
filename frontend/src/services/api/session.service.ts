import { BaseApiService } from "./base.service";
import type { Session, SessionCreateDto, PaginatedResponse } from "@/types";

/**
 * Service for managing session operations
 */
export class SessionService extends BaseApiService {
  /**
   * Get paginated list of sessions
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise resolving to paginated sessions
   */
  async getSessions(page = 1, limit = 10): Promise<PaginatedResponse<Session>> {
    return this.get(`/api/sessions?page=${page}&limit=${limit}`);
  }

  /**
   * Get a single session by ID
   * @param id - Session ID
   * @returns Promise resolving to session data
   */
  async getSession(id: number): Promise<Session> {
    return this.get(`/api/sessions/${id}`);
  }

  /**
   * Create a new session
   * @param data - Session creation data
   * @returns Promise resolving to created session
   */
  async createSession(data: SessionCreateDto): Promise<Session> {
    return this.post("/api/sessions", data);
  }

  /**
   * Update an existing session
   * @param id - Session ID
   * @param data - Partial session data to update
   * @returns Promise resolving to updated session
   */
  async updateSession(
    id: number,
    data: Partial<SessionCreateDto>,
  ): Promise<Session> {
    return this.put(`/api/sessions/${id}`, data);
  }

  /**
   * Delete a session
   * @param id - Session ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteSession(id: number): Promise<void> {
    return this.delete(`/api/sessions/${id}`);
  }
}

export const sessionService = new SessionService();
