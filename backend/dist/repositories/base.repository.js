import prisma from "../lib/db";
/**
 * Base repository class providing common database operations
 */
export class BaseRepository {
    constructor() {
        this.prisma = prisma;
    }
    /**
     * Find many records with pagination
     */
    async findMany(model, where, options) {
        return model.findMany({
            where,
            ...options,
        });
    }
    /**
     * Find a single record
     */
    async findOne(model, where, options) {
        return model.findFirst({
            where,
            ...options,
        });
    }
    /**
     * Count records
     */
    async count(model, where) {
        return model.count({
            where,
        });
    }
    /**
     * Create a record
     */
    async create(model, data) {
        return model.create({
            data,
        });
    }
    /**
     * Update a record
     */
    async update(model, where, data, options) {
        return model.update({
            where,
            data,
            ...options,
        });
    }
    /**
     * Delete a record
     */
    async delete(model, where) {
        return model.delete({
            where,
        });
    }
}
//# sourceMappingURL=base.repository.js.map