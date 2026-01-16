"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitor_controller_1 = require("../controllers/visitor.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new visitor_controller_1.VisitorController();
// Create visitor
router.post("/", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.create));
// Get visitors
router.get("/", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.getAll));
// Create session for existing visitor
router.post("/session", auth_1.authenticate, (0, auth_1.asyncHandler)(controller.createSession));
exports.default = router;
//# sourceMappingURL=visitors.routes.js.map