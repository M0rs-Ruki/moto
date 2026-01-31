import { PrismaClient, Prisma } from "@prisma/client";
import prisma from "../lib/db";
import { TenantContext } from "../lib/auth";

// ============================================================
// MULTI-TENANT BASE REPOSITORY
// ============================================================
// All repositories should extend this class to ensure proper
// tenant isolation. The buildTenantFilter method automatically
// adds dealership filters based on user context.
// ============================================================

export interface TenantFilterOptions {
  /** Field name for dealership ID (default: "dealershipId") */
  dealershipField?: string;
}

/**
 * Base repository class providing common database operations
 * with multi-tenant isolation support
 */
export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Build tenant filter for Prisma WHERE clause
   * Uses dealershipId for data isolation
   *
   * @param tenant - Tenant context from request
   * @param options - Filter options
   * @returns Partial WHERE clause for tenant isolation
   */
  protected buildTenantFilter(
    tenant: TenantContext | undefined,
    options: TenantFilterOptions = {},
  ): Record<string, string | undefined> {
    if (!tenant) {
      throw new Error("Tenant context required for data access");
    }

    const { dealershipField = "dealershipId" } = options;

    // Use dealershipId for data isolation
    if (tenant.dealershipId) {
      return { [dealershipField]: tenant.dealershipId };
    }

    throw new Error("No tenant scope available");
  }

  /**
   * Merge tenant filter with additional WHERE conditions
   */
  protected withTenantFilter(
    tenant: TenantContext | undefined,
    where: Record<string, any> = {},
    options: TenantFilterOptions = {},
  ): Record<string, any> {
    const tenantFilter = this.buildTenantFilter(tenant, options);
    return { ...where, ...tenantFilter };
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
    },
  ): Promise<T[]> {
    return model.findMany({
      where,
      ...options,
    });
  }

  /**
   * Find many records with tenant isolation
   */
  protected async findManyWithTenant(
    model: any,
    tenant: TenantContext,
    where: Record<string, any> = {},
    options?: {
      include?: Prisma.Args<any, "findMany">["include"];
      orderBy?: Prisma.Args<any, "findMany">["orderBy"];
      take?: number;
      skip?: number;
      tenantOptions?: TenantFilterOptions;
    },
  ): Promise<T[]> {
    const tenantWhere = this.withTenantFilter(
      tenant,
      where,
      options?.tenantOptions,
    );
    return this.findMany(model, tenantWhere, options);
  }

  /**
   * Find a single record
   */
  protected async findOne(
    model: any,
    where: Prisma.Args<any, "findFirst">["where"],
    options?: {
      include?: Prisma.Args<any, "findFirst">["include"];
    },
  ): Promise<T | null> {
    return model.findFirst({
      where,
      ...options,
    });
  }

  /**
   * Find a single record with tenant isolation
   */
  protected async findOneWithTenant(
    model: any,
    tenant: TenantContext,
    where: Record<string, any> = {},
    options?: {
      include?: Prisma.Args<any, "findFirst">["include"];
      tenantOptions?: TenantFilterOptions;
    },
  ): Promise<T | null> {
    const tenantWhere = this.withTenantFilter(
      tenant,
      where,
      options?.tenantOptions,
    );
    return this.findOne(model, tenantWhere, options);
  }

  /**
   * Count records
   */
  protected async count(
    model: any,
    where: Prisma.Args<any, "count">["where"],
  ): Promise<number> {
    return model.count({
      where,
    });
  }

  /**
   * Count records with tenant isolation
   */
  protected async countWithTenant(
    model: any,
    tenant: TenantContext,
    where: Record<string, any> = {},
    options?: TenantFilterOptions,
  ): Promise<number> {
    const tenantWhere = this.withTenantFilter(tenant, where, options);
    return this.count(model, tenantWhere);
  }

  /**
   * Create a record
   */
  protected async create(
    model: any,
    data: Prisma.Args<any, "create">["data"],
    options?: {
      include?: Prisma.Args<any, "create">["include"];
    },
  ): Promise<T> {
    return model.create({
      data,
      ...options,
    });
  }

  /**
   * Create a record with tenant context automatically added
   */
  protected async createWithTenant(
    model: any,
    tenant: TenantContext,
    data: Record<string, any>,
    options?: {
      include?: Prisma.Args<any, "create">["include"];
      tenantOptions?: TenantFilterOptions;
    },
  ): Promise<T> {
    const { dealershipField = "dealershipId" } = options?.tenantOptions || {};

    // Add tenant context to the data
    const tenantData = { ...data };

    if (tenant.dealershipId) {
      tenantData[dealershipField] = tenant.dealershipId;
    }

    return this.create(model, tenantData, options);
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
    },
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
    where: Prisma.Args<any, "delete">["where"],
  ): Promise<T> {
    return model.delete({
      where,
    });
  }
}
