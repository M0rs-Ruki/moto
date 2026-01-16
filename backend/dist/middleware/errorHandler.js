/**
 * Error handling middleware
 */
export function errorHandler(err, req, res, next) {
    console.error("Error:", err);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}
/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=errorHandler.js.map