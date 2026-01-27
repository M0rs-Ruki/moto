import prisma from "../lib/db";
import { BulkUploadJobStatus } from "@prisma/client";

export class BulkUploadJobRepository {
  /**
   * Create a new bulk upload job record
   */
  async createJob(data: {
    jobId: string;
    type: string;
    totalRows: number;
    dealershipId: string;
  }) {
    return prisma.bulkUploadJob.create({
      data: {
        jobId: data.jobId,
        type: data.type,
        totalRows: data.totalRows,
        dealershipId: data.dealershipId,
        status: "QUEUED" as BulkUploadJobStatus,
      },
    });
  }

  /**
   * Update job status and progress
   */
  async updateJobProgress(
    jobId: string,
    data: {
      processedRows?: number;
      successCount?: number;
      errorCount?: number;
      status?: BulkUploadJobStatus;
    },
  ) {
    return prisma.bulkUploadJob.update({
      where: { jobId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Mark job as completed
   */
  async completeJob(
    jobId: string,
    data: {
      successCount: number;
      errorCount: number;
      failedRows?: any[];
    },
  ) {
    return prisma.bulkUploadJob.update({
      where: { jobId },
      data: {
        status: "COMPLETED" as BulkUploadJobStatus,
        successCount: data.successCount,
        errorCount: data.errorCount,
        ...(data.failedRows &&
          data.failedRows.length > 0 && { failedRows: data.failedRows }),
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Mark job as failed
   */
  async failJob(jobId: string, error: string) {
    return prisma.bulkUploadJob.update({
      where: { jobId },
      data: {
        status: "FAILED" as BulkUploadJobStatus,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get job by ID
   */
  async getJob(jobId: string) {
    return prisma.bulkUploadJob.findUnique({
      where: { jobId },
    });
  }

  /**
   * Get job results
   */
  async getJobResults(jobId: string, limit = 100, skip = 0) {
    return prisma.bulkUploadJobResult.findMany({
      where: { jobId },
      take: limit,
      skip,
      orderBy: { rowNumber: "asc" },
    });
  }

  /**
   * Create job result record
   */
  async createJobResult(data: {
    jobId: string;
    rowNumber: number;
    success: boolean;
    data?: any;
    error?: string;
  }) {
    return prisma.bulkUploadJobResult.create({
      data,
    });
  }
}

export const bulkUploadJobRepository = new BulkUploadJobRepository();
