"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorService = void 0;
const visitor_repository_1 = require("../repositories/visitor.repository");
const whatsapp_1 = require("../lib/whatsapp");
const phone_formatter_1 = require("../utils/phone-formatter");
const constants_1 = require("../config/constants");
const db_1 = __importDefault(require("../lib/db"));
class VisitorService {
    constructor() {
        this.repository = new visitor_repository_1.VisitorRepository();
    }
    /**
     * Create a visitor (or update existing) and create a session
     */
    async createVisitor(data, dealershipId) {
        const normalizedPhone = (0, phone_formatter_1.normalizePhoneNumber)(data.whatsappNumber);
        // Find existing visitor by normalized phone
        let visitor = await this.repository.findByPhoneAndDealership(data.whatsappNumber, dealershipId);
        const isNewVisitor = !visitor;
        if (visitor) {
            // Update visitor info
            visitor = await this.repository.update(visitor.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || visitor.email,
                address: data.address || visitor.address,
            });
        }
        else {
            // Create new visitor
            visitor = await this.repository.createVisitor({
                firstName: data.firstName,
                lastName: data.lastName,
                whatsappNumber: data.whatsappNumber,
                email: data.email || null,
                address: data.address || null,
                whatsappContactId: null,
                dealership: {
                    connect: { id: dealershipId },
                },
                sessions: {
                    create: [],
                },
                interests: {
                    create: [],
                },
            });
        }
        if (!visitor) {
            throw new Error("Failed to create or find visitor");
        }
        const visitorId = visitor.id;
        const sessionCount = visitor.sessions.length;
        const visitNumber = sessionCount + 1;
        // Create session
        const session = await db_1.default.visitorSession.create({
            data: {
                reason: data.reason,
                visitorId: visitorId,
                status: "intake",
            },
        });
        // Create interests if provided
        if (data.modelIds && data.modelIds.length > 0) {
            await db_1.default.visitorInterest.createMany({
                data: data.modelIds.map((item) => {
                    if (typeof item === "string") {
                        return {
                            visitorId: visitorId,
                            modelId: item,
                            sessionId: session.id,
                        };
                    }
                    else {
                        return {
                            visitorId: visitorId,
                            modelId: item.modelId,
                            variantId: item.variantId || null,
                            sessionId: session.id,
                        };
                    }
                }),
            });
        }
        // Send WhatsApp message
        let messageStatus = "not_sent";
        let messageError = null;
        const name = `${data.firstName} ${data.lastName}`;
        if (isNewVisitor && sessionCount === 0) {
            // Send welcome message for new visitor
            const welcomeTemplate = await db_1.default.whatsAppTemplate.findFirst({
                where: {
                    dealershipId,
                    type: "welcome",
                },
            });
            if (welcomeTemplate) {
                try {
                    await whatsapp_1.whatsappClient.sendTemplate({
                        contactNumber: data.whatsappNumber,
                        templateName: welcomeTemplate.templateName,
                        templateId: welcomeTemplate.templateId,
                        templateLanguage: welcomeTemplate.language,
                        parameters: [name],
                    });
                    messageStatus = "sent";
                }
                catch (error) {
                    console.error("Failed to send welcome message:", error);
                    messageStatus = "failed";
                    messageError = error.message || "Failed to send welcome message";
                }
            }
        }
        else {
            // Send return visit message
            const returnVisitTemplate = await db_1.default.whatsAppTemplate.findFirst({
                where: {
                    dealershipId,
                    type: "return_visit",
                },
            });
            if (returnVisitTemplate) {
                try {
                    const visitLabel = visitNumber === 1
                        ? "1st"
                        : visitNumber === 2
                            ? "2nd"
                            : visitNumber === 3
                                ? "3rd"
                                : `${visitNumber}th`;
                    await whatsapp_1.whatsappClient.sendTemplate({
                        contactNumber: data.whatsappNumber,
                        templateName: returnVisitTemplate.templateName,
                        templateId: returnVisitTemplate.templateId,
                        templateLanguage: returnVisitTemplate.language,
                        parameters: [visitor.firstName, visitLabel],
                    });
                    messageStatus = "sent";
                }
                catch (error) {
                    console.error("Failed to send return visit message:", error);
                    messageStatus = "failed";
                    messageError = error.message || "Failed to send return visit message";
                }
            }
            else {
                // Fallback to welcome template
                const welcomeTemplate = await db_1.default.whatsAppTemplate.findFirst({
                    where: {
                        dealershipId,
                        type: "welcome",
                    },
                });
                if (welcomeTemplate) {
                    try {
                        await whatsapp_1.whatsappClient.sendTemplate({
                            contactNumber: data.whatsappNumber,
                            templateName: welcomeTemplate.templateName,
                            templateId: welcomeTemplate.templateId,
                            templateLanguage: welcomeTemplate.language,
                            parameters: [name],
                        });
                        messageStatus = "sent";
                    }
                    catch (error) {
                        console.error("Failed to send welcome message (fallback):", error);
                        messageStatus = "failed";
                        messageError = error.message || "Failed to send message";
                    }
                }
            }
        }
        return {
            success: true,
            visitor: {
                id: visitor.id,
                firstName: visitor.firstName,
                lastName: visitor.lastName,
            },
            session: {
                id: session.id,
                status: session.status,
            },
            message: {
                status: messageStatus,
                error: messageError,
            },
        };
    }
    /**
     * Get visitors with pagination and deduplication
     */
    async getVisitors(dealershipId, limit, skip) {
        const take = limit || constants_1.PAGINATION.DEFAULT_LIMIT;
        const offset = skip || constants_1.PAGINATION.DEFAULT_SKIP;
        const { visitors, total } = await this.repository.findByDealershipWithDeduplication(dealershipId, { limit: take, skip: offset });
        const hasMore = offset + take < total;
        return {
            visitors,
            hasMore,
            total,
            skip: offset,
            limit: take,
        };
    }
    /**
     * Lookup visitor by phone number
     */
    async lookupByPhone(phoneNumber, dealershipId) {
        const visitor = await this.repository.findByPhoneAndDealership(phoneNumber, dealershipId);
        if (!visitor) {
            return { visitor: null, found: false };
        }
        return {
            visitor: {
                id: visitor.id,
                firstName: visitor.firstName,
                lastName: visitor.lastName,
                whatsappNumber: visitor.whatsappNumber,
                email: visitor.email,
                address: visitor.address,
                sessionCount: visitor.sessions.length,
                interests: visitor.interests.map((i) => ({
                    modelId: i.model.id,
                    modelName: i.model.name,
                    categoryName: i.model.category.name,
                })),
            },
            found: true,
        };
    }
    /**
     * Create session for existing visitor
     */
    async createSession(data, dealershipId) {
        const visitor = await this.repository.findByIdAndDealership(data.visitorId, dealershipId);
        if (!visitor) {
            throw new Error("Visitor not found");
        }
        const sessionCount = visitor.sessions.length;
        const visitNumber = sessionCount + 1;
        // Create session
        const session = await db_1.default.visitorSession.create({
            data: {
                reason: data.reason,
                visitorId: visitor.id,
                status: "intake",
            },
        });
        // Handle model interests
        if (data.modelIds && data.modelIds.length > 0) {
            const existingInterests = await db_1.default.visitorInterest.findMany({
                where: {
                    visitorId: visitor.id,
                },
                select: {
                    modelId: true,
                    variantId: true,
                },
            });
            const existingInterestsSet = new Set(existingInterests.map((ei) => `${ei.modelId}:${ei.variantId || ""}`));
            const interestsToCreate = data.modelIds
                .map((item) => {
                const modelId = typeof item === "string" ? item : item.modelId;
                const variantId = typeof item === "object" ? item.variantId : undefined;
                const key = `${modelId}:${variantId || ""}`;
                if (!existingInterestsSet.has(key)) {
                    return {
                        visitorId: visitor.id,
                        modelId,
                        variantId: variantId || null,
                        sessionId: session.id,
                    };
                }
                return null;
            })
                .filter((item) => item !== null);
            if (interestsToCreate.length > 0) {
                await db_1.default.visitorInterest.createMany({
                    data: interestsToCreate,
                });
            }
            // Update existing interests to link to this session
            const selectedItems = data.modelIds.filter((item) => {
                const modelId = typeof item === "string" ? item : item.modelId;
                const variantId = typeof item === "object" ? item.variantId : undefined;
                const key = `${modelId}:${variantId || ""}`;
                return existingInterestsSet.has(key);
            });
            if (selectedItems.length > 0) {
                for (const item of selectedItems) {
                    const modelId = typeof item === "string" ? item : item.modelId;
                    const variantId = typeof item === "object" ? item.variantId : undefined;
                    await db_1.default.visitorInterest.updateMany({
                        where: {
                            visitorId: visitor.id,
                            modelId,
                            variantId: variantId || null,
                            sessionId: null,
                        },
                        data: {
                            sessionId: session.id,
                        },
                    });
                }
            }
        }
        // Send WhatsApp message
        const returnVisitTemplate = await db_1.default.whatsAppTemplate.findFirst({
            where: {
                dealershipId,
                type: "return_visit",
            },
        });
        const welcomeTemplate = await db_1.default.whatsAppTemplate.findFirst({
            where: {
                dealershipId,
                type: "welcome",
            },
        });
        const templateToUse = returnVisitTemplate || welcomeTemplate;
        let messageStatus = "not_sent";
        let messageError = null;
        if (templateToUse) {
            try {
                const visitLabel = visitNumber === 1
                    ? "1st"
                    : visitNumber === 2
                        ? "2nd"
                        : visitNumber === 3
                            ? "3rd"
                            : `${visitNumber}th`;
                const parameters = templateToUse.type === "return_visit"
                    ? [visitor.firstName, visitLabel]
                    : [visitor.firstName, new Date().toLocaleDateString()];
                await whatsapp_1.whatsappClient.sendTemplate({
                    contactNumber: visitor.whatsappNumber,
                    templateName: templateToUse.templateName,
                    templateId: templateToUse.templateId,
                    templateLanguage: templateToUse.language,
                    parameters,
                });
                messageStatus = "sent";
            }
            catch (error) {
                console.error("Failed to send return visit message:", error);
                messageStatus = "failed";
                messageError = error.message || "Failed to send message";
            }
        }
        return {
            success: true,
            session: {
                id: session.id,
                status: session.status,
                visitNumber,
            },
            visitor: {
                id: visitor.id,
                firstName: visitor.firstName,
                lastName: visitor.lastName,
            },
            message: {
                status: messageStatus,
                error: messageError,
            },
        };
    }
}
exports.VisitorService = VisitorService;
//# sourceMappingURL=visitor.service.js.map