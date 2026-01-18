import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";
import { PERMISSIONS } from "../config/permissions";

const router: Router = Router();

// Create variant
router.post(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.SETTINGS_VEHICLE_MODELS),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { name, modelId } = req.body;

    if (!name || !modelId) {
      res.status(400).json({ error: "Variant name and model ID are required" });
      return;
    }

    // Verify model belongs to user's dealership through category
    const model = await prisma.vehicleModel.findFirst({
      where: {
        id: modelId,
        category: {
          dealershipId: req.user.dealershipId,
        },
      },
    });

    if (!model) {
      res.status(404).json({ error: "Model not found" });
      return;
    }

    const variant = await prisma.vehicleVariant.create({
      data: {
        name,
        modelId,
      },
    });

    res.json({ success: true, variant });
  })
);

// Delete variant
router.delete(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.SETTINGS_VEHICLE_MODELS),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: "Variant ID is required" });
      return;
    }

    // Verify variant belongs to user's dealership through model and category
    const variant = await prisma.vehicleVariant.findFirst({
      where: {
        id,
        model: {
          category: {
            dealershipId: req.user.dealershipId,
          },
        },
      },
    });

    if (!variant) {
      res.status(404).json({ error: "Variant not found" });
      return;
    }

    // Delete variant
    await prisma.vehicleVariant.delete({
      where: { id },
    });

    res.json({ success: true, message: "Variant deleted" });
  })
);

export default router;

