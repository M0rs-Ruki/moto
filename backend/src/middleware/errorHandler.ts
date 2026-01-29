import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface ApiError extends Error {
  statusCode?: number;
  status?: number;
}

/**
 * Error handling middleware
 * Enhanced with production-ready logging and error tracking
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  // Log error with context
  logger.error("Request error", err, {
    method: req.method,
    path: req.path,
    statusCode,
    userId: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Don't expose internal errors in production
  const responseMessage =
    statusCode >= 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : message;

  res.status(statusCode).json({
    error: responseMessage,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    ...(statusCode < 500 && { details: message }), // Show details for client errors
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
