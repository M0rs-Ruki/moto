import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";
import { PERMISSIONS } from "../config/permissions";

const router: Router = Router();

// Get templates (no permission check - needed for forms)
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const templates = await prisma.whatsAppTemplate.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
      orderBy: {
        type: "asc",
      },
    });

    // Ensure required templates exist
    const hasDeliveryReminder = templates.some(
      (t) => t.type === "delivery_reminder"
    );

    if (!hasDeliveryReminder) {
      const deliveryTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Delivery Reminder",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_reminder",
          section: "delivery_update",
          dealershipId: req.user.dealershipId,
        },
      });
      templates.push(deliveryTemplate);
    }

    const hasDigitalEnquiry = templates.some(
      (t) => t.type === "digital_enquiry" && t.section === "digital_enquiry"
    );

    if (!hasDigitalEnquiry) {
      const digitalEnquiryTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Digital Enquiry",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "digital_enquiry",
          section: "digital_enquiry",
          dealershipId: req.user.dealershipId,
        },
      });
      templates.push(digitalEnquiryTemplate);
    }

    const hasDeliveryCompletion = templates.some(
      (t) => t.type === "delivery_completion" && t.section === "delivery_update"
    );

    if (!hasDeliveryCompletion) {
      const deliveryCompletionTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Delivery Completion",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_completion",
          section: "delivery_update",
          dealershipId: req.user.dealershipId,
        },
      });
      templates.push(deliveryCompletionTemplate);
    }

    const hasFieldInquiry = templates.some(
      (t) => t.type === "field_inquiry" && t.section === "field_inquiry"
    );

    if (!hasFieldInquiry) {
      const fieldInquiryTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Field Inquiry",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "field_inquiry",
          section: "field_inquiry",
          dealershipId: req.user.dealershipId,
        },
      });
      templates.push(fieldInquiryTemplate);
    }

    res.json({ templates });
  })
);

// Update template
router.put(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.SETTINGS_WHATSAPP),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id, name, templateId, templateName, language, section } = req.body;

    if (!id || !name || !templateId || !templateName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Verify template belongs to user's dealership
    const existingTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        id,
        dealershipId: req.user.dealershipId,
      },
    });

    if (!existingTemplate) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    const template = await prisma.whatsAppTemplate.update({
      where: { id },
      data: {
        name,
        templateId,
        templateName,
        language: language || "en_US",
        section: section || existingTemplate.section || "global",
      },
    });

    res.json({ success: true, template });
  })
);

export default router;

