import { Request, Response, NextFunction } from "express";
import { getUserFromRequest, JWTPayload } from "../lib/auth";
import prisma from "../lib/db";
import { UserRole } from "@prisma/client";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Not authenticated" });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserFromRequest(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

/**
 * Check if the current user is an admin
 * Uses role from JWT for fast check (no DB query needed)
 * Falls back to DB query if role not in JWT
 */
export async function isAdmin(req: Request): Promise<boolean> {
  if (!req.user) {
    return false;
  }

  // Fast path: Check role from JWT (no DB query)
  if (req.user.role === "admin") {
    return true;
  }

  // Fallback: Query DB if role not in JWT (for backwards compatibility)
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true, isActive: true },
    });

    return user?.role === UserRole.admin && user?.isActive === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Require admin role middleware
 * Returns 403 if user is not an admin
 * Optimized: Uses JWT role for fast check
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Fast path: Check role from JWT (no DB query)
    if (req.user.role === "admin") {
      next();
      return;
    }

    // Fallback: Query DB if role not in JWT
    const admin = await isAdmin(req);
    if (!admin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(403).json({ error: "Admin access required" });
  }
}

/**
 * Async error wrapper
 * Re-exported from errorHandler for convenience
 */
export { asyncHandler } from "./errorHandler";

