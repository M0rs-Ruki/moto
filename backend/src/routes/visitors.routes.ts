import { Router } from "express";
import { VisitorController } from "../controllers/visitor.controller";
import { authenticate, asyncHandler } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";
import { PERMISSIONS } from "../config/permissions";

const router: Router = Router();
const controller = new VisitorController();

// Create visitor
router.post("/", authenticate, checkPermission(PERMISSIONS.DAILY_WALKINS_VISITORS), asyncHandler(controller.create));

// Get visitors
router.get("/", authenticate, checkPermission(PERMISSIONS.DAILY_WALKINS_VISITORS), asyncHandler(controller.getAll));

// Create session for existing visitor
router.post("/session", authenticate, checkPermission(PERMISSIONS.DAILY_WALKINS_VISITORS), asyncHandler(controller.createSession));

export default router;
