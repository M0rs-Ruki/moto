import { Request, Response } from "express";
export interface JWTPayload {
    userId: string;
    email: string;
    dealershipId?: string;
}
/**
 * Generate JWT token
 */
export declare function generateToken(payload: JWTPayload): Promise<string>;
/**
 * Verify JWT token
 */
export declare function verifyToken(token: string): Promise<JWTPayload | null>;
/**
 * Get user from Express request (for API routes)
 */
export declare function getUserFromRequest(request: Request): Promise<JWTPayload | null>;
/**
 * Set auth cookie in Express response
 */
export declare function setAuthCookie(res: Response, token: string): void;
/**
 * Clear auth cookie in Express response
 */
export declare function clearAuthCookie(res: Response): void;
//# sourceMappingURL=auth.d.ts.map