import { getUserFromRequest } from "../lib/auth";
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(req, res, next) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Not authenticated" });
    }
}
/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export async function optionalAuthenticate(req, res, next) {
    try {
        const user = await getUserFromRequest(req);
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Continue without authentication
        next();
    }
}
/**
 * Async error wrapper
 * Re-exported from errorHandler for convenience
 */
export { asyncHandler } from "./errorHandler";
//# sourceMappingURL=auth.js.map