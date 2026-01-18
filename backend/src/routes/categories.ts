import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";
import { PERMISSIONS } from "../config/permissions";

const router: Router = Router();

// Get all categories (no permission check - needed for forms)
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const categories = await prisma.vehicleCategory.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
      include: {
        models: {
          include: {
            variants: {
              orderBy: {
                name: "asc",
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({ categories });
  })
);

// Create category
router.post(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.SETTINGS_VEHICLE_MODELS),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }

    const category = await prisma.vehicleCategory.create({
      data: {
        name,
        dealershipId: req.user.dealershipId,
      },
    });

    res.json({ success: true, category });
  })
);

// Delete category
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
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    // Verify category belongs to user's dealership
    const category = await prisma.vehicleCategory.findFirst({
      where: {
        id,
        dealershipId: req.user.dealershipId,
      },
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    // Delete category (models will be cascade deleted)
    await prisma.vehicleCategory.delete({
      where: { id },
    });

    res.json({ success: true, message: "Category deleted" });
  })
);

export default router;

