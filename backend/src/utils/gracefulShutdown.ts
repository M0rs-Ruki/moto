import { Server } from "http";
import prisma from "../lib/db";
import { rabbitMQService } from "../services/rabbitmq.service";
import { logger } from "../utils/logger";

/**
 * Graceful shutdown handler
 * Ensures all connections are closed properly before exiting
 */
export class GracefulShutdown {
  private server: Server | null = null;
  private isShuttingDown: boolean = false;
  private shutdownTimeout: number = 30000; // 30 seconds

  setServer(server: Server): void {
    this.server = server;
  }

  private async closeServer(): Promise<void> {
    if (!this.server) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.server!.close((err) => {
        if (err) {
          logger.error("Error closing HTTP server", err);
          reject(err);
        } else {
          logger.info("HTTP server closed");
          resolve();
        }
      });
    });
  }

  private async closeDatabaseConnection(): Promise<void> {
    try {
      await prisma.$disconnect();
      logger.info("Database connection closed");
    } catch (error) {
      logger.error("Error closing database connection", error as Error);
      throw error;
    }
  }

  private async closeRabbitMQ(): Promise<void> {
    try {
      await rabbitMQService.disconnect();
      logger.info("RabbitMQ connection closed");
    } catch (error) {
      logger.error("Error closing RabbitMQ connection", error as Error);
      throw error;
    }
  }

  async shutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn("Shutdown already in progress");
      return;
    }

    this.isShuttingDown = true;
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    // Set a timeout to force exit if shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
      logger.error("Graceful shutdown timeout. Forcing exit...");
      process.exit(1);
    }, this.shutdownTimeout);

    try {
      // Stop accepting new requests
      await this.closeServer();

      // Close database and external connections
      await Promise.all([this.closeDatabaseConnection(), this.closeRabbitMQ()]);

      logger.info("Graceful shutdown completed successfully");
      clearTimeout(forceExitTimeout);
      process.exit(0);
    } catch (error) {
      logger.error("Error during graceful shutdown", error as Error);
      clearTimeout(forceExitTimeout);
      process.exit(1);
    }
  }

  setupHandlers(): void {
    // Handle SIGTERM (Docker, Kubernetes, etc.)
    process.on("SIGTERM", () => this.shutdown("SIGTERM"));

    // Handle SIGINT (Ctrl+C)
    process.on("SIGINT", () => this.shutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught exception", error);
      this.shutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      logger.error("Unhandled promise rejection", new Error(String(reason)), {
        reason: String(reason),
      });
      this.shutdown("unhandledRejection");
    });
  }
}

export const gracefulShutdown = new GracefulShutdown();
