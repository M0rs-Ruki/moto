import { Router } from "express";
import prisma from "../lib/db";
import { asyncHandler } from "../middleware/auth";
const router = Router();
// Health check endpoint
router.get("/", asyncHandler(async (req, res) => {
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
        await prisma.$queryRaw `SELECT 1`;
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
export default router;
//# sourceMappingURL=health.js.map