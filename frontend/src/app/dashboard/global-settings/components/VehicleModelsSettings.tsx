"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { getCachedData, setCachedData } from "@/lib/cache";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { usePermissions } from "@/contexts/permissions";

interface VehicleVariant {
  id: string;
  name: string;
}

interface VehicleModel {
  id: string;
  name: string;
  year: number | null;
  variants: VehicleVariant[];
}

interface VehicleCategory {
  id: string;
  name: string;
  models: VehicleModel[];
}

export default function VehicleModelsSettings() {
  const { hasPermission } = usePermissions();
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  const [newCategory, setNewCategory] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    categoryId: "",
    name: "",
    year: "",
  });
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] =
    useState(false);
  const [deleteModelDialogOpen, setDeleteModelDialogOpen] = useState(false);
  const [deleteVariantDialogOpen, setDeleteVariantDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [modelToDelete, setModelToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<{
    id: string;
    name: string;
    modelName: string;
  } | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [newVariant, setNewVariant] = useState({
    modelId: "",
    name: "",
  });

  useEffect(() => {
    mountedRef.current = true;
    const cachedCategories = getCachedData<any[]>(
      "cache_settings_categories",
      300000,
    ); // 5 minutes
    if (cachedCategories) {
      setCategories(cachedCategories);
      setLoading(false);

      // Check cache age - refresh in background if stale
      try {
        const cacheEntry = JSON.parse(
          sessionStorage.getItem("cache_settings_categories") || "{}",
        );
        const cacheAge = Date.now() - (cacheEntry.timestamp || 0);
        if (cacheAge > 30000 && mountedRef.current && !fetchingRef.current) {
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              fetchData();
            }
          }, 500);
        }
      } catch {
        // If cache parsing fails, fetch normally
        fetchData();
      }
    } else {
      fetchData();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      setLoading(true);
      const response = await apiClient.get("/categories");
      const categoriesData = response.data?.categories || [];
      setCategories(categoriesData);
      setCachedData("cache_settings_categories", categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission("settingsVehicleModels")) {
      toast.error("You don't have permission to create categories");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/categories", { name: newCategory });
      setNewCategory("");
      setCategoryDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission("settingsVehicleModels")) {
      toast.error("You don't have permission to create models");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/models", newModel);
      setNewModel({ categoryId: "", name: "", year: "" });
      setModelDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create model:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete || !hasPermission("settingsVehicleModels")) return;
    setSaving(true);
    try {
      await apiClient.delete("/categories", { data: { id: categoryToDelete } });
      setDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModel = async () => {
    if (!modelToDelete || !hasPermission("settingsVehicleModels")) return;
    setSaving(true);
    try {
      await apiClient.delete("/models", { data: { id: modelToDelete.id } });
      setDeleteModelDialogOpen(false);
      setModelToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete model:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission("settingsVehicleModels")) {
      toast.error("You don't have permission to create variants");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/variants", newVariant);
      setNewVariant({ modelId: "", name: "" });
      setVariantDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create variant:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!variantToDelete || !hasPermission("settingsVehicleModels")) return;
    setSaving(true);
    try {
      await apiClient.delete("/variants", { data: { id: variantToDelete.id } });
      setDeleteVariantDialogOpen(false);
      setVariantToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete variant:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!hasPermission("settingsVehicleModels")) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm sm:text-base">
              You don't have permission to access this section.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="w-full">
              <CardTitle className="text-lg sm:text-xl">
                Categories & Models
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage vehicle categories and models for your dealership
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Dialog
                open={categoryDialogOpen}
                onOpenChange={setCategoryDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Add Category</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Create a new vehicle category (e.g., Sedan, SUV, Coupe)
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleCreateCategory}
                    className="space-y-4 mt-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="category-name" className="text-sm">
                        Category Name
                      </Label>
                      <Input
                        id="category-name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g., SUV"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCategoryDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add Model
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Add Model</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Add a new vehicle model to a category
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateModel} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="model-category" className="text-sm">
                        Category
                      </Label>
                      <select
                        id="model-category"
                        className="w-full p-2 border rounded text-sm"
                        value={newModel.categoryId}
                        onChange={(e) =>
                          setNewModel({
                            ...newModel,
                            categoryId: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model-name" className="text-sm">
                        Model Name
                      </Label>
                      <Input
                        id="model-name"
                        value={newModel.name}
                        onChange={(e) =>
                          setNewModel({ ...newModel, name: e.target.value })
                        }
                        placeholder="e.g., Swift"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model-year" className="text-sm">
                        Year (optional)
                      </Label>
                      <Input
                        id="model-year"
                        type="number"
                        value={newModel.year}
                        onChange={(e) =>
                          setNewModel({ ...newModel, year: e.target.value })
                        }
                        placeholder="e.g., 2024"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setModelDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog
                open={variantDialogOpen}
                onOpenChange={setVariantDialogOpen}
              >
                <DialogContent className="max-w-md p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Add Variant</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Add a variant to a vehicle model (e.g., "xl", "s", "base")
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleCreateVariant}
                    className="space-y-4 mt-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="variant-model" className="text-sm">
                        Model
                      </Label>
                      <select
                        id="variant-model"
                        className="w-full p-2 border rounded text-sm"
                        value={newVariant.modelId}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            modelId: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select model</option>
                        {categories.map((cat) =>
                          cat.models.map((model) => (
                            <option key={model.id} value={model.id}>
                              {cat.name} - {model.name}
                              {model.year ? ` (${model.year})` : ""}
                            </option>
                          )),
                        )}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-name" className="text-sm">
                        Variant Name
                      </Label>
                      <Input
                        id="variant-name"
                        value={newVariant.name}
                        onChange={(e) =>
                          setNewVariant({ ...newVariant, name: e.target.value })
                        }
                        placeholder="e.g., xl, s, base"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVariantDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
              No categories yet. Click "Add Category" to get started.
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {categories.map((category) => {
                const isOpen = openCategories.has(category.id);
                return (
                  <Collapsible
                    key={category.id}
                    open={isOpen}
                    onOpenChange={(open) => {
                      setOpenCategories((prev) => {
                        const newSet = new Set(prev);
                        if (open) {
                          newSet.add(category.id);
                        } else {
                          newSet.delete(category.id);
                        }
                        return newSet;
                      });
                    }}
                  >
                    <div className="border rounded-lg p-3 sm:p-4">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between mb-2 cursor-pointer hover:bg-muted/50 -m-3 sm:-m-4 p-3 sm:p-4 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isOpen ? "transform rotate-180" : ""
                              }`}
                            />
                            <h3 className="font-semibold text-sm sm:text-base">
                              {category.name}
                            </h3>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryToDelete(category.id);
                              setDeleteCategoryDialogOpen(true);
                            }}
                            className="text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {category.models.length === 0 ? (
                          <p className="text-xs sm:text-sm text-muted-foreground pl-4">
                            No models in this category
                          </p>
                        ) : (
                          <div className="space-y-3 pl-4">
                            {category.models.map((model) => (
                              <div
                                key={model.id}
                                className="border rounded-lg p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-sm">
                                      {model.name}
                                    </div>
                                    {model.year && (
                                      <div className="text-muted-foreground text-xs">
                                        ({model.year})
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setNewVariant({
                                          modelId: model.id,
                                          name: "",
                                        });
                                        setVariantDialogOpen(true);
                                      }}
                                      className="text-xs"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Variant
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setModelToDelete({
                                          id: model.id,
                                          name: model.name,
                                        });
                                        setDeleteModelDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                {model.variants &&
                                  model.variants.length > 0 && (
                                    <div className="pl-4 border-l-2 space-y-1">
                                      <div className="text-xs text-muted-foreground mb-1">
                                        Variants:
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {model.variants.map((variant) => (
                                          <div
                                            key={variant.id}
                                            className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs group/variant"
                                          >
                                            <span>
                                              {model.name}.{variant.name}
                                            </span>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-4 w-4 p-0 opacity-0 group-hover/variant:opacity-100 transition-opacity"
                                              onClick={() => {
                                                setVariantToDelete({
                                                  id: variant.id,
                                                  name: variant.name,
                                                  modelName: model.name,
                                                });
                                                setDeleteVariantDialogOpen(
                                                  true,
                                                );
                                              }}
                                            >
                                              <Trash2 className="h-2.5 w-2.5 text-destructive" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteCategoryDialogOpen}
        onOpenChange={setDeleteCategoryDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will also
              delete all models in this category and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteCategoryDialogOpen(false);
                setCategoryToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteModelDialogOpen}
        onOpenChange={setDeleteModelDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the model "{modelToDelete?.name}"?
              This will also delete all related visitor interests and test
              drives, and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteModelDialogOpen(false);
                setModelToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteModel}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteVariantDialogOpen}
        onOpenChange={setDeleteVariantDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Variant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the variant "
              {variantToDelete?.modelName}.{variantToDelete?.name}"? This will
              also delete all related visitor interests and test drives, and
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteVariantDialogOpen(false);
                setVariantToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteVariant}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
