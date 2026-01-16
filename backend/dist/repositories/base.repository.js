"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const db_1 = __importDefault(require("../lib/db"));
/**
 * Base repository class providing common database operations
 */
class BaseRepository {
    constructor() {
        this.prisma = db_1.default;
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
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map