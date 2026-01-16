import { PrismaClient, Prisma } from "@prisma/client";
/**
 * Base repository class providing common database operations
 */
export declare abstract class BaseRepository<T> {
    protected prisma: PrismaClient;
    constructor();
    /**
     * Find many records with pagination
     */
    protected findMany(model: any, where: Prisma.Args<any, "findMany">["where"], options?: {
        include?: Prisma.Args<any, "findMany">["include"];
        orderBy?: Prisma.Args<any, "findMany">["orderBy"];
        take?: number;
        skip?: number;
    }): Promise<T[]>;
    /**
     * Find a single record
     */
    protected findOne(model: any, where: Prisma.Args<any, "findFirst">["where"], options?: {
        include?: Prisma.Args<any, "findFirst">["include"];
    }): Promise<T | null>;
    /**
     * Count records
     */
    protected count(model: any, where: Prisma.Args<any, "count">["where"]): Promise<number>;
    /**
     * Create a record
     */
    protected create(model: any, data: Prisma.Args<any, "create">["data"]): Promise<T>;
    /**
     * Update a record
     */
    protected update(model: any, where: Prisma.Args<any, "update">["where"], data: Prisma.Args<any, "update">["data"], options?: {
        include?: Prisma.Args<any, "update">["include"];
    }): Promise<T>;
    /**
     * Delete a record
     */
    protected delete(model: any, where: Prisma.Args<any, "delete">["where"]): Promise<T>;
}
//# sourceMappingURL=base.repository.d.ts.map