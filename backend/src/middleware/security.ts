import { Request, Response, NextFunction } from "express";

/**
 * Security headers middleware
 * Adds important security headers to all responses
 */
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Prevent clickjacking attacks
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS filter in older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (adjust based on your needs)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  );

  // Remove powered by header
  res.removeHeader("X-Powered-By");

  // HSTS (HTTP Strict Transport Security) for production
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  next();
}

/**
 * Request size limiter
 * Prevents large payload attacks
 */
export function requestSizeLimiter(maxSize: string = "10mb") {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers["content-length"];

    if (contentLength) {
      const sizeInBytes = parseInt(contentLength, 10);
      const maxSizeInBytes = parseSize(maxSize);

      if (sizeInBytes > maxSizeInBytes) {
        return res.status(413).json({
          error: "Payload too large",
          maxSize,
        });
      }
    }

    next();
  };
}

/**
 * Parse size string to bytes
 */
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)$/);

  if (!match) {
    return parseInt(size, 10);
  }

  const [, value, unit] = match;
  return parseFloat(value) * (units[unit] || 1);
}

/**
 * Sanitize request inputs
 * Prevents common injection attacks
 */
export function sanitizeInputs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
}

function sanitizeObject(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip prototype pollution attempts
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }

      sanitized[key] = sanitizeObject(obj[key]);
    }
  }

  return sanitized;
}
