"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
const auth_1 = require("../lib/auth");
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
async function authenticate(req, res, next) {
    try {
        const user = await (0, auth_1.getUserFromRequest)(req);
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
async function optionalAuthenticate(req, res, next) {
    try {
        const user = await (0, auth_1.getUserFromRequest)(req);
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
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "asyncHandler", { enumerable: true, get: function () { return errorHandler_1.asyncHandler; } });
//# sourceMappingURL=auth.js.map