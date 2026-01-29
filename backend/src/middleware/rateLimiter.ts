import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * Simple in-memory rate limiter
 * For production with multiple instances, consider using Redis
 */
class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  private getKey(req: Request): string {
    // Use IP address or user ID if authenticated
    const userId = (req as any).user?.id;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    return userId ? `user:${userId}` : `ip:${ip}`;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      if (!this.store[key] || this.store[key].resetTime < now) {
        // Initialize or reset
        this.store[key] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
        return next();
      }

      this.store[key].count++;

      if (this.store[key].count > this.maxRequests) {
        const retryAfter = Math.ceil((this.store[key].resetTime - now) / 1000);

        logger.warn("Rate limit exceeded", {
          key,
          count: this.store[key].count,
          limit: this.maxRequests,
          path: req.path,
        });

        res.set("Retry-After", retryAfter.toString());
        res.set("X-RateLimit-Limit", this.maxRequests.toString());
        res.set("X-RateLimit-Remaining", "0");
        res.set("X-RateLimit-Reset", this.store[key].resetTime.toString());

        return res.status(429).json({
          error: "Too many requests, please try again later",
          retryAfter: `${retryAfter} seconds`,
        });
      }

      // Add rate limit headers
      const remaining = this.maxRequests - this.store[key].count;
      res.set("X-RateLimit-Limit", this.maxRequests.toString());
      res.set("X-RateLimit-Remaining", remaining.toString());
      res.set("X-RateLimit-Reset", this.store[key].resetTime.toString());

      next();
    };
  }
}

// Create rate limiter instances
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10); // 15 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10);

export const rateLimiter = new RateLimiter(windowMs, maxRequests);

// Stricter rate limiter for sensitive endpoints
export const strictRateLimiter = new RateLimiter(15 * 60 * 1000, 20);
