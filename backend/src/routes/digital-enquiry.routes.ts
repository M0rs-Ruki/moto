import { Router } from "express";
import { DigitalEnquiryController } from "../controllers/digital-enquiry.controller";
import { authenticate, asyncHandler } from "../middleware/auth";

const router = Router();
const controller = new DigitalEnquiryController();

// Create digital enquiry
router.post("/", authenticate, asyncHandler(controller.create));

// Get digital enquiries
router.get("/", authenticate, asyncHandler(controller.getAll));

// Update lead scope
router.patch("/:id", authenticate, asyncHandler(controller.updateLeadScope));

// Bulk upload
router.post("/bulk", authenticate, asyncHandler(controller.bulkUpload));

export default router;
