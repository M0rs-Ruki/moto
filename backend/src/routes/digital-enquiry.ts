import { Router, Request, Response } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import prisma from "../lib/db";
import { whatsappClient } from "../lib/whatsapp";
import { authenticate, asyncHandler } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

interface ExcelRow {
  Date?: string | number | Date;
  Name?: string;
  "WhatsApp Number"?: string;
  Location?: string;
  Model?: string;
  Source?: string;
}

interface ProcessingResult {
  success: boolean;
  rowNumber: number;
  enquiryId?: string;
  error?: string;
}

// Create digital enquiry
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const {
      firstName,
      lastName,
      whatsappNumber,
      email,
      address,
      reason,
      leadSourceId,
      leadScope,
      interestedModelId,
      interestedVariantId,
    } = req.body;

    if (!firstName || !lastName || !whatsappNumber || !reason) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if contact already exists
    const existingEnquiry = await prisma.digitalEnquiry.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        whatsappNumber: whatsappNumber,
      },
    });

    let whatsappContactId = existingEnquiry?.whatsappContactId || "";

    // Create WhatsApp contact if it doesn't exist
    if (!whatsappContactId) {
      try {
        const contactResult = await whatsappClient.createContact({
          firstName,
          lastName,
          contact_number: whatsappNumber,
          email: email || "",
          address: address || "",
        });

        whatsappContactId = contactResult.contactId;

        if (!whatsappContactId) {
          throw new Error("No contact ID returned from WhatsApp API");
        }
      } catch (error: unknown) {
        console.error("Failed to create WhatsApp contact:", (error as Error).message);
        res.status(500).json({
          error: "Failed to create WhatsApp contact",
          details: (error as Error).message,
        });
        return;
      }
    }

    // Create digital enquiry
    const enquiry = await prisma.digitalEnquiry.create({
      data: {
        firstName,
        lastName,
        whatsappNumber,
        email: email || null,
        address: address || null,
        reason,
        leadScope: leadScope || "warm",
        whatsappContactId,
        dealershipId: req.user.dealershipId,
        leadSourceId: leadSourceId || null,
        interestedModelId: interestedModelId || null,
        interestedVariantId: interestedVariantId || null,
      },
    });

    // Get WhatsApp template
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "digital_enquiry",
        section: "digital_enquiry",
      },
    });

    let messageStatus = "not_sent";
    let messageError = null;

    if (template && template.templateId && template.templateName && whatsappContactId) {
      try {
        await whatsappClient.sendTemplate({
          contactId: whatsappContactId,
          contactNumber: whatsappNumber,
          templateName: template.templateName,
          templateId: template.templateId,
          templateLanguage: template.language,
          parameters: [],
        });
        messageStatus = "sent";
      } catch (error: unknown) {
        console.error("Failed to send digital enquiry message:", error);
        messageStatus = "failed";
        messageError = (error as Error).message || "Failed to send digital enquiry message";
      }
    } else if (template && (!template.templateId || !template.templateName)) {
      messageStatus = "not_configured";
      messageError = "Template ID or Template Name not configured";
    }

    res.json({
      success: true,
      enquiry: {
        id: enquiry.id,
        firstName: enquiry.firstName,
        lastName: enquiry.lastName,
      },
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  })
);

// Get digital enquiries
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const limit = parseInt((req.query.limit as string) || "50", 10);
    const skip = parseInt((req.query.skip as string) || "0", 10);

    const totalCount = await prisma.digitalEnquiry.count({
      where: {
        dealershipId: req.user.dealershipId,
      },
    });

    const enquiries = await prisma.digitalEnquiry.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
      include: {
        leadSource: true,
        model: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    const hasMore = skip + limit < totalCount;

    res.json({
      enquiries,
      hasMore,
      total: totalCount,
      skip,
      limit,
    });
  })
);

// Update digital enquiry leadScope
router.patch(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id: enquiryId } = req.params;
    const { leadScope } = req.body;

    if (!leadScope || !["hot", "warm", "cold"].includes(leadScope)) {
      res.status(400).json({
        error: "Invalid leadScope. Must be 'hot', 'warm', or 'cold'",
      });
      return;
    }

    const enquiry = await prisma.digitalEnquiry.findFirst({
      where: {
        id: enquiryId,
        dealershipId: req.user.dealershipId,
      },
    });

    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }

    const updatedEnquiry = await prisma.digitalEnquiry.update({
      where: {
        id: enquiryId,
      },
      data: {
        leadScope,
      },
      include: {
        leadSource: true,
        model: {
          include: {
            category: true,
          },
        },
      },
    });

    res.json({
      success: true,
      enquiry: updatedEnquiry,
    });
  })
);

// Bulk upload digital enquiries
router.post(
  "/bulk",
  authenticate,
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileName = file.originalname.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      res.status(400).json({
        error: "Invalid file type. Please upload an Excel file (.xlsx or .xls)",
      });
      return;
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      res.status(400).json({ error: "Excel file has no sheets" });
      return;
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      res.status(400).json({ error: "Excel file is empty" });
      return;
    }

    const firstRow = rows[0];
    const requiredColumns = ["Date", "Name", "WhatsApp Number", "Model"];
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

    if (missingColumns.length > 0) {
      res.status(400).json({
        error: `Missing required columns: ${missingColumns.join(", ")}`,
        missingColumns,
      });
      return;
    }

    const defaultLeadSource = await prisma.leadSource.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        isDefault: true,
      },
    });

    const allModels = await prisma.vehicleModel.findMany({
      where: {
        category: {
          dealershipId: req.user.dealershipId,
        },
      },
      include: {
        category: true,
      },
    });

    const allLeadSources = await prisma.leadSource.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
    });

    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "digital_enquiry",
        section: "digital_enquiry",
      },
    });

    const results: ProcessingResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      try {
        if (!row.Name || !row["WhatsApp Number"] || !row.Model) {
          results.push({
            success: false,
            rowNumber,
            error: "Missing required data (Name, WhatsApp Number, or Model)",
          });
          errorCount++;
          continue;
        }

        const nameParts = String(row.Name).trim().split(/\s+/);
        if (nameParts.length === 0) {
          results.push({
            success: false,
            rowNumber,
            error: "Name is empty",
          });
          errorCount++;
          continue;
        }

        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        let date: Date | undefined;
        if (row.Date) {
          const dateValue = row.Date;
          if (dateValue instanceof Date) {
            date = dateValue;
          } else if (typeof dateValue === "number") {
            const excelEpoch = new Date(1899, 11, 30);
            date = new Date(excelEpoch.getTime() + dateValue * 86400000);
          } else if (typeof dateValue === "string") {
            const parsedDate = new Date(dateValue);
            if (!isNaN(parsedDate.getTime())) {
              date = parsedDate;
            }
          }
          if (date && isNaN(date.getTime())) {
            date = undefined;
          }
        }

        const modelName = String(row.Model).trim();
        const matchedModel = allModels.find(
          (m) => m.name.toLowerCase() === modelName.toLowerCase()
        );

        if (!matchedModel) {
          results.push({
            success: false,
            rowNumber,
            error: `Model "${modelName}" not found`,
          });
          errorCount++;
          continue;
        }

        let leadSourceId: string | null = null;
        if (row.Source) {
          const sourceName = String(row.Source).trim();
          const matchedSource = allLeadSources.find(
            (s) => s.name.toLowerCase() === sourceName.toLowerCase()
          );
          leadSourceId = matchedSource?.id || null;
        }

        if (!leadSourceId && defaultLeadSource) {
          leadSourceId = defaultLeadSource.id;
        }

        const whatsappNumber = String(row["WhatsApp Number"]).trim();
        const address = row.Location ? String(row.Location).trim() : undefined;

        const existingEnquiry = await prisma.digitalEnquiry.findFirst({
          where: {
            dealershipId: req.user.dealershipId,
            whatsappNumber: whatsappNumber,
          },
        });

        let whatsappContactId = existingEnquiry?.whatsappContactId || "";

        if (!whatsappContactId) {
          try {
            const contactResult = await whatsappClient.createContact({
              firstName,
              lastName,
              contact_number: whatsappNumber,
              email: "",
              address: address || "",
            });

            whatsappContactId = contactResult.contactId;

            if (!whatsappContactId) {
              throw new Error("No contact ID returned from WhatsApp API");
            }
          } catch (error: unknown) {
            results.push({
              success: false,
              rowNumber,
              error: `Failed to create WhatsApp contact: ${(error as Error).message}`,
            });
            errorCount++;
            continue;
          }
        }

        const enquiry = await prisma.digitalEnquiry.create({
          data: {
            firstName,
            lastName,
            whatsappNumber,
            email: null,
            address: address || null,
            reason: date
              ? `Enquiry from ${date.toLocaleDateString()}`
              : "Bulk imported enquiry",
            leadScope: "cold",
            whatsappContactId,
            dealershipId: req.user.dealershipId,
            leadSourceId,
            interestedModelId: matchedModel.id,
            interestedVariantId: null,
          },
        });

        if (
          template &&
          template.templateId &&
          template.templateName &&
          whatsappContactId
        ) {
          try {
            await whatsappClient.sendTemplate({
              contactId: whatsappContactId,
              contactNumber: whatsappNumber,
              templateName: template.templateName,
              templateId: template.templateId,
              templateLanguage: template.language,
              parameters: [],
            });
          } catch (error: unknown) {
            console.error(`Failed to send WhatsApp message for row ${rowNumber}:`, error);
          }
        }

        results.push({
          success: true,
          rowNumber,
          enquiryId: enquiry.id,
        });
        successCount++;
      } catch (error: unknown) {
        results.push({
          success: false,
          rowNumber,
          error: (error as Error).message || "Unknown error",
        });
        errorCount++;
      }
    }

    res.json({
      success: true,
      summary: {
        total: rows.length,
        success: successCount,
        errors: errorCount,
      },
      results,
    });
  })
);

export default router;
