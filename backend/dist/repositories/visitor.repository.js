"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorRepository = void 0;
const base_repository_1 = require("./base.repository");
const phone_formatter_1 = require("../utils/phone-formatter");
class VisitorRepository extends base_repository_1.BaseRepository {
    /**
     * Find visitor by ID and dealership
     */
    async findByIdAndDealership(id, dealershipId) {
        return this.findOne(this.prisma.visitor, {
            id,
            dealershipId,
        }, {
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                },
                interests: {
                    include: {
                        model: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });
    }
    /**
     * Find visitor by normalized phone number and dealership
     */
    async findByPhoneAndDealership(phoneNumber, dealershipId) {
        const normalizedPhone = (0, phone_formatter_1.normalizePhoneNumber)(phoneNumber);
        const allVisitors = await this.findMany(this.prisma.visitor, { dealershipId }, {
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                },
                interests: {
                    include: {
                        model: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });
        return (allVisitors.find((v) => (0, phone_formatter_1.normalizePhoneNumber)(v.whatsappNumber) === normalizedPhone) || null);
    }
    /**
     * Find all visitors for a dealership with deduplication
     */
    async findByDealershipWithDeduplication(dealershipId, options) {
        const allVisitors = await this.findMany(this.prisma.visitor, { dealershipId }, {
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                },
                interests: {
                    include: {
                        model: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        // Deduplicate by phone number
        const visitorMap = new Map();
        for (const visitor of allVisitors) {
            const normalizedPhone = (0, phone_formatter_1.normalizePhoneNumber)(visitor.whatsappNumber);
            const existing = visitorMap.get(normalizedPhone);
            if (!existing) {
                visitorMap.set(normalizedPhone, visitor);
            }
            else {
                const existingSessionCount = existing.sessions.length;
                const currentSessionCount = visitor.sessions.length;
                if (currentSessionCount > existingSessionCount ||
                    (currentSessionCount === existingSessionCount &&
                        new Date(visitor.createdAt) > new Date(existing.createdAt))) {
                    const mergedSessions = [
                        ...existing.sessions,
                        ...visitor.sessions,
                    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    visitorMap.set(normalizedPhone, {
                        ...visitor,
                        sessions: mergedSessions,
                    });
                }
                else {
                    const mergedSessions = [
                        ...existing.sessions,
                        ...visitor.sessions,
                    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    visitorMap.set(normalizedPhone, {
                        ...existing,
                        sessions: mergedSessions,
                    });
                }
            }
        }
        const uniqueVisitors = Array.from(visitorMap.values()).sort((a, b) => {
            const aLatest = a.sessions.length > 0
                ? new Date(a.sessions[0].createdAt).getTime()
                : new Date(a.createdAt).getTime();
            const bLatest = b.sessions.length > 0
                ? new Date(b.sessions[0].createdAt).getTime()
                : new Date(b.createdAt).getTime();
            return bLatest - aLatest;
        });
        const take = options?.limit || 30;
        const offset = options?.skip || 0;
        const paginatedVisitors = uniqueVisitors.slice(offset, offset + take);
        return {
            visitors: paginatedVisitors,
            total: uniqueVisitors.length,
        };
    }
    /**
     * Create a visitor
     */
    async createVisitor(data) {
        return this.create(this.prisma.visitor, data);
    }
    /**
     * Update a visitor
     */
    async update(id, data) {
        return super.update(this.prisma.visitor, { id }, data, {
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                },
                interests: {
                    include: {
                        model: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
exports.VisitorRepository = VisitorRepository;
//# sourceMappingURL=visitor.repository.js.map