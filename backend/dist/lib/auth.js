"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.getUserFromRequest = getUserFromRequest;
exports.setAuthCookie = setAuthCookie;
exports.clearAuthCookie = clearAuthCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production";
/**
 * Generate JWT token
 */
async function generateToken(payload) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" }, (err, token) => {
            if (err)
                reject(err);
            else
                resolve(token);
        });
    });
}
/**
 * Verify JWT token
 */
async function verifyToken(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        return payload;
    }
    catch (error) {
        return null;
    }
}
/**
 * Get user from Express request (for API routes)
 */
async function getUserFromRequest(request) {
    const token = request.cookies?.["auth-token"] || request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return null;
    }
    return verifyToken(token);
}
/**
 * Set auth cookie in Express response
 */
function setAuthCookie(res, token) {
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
function clearAuthCookie(res) {
    res.clearCookie("auth-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}
//# sourceMappingURL=auth.js.map