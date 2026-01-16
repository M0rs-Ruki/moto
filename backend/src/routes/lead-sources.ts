import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";

const router = Router();

const DEFAULT_LEAD_SOURCES = [
  "Ads",
  "Instagram",
  "Social Media",
  "Websites",
  "Customer Word-of-Mouth",
  "Other",
];

// Get lead sources
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    let leadSources = await prisma.leadSource.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
      orderBy: [
        { order: "asc" },
        { name: "asc" },
      ],
    });

    // If no lead sources exist, seed defaults
    if (leadSources.length === 0) {
      const dealershipId = req.user.dealershipId;
      leadSources = await Promise.all(
        DEFAULT_LEAD_SOURCES.map((name, index) =>
          prisma.leadSource.create({
            data: {
              name,
              order: index,
              isDefault: true,
              dealershipId,
            },
          })
        )
      );
    }

    res.json({ leadSources });
  })
);

// Create lead source
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { name, order } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    // Check if name already exists
    const existing = await prisma.leadSource.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        name: name.trim(),
      },
    });

    if (existing) {
      res.status(400).json({ error: "Lead source with this name already exists" });
      return;
    }

    // Get max order if not provided
    const maxOrder =
      order !== undefined
        ? order
        : await prisma.leadSource
            .findMany({
              where: { dealershipId: req.user.dealershipId },
              orderBy: { order: "desc" },
              take: 1,
            })
            .then((sources) => (sources[0]?.order ?? -1) + 1);

    const leadSource = await prisma.leadSource.create({
      data: {
        name: name.trim(),
        order: maxOrder,
        isDefault: false,
        dealershipId: req.user.dealershipId,
      },
    });

    res.json({ leadSource });
  })
);

// Update lead source
router.put(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id, name, order } = req.body;

    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }

    // Check if lead source exists
    const existing = await prisma.leadSource.findFirst({
      where: {
        id,
        dealershipId: req.user.dealershipId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: "Lead source not found" });
      return;
    }

    // If name is being changed, check for duplicates
    if (name && name.trim() !== existing.name) {
      const duplicate = await prisma.leadSource.findFirst({
        where: {
          dealershipId: req.user.dealershipId,
          name: name.trim(),
          id: { not: id },
        },
      });

      if (duplicate) {
        res.status(400).json({ error: "Lead source with this name already exists" });
        return;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (order !== undefined) updateData.order = order;

    const leadSource = await prisma.leadSource.update({
      where: { id },
      data: updateData,
    });

    res.json({ leadSource });
  })
);

// Delete lead source
router.delete(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }

    // Check if lead source exists
    const existing = await prisma.leadSource.findFirst({
      where: {
        id,
        dealershipId: req.user.dealershipId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: "Lead source not found" });
      return;
    }

    // Delete the lead source
    await prisma.leadSource.delete({
      where: { id },
    });

    res.json({ success: true });
  })
);

export default router;

