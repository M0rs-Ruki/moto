"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Health check endpoint
router.get("/", (0, auth_1.asyncHandler)(async (req, res) => {
    try {
        // Check if DATABASE_URL is set
        const hasDatabaseUrl = !!process.env.DATABASE_URL;
        if (!hasDatabaseUrl) {
            res.status(503).json({
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                database: "not_configured",
                error: "DATABASE_URL environment variable is not set",
            });
            return;
        }
        // Check database connection
        await db_1.default.$queryRaw `SELECT 1`;
        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: "connected",
            nodeEnv: process.env.NODE_ENV,
        });
    }
    catch (error) {
        console.error("Health check failed:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            database: "disconnected",
            error: errorMessage,
            nodeEnv: process.env.NODE_ENV,
            databaseUrlConfigured: !!process.env.DATABASE_URL,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=health.js.map