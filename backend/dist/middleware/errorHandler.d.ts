import { Request, Response, NextFunction } from "express";
export interface ApiError extends Error {
    statusCode?: number;
    status?: number;
}
/**
 * Error handling middleware
 */
export declare function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void;
/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map