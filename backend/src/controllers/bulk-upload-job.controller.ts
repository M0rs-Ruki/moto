import { Request, Response } from "express";
import { bulkUploadJobRepository } from "../repositories/bulk-upload-job.repository";
import { PAGINATION } from "../config/constants";

export class BulkUploadJobController {
  /**
   * Get job status
   * GET /api/bulk-upload-jobs/:jobId
   */
  getJobStatus = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { jobId } = req.params;

    try {
      const job = await bulkUploadJobRepository.getJob(jobId);

      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }

      // Check if user belongs to this dealership
      if (job.dealershipId !== req.user.dealershipId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const progress =
        job.totalRows > 0
          ? Math.round((job.processedRows / job.totalRows) * 100)
          : 0;

      res.json({
        jobId: job.jobId,
        status: job.status,
        totalRows: job.totalRows,
        processedRows: job.processedRows,
        successCount: job.successCount,
        errorCount: job.errorCount,
        progress: `${progress}%`,
        failedRows: job.failedRows,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  /**
   * Get job results (list of processed rows)
   * GET /api/bulk-upload-jobs/:jobId/results
   */
  getJobResults = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { jobId } = req.params;
    const limit = parseInt(
      (req.query.limit as string) || String(PAGINATION.DEFAULT_LIMIT),
      10,
    );
    const skip = parseInt(
      (req.query.skip as string) || String(PAGINATION.DEFAULT_SKIP),
      10,
    );

    try {
      const job = await bulkUploadJobRepository.getJob(jobId);

      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }

      if (job.dealershipId !== req.user.dealershipId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const results = await bulkUploadJobRepository.getJobResults(
        jobId,
        limit,
        skip,
      );

      res.json({
        jobId,
        total: job.totalRows,
        results,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  /**
   * Retry failed rows for a job
   * POST /api/bulk-upload-jobs/:jobId/retry
   */
  retryFailedRows = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { jobId } = req.params;

    try {
      const job = await bulkUploadJobRepository.getJob(jobId);

      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }

      if (job.dealershipId !== req.user.dealershipId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      if (job.status !== "COMPLETED" || job.errorCount === 0) {
        res.status(400).json({
          error: "Can only retry jobs that are completed with errors",
        });
        return;
      }

      // TODO: Implement retry logic
      // This would re-add failed rows to the queue

      res.json({
        message: "Retry job queued",
        jobId,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}

export const bulkUploadJobController = new BulkUploadJobController();
