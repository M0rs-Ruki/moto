/**
 * Performance monitoring utility
 * Tracks and reports on application performance metrics
 */

import { logger } from "./logger";

interface PerformanceMetrics {
  requestCount: number;
  errorCount: number;
  totalResponseTime: number;
  averageResponseTime: number;
  slowRequests: number;
  requests: Map<string, RouteMetrics>;
}

interface RouteMetrics {
  path: string;
  count: number;
  totalTime: number;
  avgTime: number;
  errors: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    requestCount: 0,
    errorCount: 0,
    totalResponseTime: 0,
    averageResponseTime: 0,
    slowRequests: 0,
    requests: new Map(),
  };

  private slowThreshold = 1000; // 1 second
  private reportInterval = 60000; // 1 minute
  private intervalId?: NodeJS.Timeout;

  start(): void {
    if (process.env.NODE_ENV === "production") {
      this.intervalId = setInterval(() => this.report(), this.reportInterval);
      logger.info("Performance monitoring started");
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      logger.info("Performance monitoring stopped");
    }
  }

  recordRequest(
    path: string,
    duration: number,
    isError: boolean = false,
  ): void {
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += duration;
    this.metrics.averageResponseTime =
      this.metrics.totalResponseTime / this.metrics.requestCount;

    if (isError) {
      this.metrics.errorCount++;
    }

    if (duration > this.slowThreshold) {
      this.metrics.slowRequests++;
    }

    // Track per-route metrics
    const routeMetrics = this.metrics.requests.get(path) || {
      path,
      count: 0,
      totalTime: 0,
      avgTime: 0,
      errors: 0,
    };

    routeMetrics.count++;
    routeMetrics.totalTime += duration;
    routeMetrics.avgTime = routeMetrics.totalTime / routeMetrics.count;

    if (isError) {
      routeMetrics.errors++;
    }

    this.metrics.requests.set(path, routeMetrics);
  }

  private report(): void {
    if (this.metrics.requestCount === 0) {
      return;
    }

    const errorRate =
      (this.metrics.errorCount / this.metrics.requestCount) * 100;
    const slowRate =
      (this.metrics.slowRequests / this.metrics.requestCount) * 100;

    logger.info("Performance Report", {
      totalRequests: this.metrics.requestCount,
      errorCount: this.metrics.errorCount,
      errorRate: `${errorRate.toFixed(2)}%`,
      avgResponseTime: `${this.metrics.averageResponseTime.toFixed(2)}ms`,
      slowRequests: this.metrics.slowRequests,
      slowRate: `${slowRate.toFixed(2)}%`,
    });

    // Report top 5 slowest routes
    const sortedRoutes = Array.from(this.metrics.requests.values())
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5);

    if (sortedRoutes.length > 0) {
      logger.info("Slowest Routes", {
        routes: sortedRoutes.map((r) => ({
          path: r.path,
          avgTime: `${r.avgTime.toFixed(2)}ms`,
          count: r.count,
          errors: r.errors,
        })),
      });
    }

    // Reset metrics after report (or keep cumulative - your choice)
    // this.resetMetrics();
  }

  private resetMetrics(): void {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      requests: new Map(),
    };
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

export const performanceMonitor = new PerformanceMonitor();
