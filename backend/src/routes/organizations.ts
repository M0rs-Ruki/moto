import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import {
  authenticate,
  requireSuperAdmin,
  asyncHandler,
} from "../middleware/auth";

/**
 * =============================================================
 * ORGANIZATION ROUTES
 * =============================================================
 * Routes for managing organizations.
 * Most routes require Super Admin role.
 * =============================================================
 */

const router: Router = Router();

// ============================================================
// GET /organizations/me - Get current user's organization
// ============================================================
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        organization: {
          include: {
            featureToggles: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
        dealership: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      organization: user.organization,
      dealership: user.dealership,
      role: user.role,
    });
  }),
);

// ============================================================
// GET /organizations/users - Get all users in organization
// (Super Admin only)
// ============================================================
router.get(
  "/users",
  authenticate,
  requireSuperAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      res.status(400).json({ error: "No organization assigned" });
      return;
    }

    const users = await prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        permissions: true,
      },
      orderBy: [{ role: "asc" }, { email: "asc" }],
    });

    res.json({ users });
  }),
);

// ============================================================
// GET /organizations/feature-toggles - Get org feature toggles
// (Super Admin only)
// ============================================================
router.get(
  "/feature-toggles",
  authenticate,
  requireSuperAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      res.status(400).json({ error: "No organization assigned" });
      return;
    }

    const toggles = await prisma.orgFeatureToggle.findUnique({
      where: { organizationId: user.organizationId },
    });

    res.json({ featureToggles: toggles });
  }),
);

// ============================================================
// PATCH /organizations/feature-toggles - Update feature toggles
// (Super Admin only)
// ============================================================
router.patch(
  "/feature-toggles",
  authenticate,
  requireSuperAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      res.status(400).json({ error: "No organization assigned" });
      return;
    }

    const {
      dashboard,
      dailyWalkinsVisitors,
      dailyWalkinsSessions,
      digitalEnquiry,
      fieldInquiry,
      deliveryUpdate,
      exportExcel,
      settingsProfile,
      settingsVehicleModels,
      settingsLeadSources,
      settingsWhatsApp,
    } = req.body;

    const toggles = await prisma.orgFeatureToggle.upsert({
      where: { organizationId: user.organizationId },
      update: {
        ...(dashboard !== undefined && { dashboard }),
        ...(dailyWalkinsVisitors !== undefined && { dailyWalkinsVisitors }),
        ...(dailyWalkinsSessions !== undefined && { dailyWalkinsSessions }),
        ...(digitalEnquiry !== undefined && { digitalEnquiry }),
        ...(fieldInquiry !== undefined && { fieldInquiry }),
        ...(deliveryUpdate !== undefined && { deliveryUpdate }),
        ...(exportExcel !== undefined && { exportExcel }),
        ...(settingsProfile !== undefined && { settingsProfile }),
        ...(settingsVehicleModels !== undefined && { settingsVehicleModels }),
        ...(settingsLeadSources !== undefined && { settingsLeadSources }),
        ...(settingsWhatsApp !== undefined && { settingsWhatsApp }),
      },
      create: {
        organizationId: user.organizationId,
        dashboard: dashboard ?? true,
        dailyWalkinsVisitors: dailyWalkinsVisitors ?? true,
        dailyWalkinsSessions: dailyWalkinsSessions ?? true,
        digitalEnquiry: digitalEnquiry ?? true,
        fieldInquiry: fieldInquiry ?? true,
        deliveryUpdate: deliveryUpdate ?? true,
        exportExcel: exportExcel ?? true,
        settingsProfile: settingsProfile ?? true,
        settingsVehicleModels: settingsVehicleModels ?? true,
        settingsLeadSources: settingsLeadSources ?? true,
        settingsWhatsApp: settingsWhatsApp ?? true,
      },
    });

    res.json({ featureToggles: toggles });
  }),
);

// ============================================================
// GET /organizations/statistics - Get org-wide statistics
// (Super Admin only)
// ============================================================
router.get(
  "/statistics",
  authenticate,
  requireSuperAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { organizationId: true, dealershipId: true },
    });

    if (!user?.organizationId) {
      res.status(400).json({ error: "No organization assigned" });
      return;
    }

    // Get statistics using dealershipId (legacy support)
    const dealershipId = user.dealershipId;

    const [
      totalUsers,
      totalVisitors,
      totalDigitalEnquiries,
      totalFieldInquiries,
      totalDeliveryTickets,
    ] = await Promise.all([
      prisma.user.count({ where: { organizationId: user.organizationId } }),
      prisma.visitor.count({ where: { dealershipId } }),
      prisma.digitalEnquiry.count({ where: { dealershipId } }),
      prisma.fieldInquiry.count({ where: { dealershipId } }),
      prisma.deliveryTicket.count({ where: { dealershipId } }),
    ]);

    res.json({
      totals: {
        users: totalUsers,
        visitors: totalVisitors,
        digitalEnquiries: totalDigitalEnquiries,
        fieldInquiries: totalFieldInquiries,
        deliveryTickets: totalDeliveryTickets,
      },
    });
  }),
);

// ============================================================
// GET /organizations/user-stats - Get per-user activity stats
// (Super Admin only)
// Note: Currently returns user list with basic info since
// createdById tracking is not implemented on entities
// ============================================================
router.get(
  "/user-stats",
  authenticate,
  requireSuperAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { organizationId: true, dealershipId: true },
    });

    if (!user?.organizationId) {
      res.status(400).json({ error: "No organization assigned" });
      return;
    }

    const dealershipId = user.dealershipId;

    // Get all users in the organization with their basic info
    const users = await prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: [{ role: "asc" }, { email: "asc" }],
    });

    // Get overall totals for the dealership
    const [
      totalVisitors,
      totalDigitalEnquiries,
      totalFieldInquiries,
      totalDeliveryTickets,
    ] = await Promise.all([
      prisma.visitor.count({ where: { dealershipId } }),
      prisma.digitalEnquiry.count({ where: { dealershipId } }),
      prisma.fieldInquiry.count({ where: { dealershipId } }),
      prisma.deliveryTicket.count({ where: { dealershipId } }),
    ]);

    // Add placeholder stats for each user (can be enhanced later with createdById tracking)
    const userStats = users.map((u) => ({
      ...u,
      stats: {
        visitors: 0, // Would need createdById field to track
        digitalEnquiries: 0,
        fieldInquiries: 0,
        deliveryTickets: 0,
        total: 0,
      },
    }));

    res.json({
      users: userStats,
      totals: {
        visitors: totalVisitors,
        digitalEnquiries: totalDigitalEnquiries,
        fieldInquiries: totalFieldInquiries,
        deliveryTickets: totalDeliveryTickets,
      },
    });
  }),
);

// ============================================================
// GET /organizations/user-stats/:userId - Get specific user details
// (Super Admin only)
// ============================================================
router.get(
  "/user-stats/:userId",
  authenticate,
  requireSuperAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { organizationId: true, dealershipId: true },
    });

    if (!currentUser?.organizationId) {
      res.status(400).json({ error: "No organization assigned" });
      return;
    }

    // Get user details with permissions
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: currentUser.organizationId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
        dealershipId: true,
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get activity counts for this user's dealership
    // Note: Once createdById is added to entities, we can filter by user
    const dealershipId = user.dealershipId;

    const [visitors, digitalEnquiries, fieldInquiries, deliveryTickets] =
      await Promise.all([
        prisma.visitor.count({ where: { dealershipId } }),
        prisma.digitalEnquiry.count({ where: { dealershipId } }),
        prisma.fieldInquiry.count({ where: { dealershipId } }),
        prisma.deliveryTicket.count({ where: { dealershipId } }),
      ]);

    res.json({
      user: {
        ...user,
        lastActive: user.updatedAt,
        activityStats: {
          visitors,
          digitalEnquiries,
          fieldInquiries,
          deliveryTickets,
        },
      },
    });
  }),
);

export default router;
