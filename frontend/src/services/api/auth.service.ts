import { BaseApiService } from "./base.service";

/**
 * Service for authentication operations
 */
export class AuthService extends BaseApiService {
  /**
   * Login with username and password
   * @param username - User's username
   * @param password - User's password
   * @returns Promise resolving to login response
   */
  async login(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> {
    return this.post("/api/auth/login", { username, password });
  }

  /**
   * Logout current user
   * @returns Promise resolving when logout is complete
   */
  async logout(): Promise<void> {
    return this.post("/api/auth/logout");
  }

  /**
   * Verify current session
   * @returns Promise resolving to session verification result
   */
  async verifySession(): Promise<{ valid: boolean; user?: any }> {
    return this.get("/api/auth/verify");
  }
}

export const authService = new AuthService();
