import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const secret =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

// ============================================================
// MULTI-TENANT JWT PAYLOAD
// ============================================================
// Hierarchy: Super Admin → Admin → User
// - Super Admin: Organization owner, full access
// - Admin: Manager with full access
// - User: Limited by permissions
// ============================================================

export type UserRoleType = "super_admin" | "admin" | "user";

export interface JWTPayload {
  userId: string;
  email: string;

  // Multi-tenant isolation fields
  organizationId?: string;

  // Legacy field for backward compatibility
  dealershipId?: string;

  // Role for permission checks (reduces DB queries)
  role?: UserRoleType;
}

// Helper type for tenant context extracted from JWT
export interface TenantContext {
  organizationId: string;
  role: UserRoleType;

  // Computed helpers
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;

  // For backward compatibility
  dealershipId?: string;
}

/**
 * Extract tenant context from JWT payload
 * Returns null if missing required fields
 */
export function extractTenantContext(
  payload: JWTPayload,
): TenantContext | null {
  const role = (payload.role || "user") as UserRoleType;

  // For backward compatibility: use dealershipId as organizationId if not set
  const organizationId = payload.organizationId || payload.dealershipId;

  if (!organizationId) {
    return null;
  }

  return {
    organizationId,
    role,
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin" || role === "super_admin",
    isUser: role === "user",
    dealershipId: payload.dealershipId,
  };
}

/**
 * Generate JWT token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: "7d" }, (err, token) => {
      if (err) reject(err);
      else resolve(token!);
    });
  });
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = jwt.verify(token, secret) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Get user from Express request (for API routes)
 */
export async function getUserFromRequest(
  request: Request,
): Promise<JWTPayload | null> {
  const token =
    request.cookies?.["auth-token"] ||
    request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Set auth cookie in Express response
 */
export function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain =
    process.env.COOKIE_DOMAIN ||
    (isProduction ? ".utkalautomobiles.co.in" : undefined);

  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // "none" for cross-origin in production
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
    path: "/",
    domain: cookieDomain, // Share cookie across subdomains if specified
  });
}

/**
 * Clear auth cookie in Express response
 */
export function clearAuthCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain =
    process.env.COOKIE_DOMAIN ||
    (isProduction ? ".utkalautomobiles.co.in" : undefined);

  res.clearCookie("auth-token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain: cookieDomain,
  });
}
