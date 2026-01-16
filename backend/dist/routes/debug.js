import { Router } from "express";
import prisma from "../lib/db";
import { asyncHandler } from "../middleware/auth";
const router = Router();
// Database test endpoint
router.get("/db-test", asyncHandler(async (req, res) => {
    try {
        const hasDatabaseUrl = !!process.env.DATABASE_URL;
        const databaseUrlPreview = process.env.DATABASE_URL
            ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")
            : "NOT SET";
        if (!hasDatabaseUrl) {
            res.status(500).json({
                success: false,
                error: "DATABASE_URL environment variable is not set",
                database: {
                    urlConfigured: false,
                    urlPreview: "NOT SET",
                    connected: false,
                    queryWorks: false,
                    tableQueryWorks: false,
                    nodeEnv: process.env.NODE_ENV,
                },
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Test connection
        let isConnected = false;
        let connectionError = null;
        try {
            await prisma.$connect();
            isConnected = true;
        }
        catch (error) {
            connectionError = error instanceof Error ? error.message : String(error);
            isConnected = false;
        }
        // Test query
        let queryWorks = false;
        let queryError = null;
        try {
            const result = await prisma.$queryRaw `SELECT 1 as test`;
            queryWorks = !!result;
        }
        catch (error) {
            queryError = error instanceof Error ? error.message : String(error);
            queryWorks = false;
        }
        // Test table query
        let tableQueryWorks = false;
        let tableQueryError = null;
        try {
            await prisma.user.count();
            tableQueryWorks = true;
        }
        catch (error) {
            tableQueryError = error instanceof Error ? error.message : String(error);
            tableQueryWorks = false;
        }
        res.json({
            success: isConnected && queryWorks && tableQueryWorks,
            database: {
                urlConfigured: hasDatabaseUrl,
                urlPreview: databaseUrlPreview,
                connected: isConnected,
                connectionError: connectionError,
                queryWorks: queryWorks,
                queryError: queryError,
                tableQueryWorks: tableQueryWorks,
                tableQueryError: tableQueryError,
                nodeEnv: process.env.NODE_ENV,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        res.status(500).json({
            success: false,
            error: errorMessage,
            stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
            database: {
                urlConfigured: !!process.env.DATABASE_URL,
                urlPreview: process.env.DATABASE_URL
                    ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")
                    : "NOT SET",
                nodeEnv: process.env.NODE_ENV,
            },
            timestamp: new Date().toISOString(),
        });
    }
    finally {
        await prisma.$disconnect().catch(() => {
            // Ignore disconnect errors
        });
    }
}));
// Environment test endpoint
router.get("/env-test", asyncHandler(async (req, res) => {
    try {
        res.json({
            success: true,
            environment: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                databaseUrlPreview: process.env.DATABASE_URL
                    ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@").substring(0, 150)
                    : "NOT SET",
                databaseUrlLength: process.env.DATABASE_URL?.length || 0,
                hasJwtSecret: !!process.env.JWT_SECRET,
                jwtSecretLength: process.env.JWT_SECRET?.length || 0,
                nodeEnv: process.env.NODE_ENV,
                port: process.env.PORT,
                corsOrigin: process.env.CORS_ORIGIN,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
        });
    }
}));
export default router;
//# sourceMappingURL=debug.js.map