import { BaseApiService } from "./base.service";
import type { DashboardStats } from "@/types";

/**
 * Service for fetching dashboard statistics
 */
export class StatisticsService extends BaseApiService {
  /**
   * Get dashboard statistics
   * @returns Promise resolving to dashboard stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return this.get("/api/statistics/dashboard");
  }
}

export const statisticsService = new StatisticsService();
