import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";
import { PERMISSIONS } from "../config/permissions";

const router: Router = Router();

// Get statistics
router.get(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.DASHBOARD),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const countByDateRange = async (
      model: any,
      whereClause: any,
      dateField: string = "createdAt"
    ) => {
      const today = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: todayStart,
          },
        },
      });

      const week = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: weekStart,
          },
        },
      });

      const month = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: monthStart,
          },
        },
      });

      const year = await model.count({
        where: {
          ...whereClause,
          [dateField]: {
            gte: yearStart,
          },
        },
      });

      const total = await model.count({
        where: whereClause,
      });

      return { today, week, month, year, total };
    };

    const baseWhere = { dealershipId: req.user.dealershipId };

    const dailyWalkins = await countByDateRange(prisma.visitor, baseWhere);
    const digitalEnquiry = await countByDateRange(prisma.digitalEnquiry, baseWhere);
    const fieldInquiry = await countByDateRange(prisma.fieldInquiry, baseWhere);
    const deliveryUpdate = await countByDateRange(prisma.deliveryTicket, baseWhere);

    res.json({
      dailyWalkins,
      digitalEnquiry,
      fieldInquiry,
      deliveryUpdate,
    });
  })
);

export default router;

