import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, UserPlus, Loader2, ChevronDown, Check } from "lucide-react";
import { VehicleCategory, VisitorFormData } from "../types";

interface VisitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: VehicleCategory[];
  onSubmit: (formData: VisitorFormData) => Promise<void>;
  submitting: boolean;
  error: string;
}

export function VisitorDialog({
  open,
  onOpenChange,
  categories,
  onSubmit,
  submitting,
  error,
}: VisitorDialogProps) {
  const [formData, setFormData] = useState<VisitorFormData>({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    email: "",
    address: "",
    reason: "",
    modelIds: [],
  });
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set(),
  );

  const handleModelToggle = (modelId: string, variantId?: string) => {
    setFormData((prev) => {
      const item = variantId ? { modelId, variantId } : modelId;
      const isSelected = prev.modelIds.some((id) => {
        if (typeof id === "string") {
          return id === modelId && !variantId;
        } else {
          return id.modelId === modelId && id.variantId === variantId;
        }
      });

      if (isSelected) {
        return {
          ...prev,
          modelIds: prev.modelIds.filter((id) => {
            if (typeof id === "string") {
              return id !== modelId || variantId !== undefined;
            } else {
              return !(id.modelId === modelId && id.variantId === variantId);
            }
          }),
        };
      } else {
        return {
          ...prev,
          modelIds: [...prev.modelIds, item],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      whatsappNumber: "",
      email: "",
      address: "",
      reason: "",
      modelIds: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Visitor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Add New Visitor</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Fill in visitor details and select interested models. A WhatsApp
            welcome message will be sent automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm">
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm">
                Last Name *
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber" className="text-sm">
              WhatsApp Number *
            </Label>
            <Input
              id="whatsappNumber"
              placeholder="+1234567890"
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatsappNumber: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm">
                Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm">
              Reason for Visit *
            </Label>
            <Textarea
              id="reason"
              placeholder="Why are they visiting?"
              value={formData.reason}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reason: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Interested Models</Label>
            <div className="border border-border/40 rounded-lg bg-background p-3 max-h-64 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No models available. Add models in Global Settings.
                </p>
              ) : (
                <div className="space-y-1">
                  {categories.map((category) => {
                    const isOpen = openModelCategories.has(category.id);
                    return (
                      <Collapsible
                        key={category.id}
                        open={isOpen}
                        onOpenChange={(open) => {
                          setOpenModelCategories((prev) => {
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
                        <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 bg-muted/40 hover:bg-muted/60 rounded-md text-sm font-medium transition-colors">
                          <span className="text-foreground">
                            {category.name}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1.5 space-y-1">
                          {category.models.map((model) => {
                            const isModelSelected = formData.modelIds.some(
                              (id) =>
                                (typeof id === "string" && id === model.id) ||
                                (typeof id === "object" &&
                                  id.modelId === model.id &&
                                  !id.variantId),
                            );
                            return (
                              <div key={model.id} className="space-y-0.5">
                                <label className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-muted/30 cursor-pointer transition-colors group">
                                  <div className="relative flex items-center justify-center shrink-0">
                                    <div
                                      className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all ${
                                        isModelSelected
                                          ? "bg-primary border-primary"
                                          : "bg-background border-border hover:border-primary/50"
                                      }`}
                                    >
                                      {isModelSelected && (
                                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                                      )}
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={isModelSelected}
                                      onChange={() =>
                                        handleModelToggle(model.id)
                                      }
                                      className="absolute opacity-0 cursor-pointer w-5 h-5"
                                    />
                                  </div>
                                  <span className="text-sm text-foreground flex-1">
                                    {model.name}
                                    {model.year && (
                                      <span className="text-muted-foreground ml-1">
                                        ({model.year})
                                      </span>
                                    )}
                                  </span>
                                </label>
                                {model.variants &&
                                  model.variants.length > 0 && (
                                    <Collapsible
                                      open={expandedVariants.has(model.id)}
                                      onOpenChange={(open) => {
                                        setExpandedVariants((prev) => {
                                          const newSet = new Set(prev);
                                          if (open) {
                                            newSet.add(model.id);
                                          } else {
                                            newSet.delete(model.id);
                                          }
                                          return newSet;
                                        });
                                      }}
                                    >
                                      <CollapsibleTrigger className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded transition-all">
                                        <ChevronDown
                                          className={`h-4 w-4 transition-transform ${
                                            expandedVariants.has(model.id)
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                        <span>
                                          {model.variants.length} variant
                                          {model.variants.length !== 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent className="ml-6 space-y-1 mt-1">
                                        {model.variants.map((variant) => {
                                          const isVariantSelected =
                                            formData.modelIds.some(
                                              (id) =>
                                                typeof id === "object" &&
                                                id.modelId === model.id &&
                                                id.variantId === variant.id,
                                            );
                                          return (
                                            <label
                                              key={variant.id}
                                              className="flex items-center gap-3 px-2.5 py-2 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                                            >
                                              <div className="relative flex items-center justify-center shrink-0">
                                                <div
                                                  className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all ${
                                                    isVariantSelected
                                                      ? "bg-primary border-primary"
                                                      : "bg-background border-border hover:border-primary/50"
                                                  }`}
                                                >
                                                  {isVariantSelected && (
                                                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                                                  )}
                                                </div>
                                                <input
                                                  type="checkbox"
                                                  checked={isVariantSelected}
                                                  onChange={() =>
                                                    handleModelToggle(
                                                      model.id,
                                                      variant.id,
                                                    )
                                                  }
                                                  className="absolute opacity-0 cursor-pointer w-5 h-5"
                                                />
                                              </div>
                                              <span className="text-sm text-foreground flex-1">
                                                {model.name}.{variant.name}
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </CollapsibleContent>
                                    </Collapsible>
                                  )}
                              </div>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create & Send Welcome
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
