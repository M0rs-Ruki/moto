"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const field_inquiry_controller_1 = require("../controllers/field-inquiry.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new field_inquiry_controller_1.FieldInquiryController();
// Create field inquiry
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.create));
// Get field inquiries
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.getAll));
// Update lead scope
router.patch("/:id", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.updateLeadScope));
// Bulk upload
router.post("/bulk", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.bulkUpload));
exports.default = router;
//# sourceMappingURL=field-inquiry.routes.js.map