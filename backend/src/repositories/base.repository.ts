import { PrismaClient, Prisma } from "@prisma/client";
import prisma from "../lib/db";

/**
 * Base repository class providing common database operations
 */
export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Find many records with pagination
   */
  protected async findMany(
    model: any,
    where: Prisma.Args<any, "findMany">["where"],
    options?: {
      include?: Prisma.Args<any, "findMany">["include"];
      orderBy?: Prisma.Args<any, "findMany">["orderBy"];
      take?: number;
      skip?: number;
    }
  ): Promise<T[]> {
    return model.findMany({
      where,
      ...options,
    });
  }

  /**
   * Find a single record
   */
  protected async findOne(
    model: any,
    where: Prisma.Args<any, "findFirst">["where"],
    options?: {
      include?: Prisma.Args<any, "findFirst">["include"];
    }
  ): Promise<T | null> {
    return model.findFirst({
      where,
      ...options,
    });
  }

  /**
   * Count records
   */
  protected async count(
    model: any,
    where: Prisma.Args<any, "count">["where"]
  ): Promise<number> {
    return model.count({
      where,
    });
  }

  /**
   * Create a record
   */
  protected async create(
    model: any,
    data: Prisma.Args<any, "create">["data"]
  ): Promise<T> {
    return model.create({
      data,
    });
  }

  /**
   * Update a record
   */
  protected async update(
    model: any,
    where: Prisma.Args<any, "update">["where"],
    data: Prisma.Args<any, "update">["data"],
    options?: {
      include?: Prisma.Args<any, "update">["include"];
    }
  ): Promise<T> {
    return model.update({
      where,
      data,
      ...options,
    });
  }

  /**
   * Delete a record
   */
  protected async delete(
    model: any,
    where: Prisma.Args<any, "delete">["where"]
  ): Promise<T> {
    return model.delete({
      where,
    });
  }
}
