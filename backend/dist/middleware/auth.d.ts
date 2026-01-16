import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../lib/auth";
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
export declare function authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export declare function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Async error wrapper
 * Re-exported from errorHandler for convenience
 */
export { asyncHandler } from "./errorHandler";
//# sourceMappingURL=auth.d.ts.map