import { Request, Response } from "express";
import { DigitalEnquiryService } from "../services/digital-enquiry.service";
import { CreateDigitalEnquiryDto } from "../dto/request/create-digital-enquiry.dto";
import { UpdateLeadScopeDto } from "../dto/request/update-lead-scope.dto";
import { PAGINATION } from "../config/constants";
import { RabbitMQPublisherService } from "../services/rabbitmq-publisher.service";
import { bulkUploadJobRepository } from "../repositories/bulk-upload-job.repository";
import { v4 as uuidv4 } from "uuid";

export class DigitalEnquiryController {
  private service: DigitalEnquiryService;

  constructor() {
    this.service = new DigitalEnquiryService();
  }

  /**
   * Create a digital enquiry
   * POST /api/digital-enquiry
   */
  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const data: CreateDigitalEnquiryDto = req.body;

    // Validate required fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.whatsappNumber ||
      !data.reason
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const result = await this.service.createEnquiry(
        data,
        req.user.dealershipId,
      );
      res.json(result);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Failed to create WhatsApp contact")) {
        res.status(500).json({
          error: "Failed to create WhatsApp contact",
          details: errorMessage,
        });
      } else {
        res.status(500).json({ error: errorMessage });
      }
    }
  };

  /**
   * Get digital enquiries
   * GET /api/digital-enquiry
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const limit = parseInt(
      (req.query.limit as string) || String(PAGINATION.DEFAULT_LIMIT),
      10,
    );
    const skip = parseInt(
      (req.query.skip as string) || String(PAGINATION.DEFAULT_SKIP),
      10,
    );

    try {
      const result = await this.service.getEnquiries(
        req.user.dealershipId,
        limit,
        skip,
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  /**
   * Update lead scope
   * PATCH /api/digital-enquiry/:id
   */
  updateLeadScope = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.params;
    const data: UpdateLeadScopeDto = req.body;

    try {
      const result = await this.service.updateLeadScope(
        id,
        data,
        req.user.dealershipId,
      );
      res.json(result);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "Enquiry not found") {
        res.status(404).json({ error: errorMessage });
      } else if (errorMessage.includes("Invalid leadScope")) {
        res.status(400).json({ error: errorMessage });
      } else {
        res.status(500).json({ error: errorMessage });
      }
    }
  };

  /**
   * Bulk upload digital enquiries
   * POST /api/digital-enquiry/bulk
   */
  bulkUpload = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { rows } = req.body;
    const userId = req.user.userId;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: "No data provided or invalid format" });
      return;
    }

    try {
      // Create unique job ID
      const jobId = uuidv4();

      // Save job record in database
      await bulkUploadJobRepository.createJob({
        jobId,
        type: "digital_enquiry",
        totalRows: rows.length,
        dealershipId: req.user.dealershipId,
      });

      // Publish job to RabbitMQ queue
      await RabbitMQPublisherService.publishExcelUploadJob({
        jobId,
        dealershipId: req.user.dealershipId,
        type: "digital_enquiry",
        rows,
        totalRows: rows.length,
        userId,
        timestamp: Date.now(),
      });

      // Return immediately with job ID (202 = Accepted)
      res.status(202).json({
        success: true,
        message: "Upload job queued for processing",
        jobId,
        totalRows: rows.length,
        status: "queued",
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("❌ Bulk upload error:", errorMessage, error);
      if (errorMessage.includes("Missing required columns")) {
        res.status(400).json({ error: errorMessage });
      } else {
        res
          .status(500)
          .json({ error: "Failed to queue upload job", details: errorMessage });
      }
    }
  };
}
