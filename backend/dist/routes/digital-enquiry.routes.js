"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const digital_enquiry_controller_1 = require("../controllers/digital-enquiry.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new digital_enquiry_controller_1.DigitalEnquiryController();
// Create digital enquiry
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.create));
// Get digital enquiries
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.getAll));
// Update lead scope
router.patch("/:id", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.updateLeadScope));
// Bulk upload
router.post("/bulk", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.bulkUpload));
exports.default = router;
//# sourceMappingURL=digital-enquiry.routes.js.map