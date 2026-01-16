import { Request, Response } from "express";
import { VisitorService } from "../services/visitor.service";
import { CreateVisitorDto } from "../dto/request/create-visitor.dto";
import { CreateSessionDto } from "../dto/request/create-session.dto";
import { PAGINATION } from "../config/constants";

export class VisitorController {
  private service: VisitorService;

  constructor() {
    this.service = new VisitorService();
  }

  /**
   * Create a visitor
   * POST /api/visitors
   */
  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const data: CreateVisitorDto = req.body;

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.whatsappNumber || !data.reason) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const result = await this.service.createVisitor(data, req.user.dealershipId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  /**
   * Get visitors
   * GET /api/visitors
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const phoneNumber = req.query.phone as string | undefined;

    // If phone number provided, do lookup
    if (phoneNumber) {
      try {
        const result = await this.service.lookupByPhone(
          phoneNumber,
          req.user.dealershipId
        );
        res.json(result);
        return;
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
        return;
      }
    }

    // Otherwise, get paginated list
    const limit = parseInt(
      (req.query.limit as string) || String(PAGINATION.DEFAULT_LIMIT),
      10
    );
    const skip = parseInt(
      (req.query.skip as string) || String(PAGINATION.DEFAULT_SKIP),
      10
    );

    try {
      const result = await this.service.getVisitors(
        req.user.dealershipId,
        limit,
        skip
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  /**
   * Create session for existing visitor
   * POST /api/visitors/session
   */
  createSession = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const data: CreateSessionDto = req.body;

    // Validate required fields
    if (!data.visitorId || !data.reason) {
      res.status(400).json({ error: "Missing required fields: visitorId and reason" });
      return;
    }

    try {
      const result = await this.service.createSession(data, req.user.dealershipId);
      res.json(result);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "Visitor not found") {
        res.status(404).json({ error: errorMessage });
      } else {
        res.status(500).json({ error: errorMessage });
      }
    }
  };
}
