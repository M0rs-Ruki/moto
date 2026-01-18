import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

// Pre-encode the secret so it works in the Edge runtime (middleware)
const secretKey = new TextEncoder().encode(secret);

export interface JWTPayload {
  userId: string;
  email: string;
  dealershipId?: string;
  role?: string;
}

export interface UserPermissions {
  dashboard: boolean;
  dailyWalkinsVisitors: boolean;
  dailyWalkinsSessions: boolean;
  digitalEnquiry: boolean;
  fieldInquiry: boolean;
  deliveryUpdate: boolean;
  settingsProfile: boolean;
  settingsVehicleModels: boolean;
  settingsLeadSources: boolean;
  settingsWhatsApp: boolean;
}

export interface User {
  id: string;
  email: string;
  role?: string;
  isActive?: boolean;
  theme?: string;
  profilePicture?: string | null;
  dealership?: {
    id: string;
    name: string;
    location: string;
  } | null;
  permissions?: UserPermissions | null;
}

/**
 * Generate JWT token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const josePayload: JoseJWTPayload = { ...payload };

  return new SignJWT(josePayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (
      typeof payload?.userId !== "string" ||
      typeof payload?.email !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      dealershipId:
        typeof payload.dealershipId === "string"
          ? payload.dealershipId
          : undefined,
    } satisfies JWTPayload;
  } catch (error) {
    console.error("verifyToken failed", error);
    return null;
  }
}

/**
 * Get current user from cookies
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Set auth cookie
 */
export async function setAuthCookie(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  } catch (error) {
    console.error("Failed to set auth cookie:", error);
    // Re-throw to let caller handle it
    throw error;
  }
}

/**
 * Clear auth cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

/**
 * Get user from request (for API routes)
 */
export async function getUserFromRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
