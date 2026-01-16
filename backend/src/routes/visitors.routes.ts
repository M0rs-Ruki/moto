import { Router } from "express";
import { VisitorController } from "../controllers/visitor.controller";
import { authenticate, asyncHandler } from "../middleware/auth";

const router: Router = Router();
const controller = new VisitorController();

// Create visitor
router.post("/", authenticate, asyncHandler(controller.create));

// Get visitors
router.get("/", authenticate, asyncHandler(controller.getAll));

// Create session for existing visitor
router.post("/session", authenticate, asyncHandler(controller.createSession));

export default router;
