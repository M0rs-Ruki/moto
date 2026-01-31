import { Request, Response } from "express";
import {
  ExportService,
  ExportType,
  DateRange,
} from "../services/export.service";

const VALID_TYPES: ExportType[] = [
  "visitors",
  "digital-enquiry",
  "field-inquiry",
  "delivery-tickets",
];
const VALID_RANGES: DateRange[] = ["1m", "3m", "6m", "1y"];

export class ExportController {
  private service: ExportService;

  constructor() {
    this.service = new ExportService();
  }

  /**
   * Export data to Excel
   * GET /api/export/:type?range=1m|3m|6m|1y
   */
  exportData = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const type = req.params.type as ExportType;
    const range = (req.query.range as DateRange) || "1m";

    // Validate type
    if (!VALID_TYPES.includes(type)) {
      res.status(400).json({
        error: `Invalid export type. Must be one of: ${VALID_TYPES.join(", ")}`,
      });
      return;
    }

    // Validate range
    if (!VALID_RANGES.includes(range)) {
      res.status(400).json({
        error: `Invalid date range. Must be one of: ${VALID_RANGES.join(", ")}`,
      });
      return;
    }

    try {
      const { buffer, filename } = await this.service.export(
        type,
        req.user.dealershipId,
        range,
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.send(buffer);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
