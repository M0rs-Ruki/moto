import { SignJWT, jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production");
/**
 * Generate JWT token
 */
export async function generateToken(payload) {
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
    return token;
}
/**
 * Verify JWT token
 */
export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    }
    catch (error) {
        return null;
    }
}
/**
 * Get user from Express request (for API routes)
 */
export async function getUserFromRequest(request) {
    const token = request.cookies?.["auth-token"] || request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return null;
    }
    return verifyToken(token);
}
/**
 * Set auth cookie in Express response
 */
export function setAuthCookie(res, token) {
    res.cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
        path: "/",
    });
}
/**
 * Clear auth cookie in Express response
 */
export function clearAuthCookie(res) {
    res.clearCookie("auth-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}
//# sourceMappingURL=auth.js.map