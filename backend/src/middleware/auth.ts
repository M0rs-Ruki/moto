import { Request, Response, NextFunction } from "express";
import {
  getUserFromRequest,
  JWTPayload,
  TenantContext,
  extractTenantContext,
  UserRoleType,
} from "../lib/auth";
import prisma from "../lib/db";
import { UserRole } from "@prisma/client";

// ============================================================
// MULTI-TENANT RBAC MIDDLEWARE
// ============================================================
// Hierarchy: Super Admin → Admin → User
// - Super Admin: Full organization access (org owner)
// - Admin: Organization manager
// - User: Staff member
// ============================================================

// Extend Express Request to include user and tenant context
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      tenant?: TenantContext;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user + tenant context to request
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    req.user = user;

    // Extract tenant context for multi-tenant isolation
    const tenantContext = extractTenantContext(user);
    if (tenantContext) {
      req.tenant = tenantContext;
    }

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
  next: NextFunction,
): Promise<void> {
  try {
    const user = await getUserFromRequest(req);
    if (user) {
      req.user = user;
      const tenantContext = extractTenantContext(user);
      if (tenantContext) {
        req.tenant = tenantContext;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

/**
 * Check if the current user is a Super Admin
 * Uses role from JWT for fast check (no DB query needed)
 */
export async function isSuperAdmin(req: Request): Promise<boolean> {
  if (!req.user) return false;

  // Fast path: Check role from JWT
  if (req.user.role === "super_admin") return true;

  // Fallback: Query DB
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true, isActive: true },
    });
    return user?.role === UserRole.super_admin && user?.isActive === true;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
}

/**
 * Check if the current user is an admin (admin or super_admin)
 * Uses role from JWT for fast check (no DB query needed)
 * Falls back to DB query if role not in JWT
 */
export async function isAdmin(req: Request): Promise<boolean> {
  if (!req.user) {
    return false;
  }

  // Fast path: Check role from JWT (no DB query)
  if (req.user.role === "admin" || req.user.role === "super_admin") {
    return true;
  }

  // Fallback: Query DB if role not in JWT (for backwards compatibility)
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true, isActive: true },
    });

    return (
      (user?.role === UserRole.admin || user?.role === UserRole.super_admin) &&
      user?.isActive === true
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Require Super Admin role middleware
 * Returns 403 if user is not a super admin
 */
export async function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Fast path: Check role from JWT
    if (req.user.role === "super_admin") {
      next();
      return;
    }

    // Fallback: Query DB
    const superAdmin = await isSuperAdmin(req);
    if (!superAdmin) {
      res.status(403).json({ error: "Super Admin access required" });
      return;
    }
    next();
  } catch (error) {
    console.error("Super Admin check error:", error);
    res.status(403).json({ error: "Super Admin access required" });
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
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Fast path: Check role from JWT (no DB query)
    if (req.user.role === "admin" || req.user.role === "super_admin") {
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
 * Require tenant context middleware
 * Ensures the request has valid organization context for data isolation
 */
export async function requireTenantContext(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.tenant?.organizationId) {
    res.status(403).json({ error: "Organization context required" });
    return;
  }
  next();
}

/**
 * Organization isolation middleware factory
 * Ensures user can only access data within their organization
 */
export function enforceOrgIsolation() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.user || !req.tenant) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // All users are restricted to their organization via dealershipId
    if (!req.tenant.dealershipId) {
      res.status(403).json({ error: "No dealership assigned to this user" });
      return;
    }

    next();
  };
}

/**
 * Build tenant WHERE clause for Prisma queries
 * Automatically handles organization isolation based on dealershipId
 *
 * @param tenant - Tenant context from request
 * @returns Prisma WHERE clause for tenant isolation
 */
export function buildTenantWhere(
  tenant: TenantContext | undefined,
): Record<string, string | undefined> {
  if (!tenant) {
    throw new Error("Tenant context required for data access");
  }

  if (!tenant.dealershipId) {
    throw new Error("Dealership context required for data access");
  }

  return { dealershipId: tenant.dealershipId };
}

/**
 * Async error wrapper
 * Re-exported from errorHandler for convenience
 */
export { asyncHandler } from "./errorHandler";
