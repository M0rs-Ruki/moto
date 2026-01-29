import { BaseApiService } from "./base.service";
import type { Model, ModelCreateDto, Variant, Category } from "@/types";

/**
 * Service for managing model and variant operations
 */
export class ModelService extends BaseApiService {
  /**
   * Get all models with their variants
   * @returns Promise resolving to array of models
   */
  async getModels(): Promise<Model[]> {
    return this.get("/api/models");
  }

  /**
   * Get a single model by ID
   * @param id - Model ID
   * @returns Promise resolving to model data
   */
  async getModel(id: number): Promise<Model> {
    return this.get(`/api/models/${id}`);
  }

  /**
   * Get variants for a specific model
   * @param modelId - Model ID
   * @returns Promise resolving to array of variants
   */
  async getVariants(modelId: number): Promise<Variant[]> {
    return this.get(`/api/models/${modelId}/variants`);
  }

  /**
   * Get all categories
   * @returns Promise resolving to array of categories
   */
  async getCategories(): Promise<Category[]> {
    return this.get("/api/categories");
  }
}

export const modelService = new ModelService();
