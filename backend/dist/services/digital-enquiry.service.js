import { DigitalEnquiryRepository } from "../repositories/digital-enquiry.repository";
import { whatsappClient } from "../lib/whatsapp";
import { validateRequiredColumns, parseExcelDate } from "../utils/excel-parser";
import { EXCEL, LEAD_SCOPE, PAGINATION } from "../config/constants";
import prisma from "../lib/db";
export class DigitalEnquiryService {
    constructor() {
        this.repository = new DigitalEnquiryRepository();
    }
    /**
     * Create a digital enquiry
     */
    async createEnquiry(data, dealershipId) {
        // Check if enquiry already exists
        const existingEnquiry = await this.repository.findByWhatsAppNumberAndDealership(data.whatsappNumber, dealershipId);
        // Create digital enquiry
        const enquiry = await this.repository.createEnquiry({
            firstName: data.firstName,
            lastName: data.lastName,
            whatsappNumber: data.whatsappNumber,
            email: data.email || null,
            address: data.address || null,
            reason: data.reason,
            leadScope: data.leadScope || LEAD_SCOPE.WARM,
            whatsappContactId: null,
            dealership: {
                connect: { id: dealershipId },
            },
            leadSource: data.leadSourceId
                ? { connect: { id: data.leadSourceId } }
                : undefined,
            model: data.interestedModelId
                ? { connect: { id: data.interestedModelId } }
                : undefined,
            variant: data.interestedVariantId
                ? { connect: { id: data.interestedVariantId } }
                : undefined,
        });
        // Get WhatsApp template
        const template = await prisma.whatsAppTemplate.findFirst({
            where: {
                dealershipId,
                type: "digital_enquiry",
                section: "digital_enquiry",
            },
        });
        let messageStatus = "not_sent";
        let messageError = null;
        if (template && template.templateId && template.templateName) {
            try {
                await whatsappClient.sendTemplate({
                    contactNumber: data.whatsappNumber,
                    templateName: template.templateName,
                    templateId: template.templateId,
                    templateLanguage: template.language,
                    parameters: [],
                });
                messageStatus = "sent";
            }
            catch (error) {
                console.error("Failed to send digital enquiry message:", error);
                messageStatus = "failed";
                messageError =
                    error.message || "Failed to send digital enquiry message";
            }
        }
        else if (template && (!template.templateId || !template.templateName)) {
            messageStatus = "not_configured";
            messageError = "Template ID or Template Name not configured";
        }
        return {
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
        };
    }
    /**
     * Get digital enquiries with pagination
     */
    async getEnquiries(dealershipId, limit, skip) {
        const take = limit || PAGINATION.DEFAULT_LIMIT;
        const offset = skip || PAGINATION.DEFAULT_SKIP;
        const [enquiries, total] = await Promise.all([
            this.repository.findByDealership(dealershipId, {
                limit: take,
                skip: offset,
            }),
            this.repository.countByDealership(dealershipId),
        ]);
        const hasMore = offset + take < total;
        return {
            enquiries,
            hasMore,
            total,
            skip: offset,
            limit: take,
        };
    }
    /**
     * Update lead scope
     */
    async updateLeadScope(id, data, dealershipId) {
        // Verify enquiry exists and belongs to dealership
        const enquiry = await this.repository.findByIdAndDealership(id, dealershipId);
        if (!enquiry) {
            throw new Error("Enquiry not found");
        }
        // Validate lead scope
        if (!Object.values(LEAD_SCOPE).includes(data.leadScope)) {
            throw new Error("Invalid leadScope. Must be 'hot', 'warm', or 'cold'");
        }
        const updatedEnquiry = await this.repository.update(id, {
            leadScope: data.leadScope,
        });
        return {
            success: true,
            enquiry: updatedEnquiry,
        };
    }
    /**
     * Bulk upload digital enquiries from JSON data
     */
    async bulkUpload(data, dealershipId) {
        const rows = data.rows;
        if (!rows || rows.length === 0) {
            throw new Error("No data provided");
        }
        // Validate required columns
        const firstRow = rows[0];
        const columnValidation = validateRequiredColumns(firstRow, Array.from(EXCEL.REQUIRED_COLUMNS.DIGITAL_ENQUIRY));
        if (!columnValidation.valid) {
            throw new Error(`Missing required columns: ${columnValidation.missingColumns.join(", ")}`);
        }
        // Get default lead source and models
        const [defaultLeadSource, allModels, allLeadSources, template] = await Promise.all([
            prisma.leadSource.findFirst({
                where: {
                    dealershipId,
                    isDefault: true,
                },
            }),
            prisma.vehicleModel.findMany({
                where: {
                    category: {
                        dealershipId,
                    },
                },
                include: {
                    category: true,
                },
            }),
            prisma.leadSource.findMany({
                where: {
                    dealershipId,
                },
            }),
            prisma.whatsAppTemplate.findFirst({
                where: {
                    dealershipId,
                    type: "digital_enquiry",
                    section: "digital_enquiry",
                },
            }),
        ]);
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        // Process each row
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // +2 because Excel rows start at 1 and we have header
            try {
                // Validate required fields
                if (!row.Name || !row["WhatsApp Number"] || !row.Model) {
                    results.push({
                        success: false,
                        rowNumber,
                        error: "Missing required data (Name, WhatsApp Number, or Model)",
                    });
                    errorCount++;
                    continue;
                }
                // Parse name
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
                // Parse date
                const date = parseExcelDate(row.Date);
                // Match model (optional - no error if not found)
                const modelName = String(row.Model).trim();
                const matchedModel = allModels.find((m) => m.name.toLowerCase() === modelName.toLowerCase());
                // Match lead source
                let leadSourceId = null;
                if (row.Source) {
                    const sourceName = String(row.Source).trim();
                    const matchedSource = allLeadSources.find((s) => s.name.toLowerCase() === sourceName.toLowerCase());
                    leadSourceId = matchedSource?.id || null;
                }
                if (!leadSourceId && defaultLeadSource) {
                    leadSourceId = defaultLeadSource.id;
                }
                const whatsappNumber = String(row["WhatsApp Number"]).trim();
                const address = row.Location ? String(row.Location).trim() : undefined;
                // Check if enquiry already exists
                const existingEnquiry = await this.repository.findByWhatsAppNumberAndDealership(whatsappNumber, dealershipId);
                // Create digital enquiry
                const enquiry = await this.repository.createEnquiry({
                    firstName,
                    lastName,
                    whatsappNumber,
                    email: null,
                    address: address || null,
                    reason: date
                        ? `Enquiry from ${date.toLocaleDateString()}`
                        : "Bulk imported enquiry",
                    leadScope: LEAD_SCOPE.COLD,
                    whatsappContactId: null,
                    dealership: {
                        connect: { id: dealershipId },
                    },
                    leadSource: leadSourceId
                        ? { connect: { id: leadSourceId } }
                        : undefined,
                    model: matchedModel
                        ? { connect: { id: matchedModel.id } }
                        : undefined,
                    variant: undefined,
                });
                // Send WhatsApp message if template is configured
                if (template && template.templateId && template.templateName) {
                    try {
                        await whatsappClient.sendTemplate({
                            contactNumber: whatsappNumber,
                            templateName: template.templateName,
                            templateId: template.templateId,
                            templateLanguage: template.language,
                            parameters: [],
                        });
                    }
                    catch (error) {
                        console.error(`Failed to send WhatsApp message for row ${rowNumber}:`, error);
                        // Don't fail the row if message sending fails
                    }
                }
                results.push({
                    success: true,
                    rowNumber,
                    enquiryId: enquiry.id,
                });
                successCount++;
            }
            catch (error) {
                results.push({
                    success: false,
                    rowNumber,
                    error: error.message || "Unknown error",
                });
                errorCount++;
            }
        }
        return {
            success: true,
            summary: {
                total: rows.length,
                success: successCount,
                errors: errorCount,
            },
            results,
        };
    }
}
//# sourceMappingURL=digital-enquiry.service.js.map