import { Request, Response, NextFunction } from "express";
import prisma from "../lib/db";
import { UserRole } from "@prisma/client";

// Cache permissions in request object to avoid repeated queries
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        dealershipId?: string;
        role?: string;
      };
      _cachedPermissions?: any; // Cache permissions per request
      _cachedUserActive?: boolean; // Cache user active status
    }
  }
}

/**
 * Permission middleware factory
 * Creates a middleware that checks if the user has the specified permission
 * Admins bypass all permission checks
 * Optimized: Uses JWT role for admin check, combines user+permission queries
 */
export function checkPermission(permission: string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      // Fast admin check using JWT role (no DB query)
      if (req.user.role === "admin") {
        next();
        return;
      }

      // For non-admins, fetch user status and permissions in a single query
      // Use cache to avoid repeated queries in the same request
      if (!req._cachedPermissions || req._cachedUserActive === undefined) {
        const userWithPermissions = await prisma.user.findUnique({
          where: { id: req.user.userId },
          select: {
            isActive: true,
            role: true,
            permissions: true,
          },
        });

        if (!userWithPermissions) {
          console.error(
            `[PERMISSION ERROR] User not found in DB. JWT userId: ${req.user.userId}, Email: ${req.user.email}`,
          );
          res
            .status(401)
            .json({ error: "Session expired or invalid. Please login again." });
          return;
        }

        // Cache the results
        req._cachedUserActive = userWithPermissions.isActive;
        req._cachedPermissions = userWithPermissions.permissions;

        // Double-check admin status from DB if not in JWT (for security)
        if (userWithPermissions.role === UserRole.admin) {
          next();
          return;
        }
      }

      // Check if user is active (from cache)
      if (!req._cachedUserActive) {
        res.status(403).json({ error: "User is not active" });
        return;
      }

      // Check permissions (from cache)
      if (!req._cachedPermissions) {
        res.status(403).json({ error: "Permission denied" });
        return;
      }

      // Check if user has the required permission
      const hasPermission =
        (req._cachedPermissions as any)[permission] === true;

      if (!hasPermission) {
        res.status(403).json({ error: "Permission denied" });
        return;
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
