"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalEnquiryService = void 0;
const digital_enquiry_repository_1 = require("../repositories/digital-enquiry.repository");
const whatsapp_1 = require("../lib/whatsapp");
const excel_parser_1 = require("../utils/excel-parser");
const constants_1 = require("../config/constants");
const db_1 = __importDefault(require("../lib/db"));
class DigitalEnquiryService {
    constructor() {
        this.repository = new digital_enquiry_repository_1.DigitalEnquiryRepository();
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
            leadScope: data.leadScope || constants_1.LEAD_SCOPE.WARM,
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
        const template = await db_1.default.whatsAppTemplate.findFirst({
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
                await whatsapp_1.whatsappClient.sendTemplate({
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
        const take = limit || constants_1.PAGINATION.DEFAULT_LIMIT;
        const offset = skip || constants_1.PAGINATION.DEFAULT_SKIP;
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
        if (!Object.values(constants_1.LEAD_SCOPE).includes(data.leadScope)) {
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
        const columnValidation = (0, excel_parser_1.validateRequiredColumns)(firstRow, Array.from(constants_1.EXCEL.REQUIRED_COLUMNS.DIGITAL_ENQUIRY));
        if (!columnValidation.valid) {
            throw new Error(`Missing required columns: ${columnValidation.missingColumns.join(", ")}`);
        }
        // Get default lead source and models
        const [defaultLeadSource, allModels, allLeadSources, template] = await Promise.all([
            db_1.default.leadSource.findFirst({
                where: {
                    dealershipId,
                    isDefault: true,
                },
            }),
            db_1.default.vehicleModel.findMany({
                where: {
                    category: {
                        dealershipId,
                    },
                },
                include: {
                    category: true,
                },
            }),
            db_1.default.leadSource.findMany({
                where: {
                    dealershipId,
                },
            }),
            db_1.default.whatsAppTemplate.findFirst({
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
                const date = (0, excel_parser_1.parseExcelDate)(row.Date);
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
                    leadScope: constants_1.LEAD_SCOPE.COLD,
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
                        await whatsapp_1.whatsappClient.sendTemplate({
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
exports.DigitalEnquiryService = DigitalEnquiryService;
//# sourceMappingURL=digital-enquiry.service.js.map