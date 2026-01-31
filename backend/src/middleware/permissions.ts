import { Request, Response, NextFunction } from "express";
import prisma from "../lib/db";
import { UserRole } from "@prisma/client";
import { TenantContext, JWTPayload } from "../lib/auth";

// ============================================================
// PERMISSION SYSTEM WITH FEATURE GATES
// ============================================================
// Permission checking cascade:
// 1. OrgFeatureToggle (organization-level master switch)
// 2. Role-based defaults (super_admin/admin have all, user has none)
// 3. UserPermission (individual user overrides)
// ============================================================

// Extend Express Request to add permission caching (user and tenant are already declared in auth.ts)
declare global {
  namespace Express {
    interface Request {
      _cachedPermissions?: any;
      _cachedUserActive?: boolean;
      _cachedOrgFeatures?: any;
    }
  }
}

/**
 * Permission middleware factory
 * Creates a middleware that checks if the user has the specified permission
 *
 * Permission Check Cascade:
 * 1. If Super Admin → Allow (they have all permissions)
 * 2. If Admin → Allow (they have all permissions)
 * 3. Check Organization Feature Toggle → If disabled, deny regardless of user permission
 * 4. Check User Permission → Allow only if explicitly granted
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
      // Super Admins and Admins bypass permission checks
      if (req.user.role === "super_admin" || req.user.role === "admin") {
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
            organizationId: true,
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
        if (
          userWithPermissions.role === UserRole.admin ||
          userWithPermissions.role === UserRole.super_admin
        ) {
          next();
          return;
        }

        // Fetch and cache organization feature toggles
        if (userWithPermissions.organizationId && !req._cachedOrgFeatures) {
          const orgFeatures = await prisma.orgFeatureToggle.findUnique({
            where: { organizationId: userWithPermissions.organizationId },
          });
          req._cachedOrgFeatures = orgFeatures;
        }
      }

      // Check if user is active (from cache)
      if (!req._cachedUserActive) {
        res.status(403).json({ error: "User is not active" });
        return;
      }

      // Check organization-level feature toggle (master switch)
      if (req._cachedOrgFeatures) {
        const orgFeatureEnabled = (req._cachedOrgFeatures as any)[permission];
        if (orgFeatureEnabled === false) {
          res.status(403).json({
            error: "This feature is disabled for your organization",
            code: "ORG_FEATURE_DISABLED",
          });
          return;
        }
      }

      // Check user-level permissions (from cache)
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

/**
 * Check multiple permissions (ANY of them)
 * User must have at least one of the specified permissions
 */
export function checkAnyPermission(permissions: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      // Super Admins and Admins bypass permission checks
      if (req.user.role === "super_admin" || req.user.role === "admin") {
        next();
        return;
      }

      // Fetch permissions if not cached
      if (!req._cachedPermissions) {
        const userWithPermissions = await prisma.user.findUnique({
          where: { id: req.user.userId },
          select: {
            isActive: true,
            role: true,
            permissions: true,
          },
        });

        if (!userWithPermissions) {
          res
            .status(401)
            .json({ error: "Session expired or invalid. Please login again." });
          return;
        }

        req._cachedUserActive = userWithPermissions.isActive;
        req._cachedPermissions = userWithPermissions.permissions;

        if (
          userWithPermissions.role === UserRole.admin ||
          userWithPermissions.role === UserRole.super_admin
        ) {
          next();
          return;
        }
      }

      if (!req._cachedUserActive) {
        res.status(403).json({ error: "User is not active" });
        return;
      }

      // Check if user has ANY of the required permissions
      const hasAnyPermission = permissions.some(
        (perm) => (req._cachedPermissions as any)?.[perm] === true,
      );

      if (!hasAnyPermission) {
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
