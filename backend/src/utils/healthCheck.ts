import { Request, Response } from "express";
import prisma from "../lib/db";
import { rabbitMQService } from "../services/rabbitmq.service";
import { logger } from "../utils/logger";

interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: ServiceHealth;
    rabbitmq: ServiceHealth;
  };
}

interface ServiceHealth {
  status: "up" | "down";
  latency?: number;
  error?: string;
}

/**
 * Comprehensive health check endpoint
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();

  const checks = await Promise.allSettled([checkDatabase(), checkRabbitMQ()]);

  const [dbCheck, rabbitCheck] = checks;

  const database: ServiceHealth =
    dbCheck.status === "fulfilled"
      ? dbCheck.value
      : { status: "down", error: (dbCheck.reason as Error).message };

  const rabbitmq: ServiceHealth =
    rabbitCheck.status === "fulfilled"
      ? rabbitCheck.value
      : { status: "down", error: (rabbitCheck.reason as Error).message };

  const allHealthy = database.status === "up" && rabbitmq.status === "up";
  const someHealthy = database.status === "up" || rabbitmq.status === "up";

  const result: HealthCheckResult = {
    status: allHealthy ? "healthy" : someHealthy ? "degraded" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    services: {
      database,
      rabbitmq,
    },
  };

  const statusCode =
    result.status === "healthy"
      ? 200
      : result.status === "degraded"
        ? 200
        : 503;

  if (statusCode !== 200) {
    logger.warn("Health check failed", { result });
  }

  res.status(statusCode).json(result);
}

/**
 * Simple health check (for load balancers)
 */
export async function simpleHealthCheck(
  req: Request,
  res: Response,
): Promise<void> {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Readiness check (checks if app is ready to accept traffic)
 */
export async function readinessCheck(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Readiness check failed", error as Error);
    res.status(503).json({
      status: "not ready",
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Liveness check (checks if app is alive)
 */
export async function livenessCheck(
  req: Request,
  res: Response,
): Promise<void> {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

async function checkDatabase(): Promise<ServiceHealth> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "up",
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "down",
      error: (error as Error).message,
    };
  }
}

async function checkRabbitMQ(): Promise<ServiceHealth> {
  const start = Date.now();

  try {
    // Check if connection exists and is open
    const isConnected = rabbitMQService.isConnected();

    if (!isConnected) {
      return {
        status: "down",
        error: "Not connected",
      };
    }

    return {
      status: "up",
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "down",
      error: (error as Error).message,
    };
  }
}
