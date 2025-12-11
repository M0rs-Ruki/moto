"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Loader2, Plus, Save, Trash2, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import SettingsLoading from "./loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface WhatsAppTemplate {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  language: string;
  type: string;
}

export default function SettingsPage() {
  const {
    theme,
    primaryColor,
    secondaryColor,
    tertiaryColor,
    setTheme,
    setPrimaryColor,
    setSecondaryColor,
    setTertiaryColor,
  } = useTheme();
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Category form
  const [newCategory, setNewCategory] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // Model form
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    categoryId: "",
    name: "",
    year: "",
  });

  // Delete confirmation dialogs
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

  // Collapsible state - all categories closed by default
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  // Variant form
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [newVariant, setNewVariant] = useState({
    modelId: "",
    name: "",
  });

  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: theme,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    tertiaryColor: tertiaryColor,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setThemeSettings({
      theme,
      primaryColor,
      secondaryColor,
      tertiaryColor,
    });
  }, [theme, primaryColor, secondaryColor, tertiaryColor]);

  const fetchData = async () => {
    try {
      const [categoriesRes, templatesRes] = await Promise.all([
        axios.get("/api/categories"),
        axios.get("/api/templates"),
      ]);
      setCategories(categoriesRes.data.categories);
      setTemplates(templatesRes.data.templates);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/categories", { name: newCategory });
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
    setSaving(true);
    try {
      await axios.post("/api/models", newModel);
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
    if (!categoryToDelete) return;
    setSaving(true);
    try {
      await axios.delete("/api/categories", { data: { id: categoryToDelete } });
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
    if (!modelToDelete) return;
    setSaving(true);
    try {
      await axios.delete("/api/models", { data: { id: modelToDelete.id } });
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
    setSaving(true);
    try {
      await axios.post("/api/variants", newVariant);
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
    if (!variantToDelete) return;
    setSaving(true);
    try {
      await axios.delete("/api/variants", { data: { id: variantToDelete.id } });
      setDeleteVariantDialogOpen(false);
      setVariantToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete variant:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTemplate = async (template: WhatsAppTemplate) => {
    setSaving(true);
    try {
      await axios.put("/api/templates", template);
      fetchData();
    } catch (error) {
      console.error("Failed to update template:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyTheme = () => {
    setTheme(themeSettings.theme as "light" | "dark" | "custom");
    if (themeSettings.theme === "custom") {
      setPrimaryColor(themeSettings.primaryColor);
      setSecondaryColor(themeSettings.secondaryColor);
      setTertiaryColor(themeSettings.tertiaryColor);
    }
  };

  if (loading) {
    return <SettingsLoading />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Configure vehicle models, WhatsApp templates, and appearance
        </p>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-xs sm:text-base">
          <TabsTrigger value="vehicles">Vehicle Models</TabsTrigger>
          <TabsTrigger value="templates">WhatsApp</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="w-full">
                  <CardTitle className="text-lg sm:text-xl">
                    Categories & Models
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Manage vehicle categories and models for your showroom
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
                        <DialogTitle className="text-lg">
                          Add Category
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                          Create a new vehicle category (e.g., Sedan, SUV,
                          Coupe)
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

                  <Dialog
                    open={modelDialogOpen}
                    onOpenChange={setModelDialogOpen}
                  >
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
                      <form
                        onSubmit={handleCreateModel}
                        className="space-y-4 mt-4"
                      >
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
                        <DialogTitle className="text-lg">
                          Add Variant
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                          Add a variant to a vehicle model (e.g., "xl", "s",
                          "base")
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
                              ))
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
                              setNewVariant({
                                ...newVariant,
                                name: e.target.value,
                              })
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
              {categories.length === 0 ? (
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
                                                      true
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

          {/* Delete Category Confirmation Dialog */}
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
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Model Confirmation Dialog */}
          <Dialog
            open={deleteModelDialogOpen}
            onOpenChange={setDeleteModelDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Model</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the model "
                  {modelToDelete?.name}"? This will also delete all related
                  visitor interests and test drives, and cannot be undone.
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
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Variant Confirmation Dialog */}
          <Dialog
            open={deleteVariantDialogOpen}
            onOpenChange={setDeleteVariantDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Variant</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the variant "
                  {variantToDelete?.modelName}.{variantToDelete?.name}"? This
                  will also delete all related visitor interests and test
                  drives, and cannot be undone.
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
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                WhatsApp Templates
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure template IDs and names for WhatsApp messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-3 sm:p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {template.name}
                    </h3>
                    <span className="text-xs text-muted-foreground uppercase whitespace-nowrap">
                      {template.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Template ID</Label>
                      <Input
                        value={template.templateId}
                        onChange={(e) => {
                          const updated = templates.map((t) =>
                            t.id === template.id
                              ? { ...t, templateId: e.target.value }
                              : t
                          );
                          setTemplates(updated);
                        }}
                        placeholder="e.g., 728805729727726"
                        className="text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Template Name</Label>
                      <Input
                        value={template.templateName}
                        onChange={(e) => {
                          const updated = templates.map((t) =>
                            t.id === template.id
                              ? { ...t, templateName: e.target.value }
                              : t
                          );
                          setTemplates(updated);
                        }}
                        placeholder="e.g., welcome_msg"
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateTemplate(template)}
                    disabled={saving}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    Save
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Appearance</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Theme</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant={
                      themeSettings.theme === "light" ? "default" : "outline"
                    }
                    onClick={() =>
                      setThemeSettings({ ...themeSettings, theme: "light" })
                    }
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Light
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      themeSettings.theme === "dark" ? "default" : "outline"
                    }
                    onClick={() =>
                      setThemeSettings({ ...themeSettings, theme: "dark" })
                    }
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Dark
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      themeSettings.theme === "custom" ? "default" : "outline"
                    }
                    onClick={() =>
                      setThemeSettings({ ...themeSettings, theme: "custom" })
                    }
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {themeSettings.theme === "custom" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="primary-color"
                      className="text-sm font-semibold"
                    >
                      Primary Color (Main)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Used for main buttons, headings, and primary actions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            primaryColor: e.target.value,
                          })
                        }
                        className="w-full sm:w-20 h-10"
                      />
                      <Input
                        value={themeSettings.primaryColor}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            primaryColor: e.target.value,
                          })
                        }
                        placeholder="#3b82f6"
                        className="text-xs sm:text-sm flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="secondary-color"
                      className="text-sm font-semibold"
                    >
                      Secondary Color
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Used for secondary buttons, accents, and highlights
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="w-full sm:w-20 h-10"
                      />
                      <Input
                        value={themeSettings.secondaryColor}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            secondaryColor: e.target.value,
                          })
                        }
                        placeholder="#8b5cf6"
                        className="text-xs sm:text-sm flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="tertiary-color"
                      className="text-sm font-semibold"
                    >
                      Tertiary Color
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Used for borders, hover states, and subtle backgrounds
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="tertiary-color"
                        type="color"
                        value={themeSettings.tertiaryColor}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            tertiaryColor: e.target.value,
                          })
                        }
                        className="w-full sm:w-20 h-10"
                      />
                      <Input
                        value={themeSettings.tertiaryColor}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            tertiaryColor: e.target.value,
                          })
                        }
                        placeholder="#ec4899"
                        className="text-xs sm:text-sm flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleApplyTheme}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Apply Theme
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
