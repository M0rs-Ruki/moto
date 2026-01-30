"use client";

import { useState } from "react";
import apiClient from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Loader2,
  Calendar,
  Send,
  ChevronDown,
  CheckCircle,
  X,
} from "lucide-react";

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

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

export default function CreateTicketDialog({
  open,
  onOpenChange,
  onTicketCreated,
}: CreateTicketDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
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
    description: "",
    deliveryDate: "",
    modelId: "",
    variantId: "",
    scheduleOption: "d3", // d3, d2, d1, or "now"
  });

  const fetchCreateFormData = async () => {
    try {
      const response = await apiClient.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (isOpen) {
      fetchCreateFormData();
    } else {
      // Reset form when closing
      setFormData({
        firstName: "",
        lastName: "",
        whatsappNumber: "",
        email: "",
        address: "",
        description: "",
        deliveryDate: "",
        modelId: "",
        variantId: "",
        scheduleOption: "d3",
      });
      setError("");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await apiClient.post("/delivery-tickets", {
        ...formData,
        modelId: formData.modelId || null,
        variantId: formData.variantId || null,
      });

      if (response.data.success) {
        // Close dialog and notify parent
        onOpenChange(false);
        onTicketCreated();

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          whatsappNumber: "",
          email: "",
          address: "",
          description: "",
          deliveryDate: "",
          modelId: "",
          variantId: "",
          scheduleOption: "d3",
        });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Delivery Ticket</DialogTitle>
          <DialogDescription>Add a new delivery client</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateTicket} className="space-y-4 mt-4">
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
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Additional notes or description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="deliveryDate"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-primary" />
                Delivery Date *
              </Label>
              <div className="relative group">
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryDate: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="pl-10 pr-10 w-full cursor-pointer hover:border-primary focus:border-primary transition-colors text-sm sm:text-base hover:bg-accent/50 text-foreground font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  style={{
                    colorScheme: "light",
                  }}
                />
                {formData.deliveryDate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, deliveryDate: "" });
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center transition-colors z-20 group border border-destructive/30"
                    aria-label="Clear date"
                  >
                    <X className="h-3.5 w-3.5 text-destructive font-bold" />
                  </button>
                )}
              </div>
              {formData.deliveryDate && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
                  <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <p className="text-xs text-foreground font-medium">
                    {new Date(formData.deliveryDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="scheduleOption"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Send className="h-4 w-4 text-primary" />
                Send Message
              </Label>
              <Select
                value={formData.scheduleOption}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    scheduleOption: value,
                  })
                }
              >
                <SelectTrigger className="w-full hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select schedule option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="d3">D-3</SelectItem>
                  <SelectItem value="d2">D-2</SelectItem>
                  <SelectItem value="d1">D-1</SelectItem>
                  <SelectItem value="now">Send Now</SelectItem>
                </SelectContent>
              </Select>
              {formData.deliveryDate && formData.scheduleOption !== "now" && (
                <p className="text-xs text-muted-foreground">
                  {formData.scheduleOption === "d3" &&
                    "Message will be sent 3 days before delivery"}
                  {formData.scheduleOption === "d2" &&
                    "Message will be sent 2 days before delivery"}
                  {formData.scheduleOption === "d1" &&
                    "Message will be sent 1 day before delivery"}
                  {(() => {
                    const deliveryDate = new Date(formData.deliveryDate);
                    const days =
                      formData.scheduleOption === "d3"
                        ? 3
                        : formData.scheduleOption === "d2"
                          ? 2
                          : 1;
                    const scheduledDate = new Date(deliveryDate);
                    scheduledDate.setDate(scheduledDate.getDate() - days);
                    return ` (${scheduledDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })})`;
                  })()}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Model to be Delivered *</Label>
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
                              formData.modelId === model.id &&
                              !formData.variantId;
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
                                      name="model"
                                      checked={isModelSelected}
                                      onChange={() =>
                                        setFormData({
                                          ...formData,
                                          modelId: model.id,
                                          variantId: "",
                                        })
                                      }
                                      className="absolute opacity-0 cursor-pointer w-5 h-5"
                                      required
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
                                {hasVariants && model.variants && (
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
                                          formData.modelId === model.id &&
                                          formData.variantId === variant.id;
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
                                                name="model"
                                                checked={isVariantSelected}
                                                onChange={() =>
                                                  setFormData({
                                                    ...formData,
                                                    modelId: model.id,
                                                    variantId: variant.id,
                                                  })
                                                }
                                                className="absolute opacity-0 cursor-pointer w-5 h-5"
                                                required
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

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto min-w-[120px] hover:bg-muted transition-colors"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-w-[140px] bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
