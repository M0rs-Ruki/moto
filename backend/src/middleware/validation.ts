import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Validation error class
 */
export class ValidationError extends Error {
  statusCode: number = 400;
  errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Request validation middleware
 * Validates common request properties
 */
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors: string[] = [];

  // Validate content-type for POST/PUT/PATCH
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.get("content-type");

    if (!contentType) {
      errors.push("Content-Type header is required");
    } else if (
      !contentType.includes("application/json") &&
      !contentType.includes("multipart/form-data")
    ) {
      errors.push(
        "Content-Type must be application/json or multipart/form-data",
      );
    }
  }

  if (errors.length > 0) {
    logger.warn("Request validation failed", { errors, path: req.path });
    return res.status(400).json({ error: "Validation failed", errors });
  }

  next();
}

/**
 * Pagination validator
 */
export function validatePagination(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

  const errors: string[] = [];

  if (req.query.page && (isNaN(page) || page < 1)) {
    errors.push("Page must be a positive integer");
  }

  if (req.query.limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    errors.push("Limit must be between 1 and 100");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ error: "Invalid pagination parameters", errors });
  }

  next();
}

/**
 * ID parameter validator
 */
export function validateId(paramName: string = "id") {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return res.status(400).json({ error: `Invalid ${paramName} parameter` });
    }

    next();
  };
}
