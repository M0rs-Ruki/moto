import { Router, type Router as ExpressRouter } from "express";
import { bulkUploadJobController } from "../controllers/bulk-upload-job.controller";
import { authenticate, asyncHandler } from "../middleware/auth";

const router: ExpressRouter = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/bulk-upload-jobs/:jobId
 * Get job status and progress
 */
router.get("/:jobId", asyncHandler(bulkUploadJobController.getJobStatus));

/**
 * GET /api/bulk-upload-jobs/:jobId/results
 * Get processed results for a job
 */
router.get(
  "/:jobId/results",
  asyncHandler(bulkUploadJobController.getJobResults),
);

/**
 * POST /api/bulk-upload-jobs/:jobId/retry
 * Retry failed rows
 */
router.post(
  "/:jobId/retry",
  asyncHandler(bulkUploadJobController.retryFailedRows),
);

export default router;
