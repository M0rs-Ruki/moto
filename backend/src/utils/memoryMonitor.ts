/**
 * Memory monitoring utility
 * Tracks memory usage and warns about potential memory leaks
 */

import { logger } from "./logger";

class MemoryMonitor {
  private checkInterval = 30000; // 30 seconds
  private intervalId?: NodeJS.Timeout;
  private warningThreshold = 0.9; // 90% of heap
  private previousHeapUsed = 0;

  start(): void {
    if (process.env.NODE_ENV === "production") {
      this.intervalId = setInterval(() => this.check(), this.checkInterval);
      logger.info("Memory monitoring started");
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      logger.info("Memory monitoring stopped");
    }
  }

  private check(): void {
    const usage = process.memoryUsage();
    const heapUsedPercent = usage.heapUsed / usage.heapTotal;

    // Log memory usage
    logger.debug("Memory Usage", {
      heapUsed: this.formatBytes(usage.heapUsed),
      heapTotal: this.formatBytes(usage.heapTotal),
      heapPercent: `${(heapUsedPercent * 100).toFixed(2)}%`,
      rss: this.formatBytes(usage.rss),
      external: this.formatBytes(usage.external),
    });

    // Warn if heap usage is high
    if (heapUsedPercent > this.warningThreshold) {
      logger.warn("High memory usage detected", {
        heapUsed: this.formatBytes(usage.heapUsed),
        heapTotal: this.formatBytes(usage.heapTotal),
        percent: `${(heapUsedPercent * 100).toFixed(2)}%`,
      });
    }

    // Check for potential memory leak (heap keeps growing)
    if (usage.heapUsed > this.previousHeapUsed * 1.5) {
      logger.warn("Potential memory leak detected", {
        previousHeapUsed: this.formatBytes(this.previousHeapUsed),
        currentHeapUsed: this.formatBytes(usage.heapUsed),
        growth: `${((usage.heapUsed / this.previousHeapUsed - 1) * 100).toFixed(2)}%`,
      });
    }

    this.previousHeapUsed = usage.heapUsed;
  }

  private formatBytes(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      heapUsed: this.formatBytes(usage.heapUsed),
      heapTotal: this.formatBytes(usage.heapTotal),
      rss: this.formatBytes(usage.rss),
      external: this.formatBytes(usage.external),
      heapPercent: `${((usage.heapUsed / usage.heapTotal) * 100).toFixed(2)}%`,
    };
  }
}

export const memoryMonitor = new MemoryMonitor();
