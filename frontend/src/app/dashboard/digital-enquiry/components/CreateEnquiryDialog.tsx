"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Loader2, ChevronDown } from "lucide-react";

interface LeadSource {
  id: string;
  name: string;
}

interface VehicleModel {
  id: string;
  name: string;
  year: number | null;
  variants?: Array<{ id: string; name: string }>;
}

interface VehicleCategory {
  id: string;
  name: string;
  models: VehicleModel[];
}

interface FormData {
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  reason: string;
  leadSourceId: string;
  leadScope: string;
  interestedModelId: string;
  interestedVariantId: string;
}

interface CreateEnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadSources: LeadSource[];
  categories: VehicleCategory[];
  onSubmit: (formData: FormData) => Promise<void>;
  submitting: boolean;
  error: string;
}

export default function CreateEnquiryDialog({
  open,
  onOpenChange,
  leadSources,
  categories,
  onSubmit,
  submitting,
  error,
}: CreateEnquiryDialogProps) {
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set(),
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    email: "",
    address: "",
    reason: "",
    leadSourceId: "",
    leadScope: "warm",
    interestedModelId: "",
    interestedVariantId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({
      firstName: "",
      lastName: "",
      whatsappNumber: "",
      email: "",
      address: "",
      reason: "",
      leadSourceId: "",
      leadScope: "warm",
      interestedModelId: "",
      interestedVariantId: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Digital Enquiry</DialogTitle>
          <DialogDescription>Add a new digital lead inquiry</DialogDescription>
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
                  setFormData({ ...formData, firstName: e.target.value })
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
                  setFormData({ ...formData, lastName: e.target.value })
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
                  setFormData({ ...formData, email: e.target.value })
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
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm">
              Reason for Enquiry *
            </Label>
            <Textarea
              id="reason"
              placeholder="Why are they interested?"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leadSource" className="text-sm">
                Lead Source
              </Label>
              <Select
                value={formData.leadSourceId}
                onValueChange={(value) =>
                  setFormData({ ...formData, leadSourceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  {leadSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadScope" className="text-sm">
                Lead Scope (Priority)
              </Label>
              <Select
                value={formData.leadScope}
                onValueChange={(value) =>
                  setFormData({ ...formData, leadScope: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Interested Model</Label>
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
                            const isModelSelected =
                              formData.interestedModelId === model.id &&
                              !formData.interestedVariantId;
                            const hasVariants =
                              model.variants && model.variants.length > 0;
                            return (
                              <div key={model.id} className="space-y-0.5">
                                <label className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-muted/30 cursor-pointer transition-colors group">
                                  <div className="relative flex items-center justify-center shrink-0">
                                    <div
                                      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${
                                        isModelSelected
                                          ? "bg-primary border-primary"
                                          : "bg-background border-border hover:border-primary/50"
                                      }`}
                                    >
                                      {isModelSelected && (
                                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                      )}
                                    </div>
                                    <input
                                      type="radio"
                                      name="interestedModel"
                                      checked={isModelSelected}
                                      onChange={() =>
                                        setFormData({
                                          ...formData,
                                          interestedModelId: model.id,
                                          interestedVariantId: "",
                                        })
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
                                {hasVariants && (
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
                                        {model.variants?.length || 0} variant
                                        {(model.variants?.length || 0) !== 1
                                          ? "s"
                                          : ""}
                                      </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-6 space-y-1 mt-1">
                                      {model.variants?.map((variant) => {
                                        const isVariantSelected =
                                          formData.interestedModelId ===
                                            model.id &&
                                          formData.interestedVariantId ===
                                            variant.id;
                                        return (
                                          <label
                                            key={variant.id}
                                            className="flex items-center gap-3 px-2.5 py-2 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                                          >
                                            <div className="relative flex items-center justify-center shrink-0">
                                              <div
                                                className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${
                                                  isVariantSelected
                                                    ? "bg-primary border-primary"
                                                    : "bg-background border-border hover:border-primary/50"
                                                }`}
                                              >
                                                {isVariantSelected && (
                                                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                                )}
                                              </div>
                                              <input
                                                type="radio"
                                                name="interestedModel"
                                                checked={isVariantSelected}
                                                onChange={() =>
                                                  setFormData({
                                                    ...formData,
                                                    interestedModelId: model.id,
                                                    interestedVariantId:
                                                      variant.id,
                                                  })
                                                }
                                                className="absolute opacity-0 cursor-pointer w-5 h-5"
                                              />
                                            </div>
                                            <span className="text-sm text-foreground flex-1">
                                              {model.name}.{variant.name}
                                              {model.year && (
                                                <span className="text-muted-foreground ml-1">
                                                  ({model.year})
                                                </span>
                                              )}
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

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
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
                "Create Inquiry"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
