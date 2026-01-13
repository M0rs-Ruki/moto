import { Router } from "express";
import multer from "multer";
import { FieldInquiryController } from "../controllers/field-inquiry.controller";
import { authenticate, asyncHandler } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const controller = new FieldInquiryController();

// Create field inquiry
router.post("/", authenticate, asyncHandler(controller.create));

// Get field inquiries
router.get("/", authenticate, asyncHandler(controller.getAll));

// Update lead scope
router.patch("/:id", authenticate, asyncHandler(controller.updateLeadScope));

// Bulk upload
router.post(
  "/bulk",
  authenticate,
  upload.single("file"),
  asyncHandler(controller.bulkUpload)
);

export default router;
