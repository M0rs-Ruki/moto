import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Request logging middleware
 * Logs all HTTP requests with timing information
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  const { method, path, ip } = req;

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    const userId = (req as any).user?.id;

    logger.httpRequest(method, path, statusCode, duration, userId);
  });

  next();
}

/**
 * Performance monitoring middleware
 * Warns about slow requests
 */
export function performanceMonitor(slowThreshold: number = 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;

      if (duration > slowThreshold) {
        logger.warn("Slow request detected", {
          method: req.method,
          path: req.path,
          duration: `${duration}ms`,
          statusCode: res.statusCode,
        });
      }
    });

    next();
  };
}
