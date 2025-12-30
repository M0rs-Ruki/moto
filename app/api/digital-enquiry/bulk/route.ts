import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";
import * as XLSX from "xlsx";

interface ExcelRow {
  Date?: string | number;
  Name?: string;
  "WhatsApp Number"?: string;
  Location?: string;
  Model?: string;
  Source?: string;
}

interface ProcessedRow {
  date?: Date;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  address?: string;
  modelName?: string;
  sourceName?: string;
}

interface ProcessingResult {
  success: boolean;
  rowNumber: number;
  enquiryId?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an Excel file (.xlsx or .xls)" },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json(
        { error: "Excel file has no sheets" },
        { status: 400 }
      );
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Excel file is empty" },
        { status: 400 }
      );
    }

    // Validate required columns
    const firstRow = rows[0];
    const requiredColumns = ["Date", "Name", "WhatsApp Number", "Model"];
    const missingColumns = requiredColumns.filter(
      (col) => !(col in firstRow)
    );

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required columns: ${missingColumns.join(", ")}`,
          missingColumns,
        },
        { status: 400 }
      );
    }

    // Get default lead source
    const defaultLeadSource = await prisma.leadSource.findFirst({
      where: {
        dealershipId: user.dealershipId,
        isDefault: true,
      },
    });

    // Get all models for matching
    const allModels = await prisma.vehicleModel.findMany({
      where: {
        category: {
          dealershipId: user.dealershipId,
        },
      },
      include: {
        category: true,
      },
    });

    // Get all lead sources for matching
    const allLeadSources = await prisma.leadSource.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
    });

    // Get WhatsApp template
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "digital_enquiry",
        section: "digital_enquiry",
      },
    });

    // Process rows
    const results: ProcessingResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because Excel rows start at 1 and we have header

      try {
        // Skip empty rows
        if (!row.Name || !row["WhatsApp Number"] || !row.Model) {
          results.push({
            success: false,
            rowNumber,
            error: "Missing required data (Name, WhatsApp Number, or Model)",
          });
          errorCount++;
          continue;
        }

        // Parse name: first word = firstName, rest = lastName
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

        // Parse date - xlsx library should convert dates automatically
        let date: Date | undefined;
        if (row.Date) {
          const dateValue = row.Date;
          if (dateValue instanceof Date) {
            date = dateValue;
          } else if (typeof dateValue === "number") {
            // Excel date serial number - convert to JavaScript date
            // Excel epoch is January 1, 1900, JavaScript epoch is January 1, 1970
            const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
            date = new Date(excelEpoch.getTime() + dateValue * 86400000);
          } else {
            // Try parsing as string
            const parsedDate = new Date(String(dateValue));
            if (!isNaN(parsedDate.getTime())) {
              date = parsedDate;
            }
          }
          // Validate the date
          if (date && isNaN(date.getTime())) {
            date = undefined;
          }
        }

        // Match model by exact name
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

        // Match lead source
        let leadSourceId: string | null = null;
        if (row.Source) {
          const sourceName = String(row.Source).trim();
          const matchedSource = allLeadSources.find(
            (s) => s.name.toLowerCase() === sourceName.toLowerCase()
          );
          leadSourceId = matchedSource?.id || null;
        }

        // Use default if no source matched
        if (!leadSourceId && defaultLeadSource) {
          leadSourceId = defaultLeadSource.id;
        }

        const whatsappNumber = String(row["WhatsApp Number"]).trim();
        const address = row.Location ? String(row.Location).trim() : undefined;

        // Check if enquiry already exists
        const existingEnquiry = await prisma.digitalEnquiry.findFirst({
          where: {
            dealershipId: user.dealershipId,
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

        // Create digital enquiry with leadScope = "cold"
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
            dealershipId: user.dealershipId,
            leadSourceId,
            interestedModelId: matchedModel.id,
            interestedVariantId: null,
          },
        });

        // Send WhatsApp message
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
          } catch (error: unknown) {
            // Don't fail the row if message sending fails
            console.error(
              `Failed to send WhatsApp message for row ${rowNumber}:`,
              error
            );
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

    return NextResponse.json({
      success: true,
      summary: {
        total: rows.length,
        success: successCount,
        errors: errorCount,
      },
      results,
    });
  } catch (error: unknown) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

