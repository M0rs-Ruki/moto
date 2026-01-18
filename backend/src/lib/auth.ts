import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const secret =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  dealershipId?: string;
  role?: string; // Included for performance - reduces DB queries
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
