import { Request, Response } from "express";
import {
  ExportService,
  ExportType,
  DateRange,
  CustomDateRange,
} from "../services/export.service";

const VALID_TYPES: ExportType[] = [
  "visitors",
  "digital-enquiry",
  "field-inquiry",
  "delivery-tickets",
];
const VALID_RANGES: DateRange[] = ["1m", "3m", "6m", "1y", "custom"];

function parseDate(s: string): Date | null {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export class ExportController {
  private service: ExportService;

  constructor() {
    this.service = new ExportService();
  }

  /**
   * Export data to Excel
   * GET /api/export/:type?range=1m|3m|6m|1y
   * GET /api/export/:type?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD (custom range)
   */
  exportData = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const type = req.params.type as ExportType;
    const startDateParam = req.query.startDate as string | undefined;
    const endDateParam = req.query.endDate as string | undefined;

    // Validate type
    if (!VALID_TYPES.includes(type)) {
      res.status(400).json({
        error: `Invalid export type. Must be one of: ${VALID_TYPES.join(", ")}`,
      });
      return;
    }

    let range: DateRange = (req.query.range as DateRange) || "1m";
    let custom: CustomDateRange | undefined;

    if (
      startDateParam &&
      endDateParam &&
      /^\d{4}-\d{2}-\d{2}$/.test(startDateParam) &&
      /^\d{4}-\d{2}-\d{2}$/.test(endDateParam)
    ) {
      const start = parseDate(startDateParam + "T00:00:00.000Z");
      const end = parseDate(endDateParam + "T23:59:59.999Z");
      if (!start || !end) {
        res.status(400).json({ error: "Invalid startDate or endDate" });
        return;
      }
      if (start > end) {
        res.status(400).json({
          error: "startDate must be before or equal to endDate",
        });
        return;
      }
      range = "custom";
      custom = { startDate: startDateParam, endDate: endDateParam };
    } else if (!VALID_RANGES.includes(range)) {
      res.status(400).json({
        error: `Invalid date range. Use range=1m|3m|6m|1y or provide startDate and endDate (YYYY-MM-DD).`,
      });
      return;
    }

    if (range === "custom" && !custom) {
      res.status(400).json({
        error: "For custom range, provide both startDate and endDate (YYYY-MM-DD)",
      });
      return;
    }

    try {
      const { buffer, filename } = await this.service.export(
        type,
        req.user.dealershipId,
        range,
        custom,
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
