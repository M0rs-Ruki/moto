import { Router } from "express";
import { FieldInquiryController } from "../controllers/field-inquiry.controller";
import { authenticate, asyncHandler } from "../middleware/auth";

const router: Router = Router();
const controller = new FieldInquiryController();

// Create field inquiry
router.post("/", authenticate, asyncHandler(controller.create));

// Get field inquiries
router.get("/", authenticate, asyncHandler(controller.getAll));

// Update lead scope
router.patch("/:id", authenticate, asyncHandler(controller.updateLeadScope));

// Bulk upload
router.post("/bulk", authenticate, asyncHandler(controller.bulkUpload));

export default router;
