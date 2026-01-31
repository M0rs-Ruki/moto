import { Router } from "express";
import { ExportController } from "../controllers/export.controller";
import { authenticate, asyncHandler } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";
import { PERMISSIONS } from "../config/permissions";

const router: Router = Router();
const controller = new ExportController();

// Export data to Excel
// GET /api/export/:type?range=1m|3m|6m|1y
// type: visitors | digital-enquiry | field-inquiry | delivery-tickets
router.get(
  "/:type",
  authenticate,
  checkPermission(PERMISSIONS.EXPORT_EXCEL),
  asyncHandler(controller.exportData),
);

export default router;
