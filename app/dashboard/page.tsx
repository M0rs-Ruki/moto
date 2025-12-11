"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Loader2,
  UserPlus,
  Search,
  UserCheck,
  ChevronDown,
  X,
} from "lucide-react";
import DashboardLoading from "./loading";
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
  variants?: VehicleVariant[];
}

interface VehicleCategory {
  id: string;
  name: string;
  models: VehicleModel[];
}

interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string | null;
  sessions: Array<{
    id: string;
    status: string;
    reason: string;
  }>;
  interests: Array<{
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingVisitorDialogOpen, setExistingVisitorDialogOpen] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [foundVisitor, setFoundVisitor] = useState<any>(null);
  const [visitReason, setVisitReason] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [existingVisitorModelIds, setExistingVisitorModelIds] = useState<
    Array<string | { modelId: string; variantId?: string }>
  >([]);

  // Search and filter state for model selection
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set()
  );
  const [existingVisitorModelSearchQuery, setExistingVisitorModelSearchQuery] =
    useState("");
  const [openExistingVisitorCategories, setOpenExistingVisitorCategories] =
    useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    email: "",
    address: "",
    reason: "",
    modelIds: [] as Array<string | { modelId: string; variantId?: string }>,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, visitorsRes] = await Promise.all([
        axios.get("/api/categories"),
        axios.get("/api/visitors"),
      ]);
      setCategories(categoriesRes.data.categories);
      setVisitors(visitorsRes.data.visitors);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);
    setError("");

    try {
      await axios.post("/api/visitors", formData);

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

      setDialogOpen(false);
      fetchData(); // Refresh visitors list
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create visitor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisitorClick = (visitor: Visitor) => {
    // Get the most recent session ID, or use visitor ID if no session
    const sessionId =
      visitor.sessions && visitor.sessions.length > 0
        ? visitor.sessions[0].id
        : null;

    if (sessionId) {
      // Navigate to sessions page with session ID
      router.push(`/dashboard/sessions?sessionId=${sessionId}`);
    } else {
      // If no session, still navigate but with visitor ID
      router.push(`/dashboard/sessions?visitorId=${visitor.id}`);
    }
  };

  const handleSearchVisitor = async () => {
    if (!searchPhone.trim()) {
      setError("Please enter a phone number");
      return;
    }

    setSearching(true);
    setError("");
    setFoundVisitor(null);
    setExistingVisitorModelIds([]);

    try {
      const response = await axios.get(
        `/api/visitors?phone=${encodeURIComponent(searchPhone.trim())}`
      );

      if (response.data.found && response.data.visitor) {
        setFoundVisitor(response.data.visitor);
        // Pre-select existing interests
        if (response.data.visitor.interests) {
          setExistingVisitorModelIds(
            response.data.visitor.interests.map((i: any) => i.modelId)
          );
        }
      } else {
        setError("Visitor not found. You can create a new visitor instead.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to search visitor");
    } finally {
      setSearching(false);
    }
  };

  const handleCreateSessionForExistingVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundVisitor || !visitReason.trim()) {
      setError("Please enter a reason for the visit");
      return;
    }

    setCreatingSession(true);
    setError("");

    try {
      const response = await axios.post("/api/visitors/session", {
        visitorId: foundVisitor.id,
        reason: visitReason,
        modelIds: existingVisitorModelIds, // Include selected vehicle interests
      });

      // Reset form
      setSearchPhone("");
      setVisitReason("");
      setFoundVisitor(null);
      setExistingVisitorModelIds([]);
      setExistingVisitorDialogOpen(false);

      // Navigate to the new session
      if (response.data.session) {
        router.push(
          `/dashboard/sessions?sessionId=${response.data.session.id}`
        );
      } else {
        fetchData(); // Refresh visitors list
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create session");
    } finally {
      setCreatingSession(false);
    }
  };

  const handleResetSearch = () => {
    setSearchPhone("");
    setFoundVisitor(null);
    setVisitReason("");
    setExistingVisitorModelIds([]);
    setError("");
  };

  const handleExistingVisitorModelToggle = (
    modelId: string,
    variantId?: string
  ) => {
    setExistingVisitorModelIds((prev) => {
      const item = variantId ? { modelId, variantId } : modelId;
      const isSelected = prev.some((id) => {
        if (typeof id === "string") {
          return id === modelId && !variantId;
        } else {
          return id.modelId === modelId && id.variantId === variantId;
        }
      });

      if (isSelected) {
        return prev.filter((id) => {
          if (typeof id === "string") {
            return id !== modelId || variantId !== undefined;
          } else {
            return !(id.modelId === modelId && id.variantId === variantId);
          }
        });
      } else {
        return [...prev, item];
      }
    });
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2 border-b">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Visitor Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Create visitor records and send WhatsApp messages
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="default"
                className="w-full sm:w-auto shadow-md hover:shadow-lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                New Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader className="space-y-2">
                <DialogTitle>Add New Visitor</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Fill in visitor details and select interested models. A
                  WhatsApp welcome message will be sent automatically.
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
                    type="tel"
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

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm">
                    Reason for Visit *
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Why is the visitor here? (e.g., Looking to buy a new car, Trade-in inquiry, etc.)"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    required
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Interested Models
                    </Label>
                    {formData.modelIds.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {formData.modelIds.length} selected
                      </Badge>
                    )}
                  </div>
                  {categories.length === 0 ? (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No vehicle models available. Please add categories and
                      models in Settings.
                    </p>
                  ) : (
                    <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                      {/* Search Bar */}
                      <div className="p-4 border-b bg-gradient-to-r from-muted/50 to-muted/30">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search models or variants..."
                            value={modelSearchQuery}
                            onChange={(e) =>
                              setModelSearchQuery(e.target.value)
                            }
                            className="pl-9 pr-9 h-10 text-sm bg-background border-border/50 focus:border-primary"
                          />
                          {modelSearchQuery && (
                            <button
                              onClick={() => setModelSearchQuery("")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-full p-0.5 hover:bg-muted"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Models List */}
                      <div className="max-h-80 overflow-y-auto p-4 space-y-3 bg-background">
                        {categories
                          .map((category) => {
                            // Filter models that match search query
                            const filteredModels = category.models.filter(
                              (model) => {
                                if (!modelSearchQuery) return true;
                                const query = modelSearchQuery.toLowerCase();
                                return (
                                  model.name.toLowerCase().includes(query) ||
                                  model.variants?.some((v) =>
                                    v.name.toLowerCase().includes(query)
                                  )
                                );
                              }
                            );

                            // Only show category if it has matching models
                            if (modelSearchQuery && filteredModels.length === 0) {
                              return null;
                            }

                            // Auto-expand categories when searching
                            const isCategoryOpen = modelSearchQuery
                              ? true
                              : openModelCategories.has(category.id);

                            return (
                              <Collapsible
                                key={category.id}
                                open={isCategoryOpen}
                                onOpenChange={(open) => {
                                  // Don't allow closing when searching
                                  if (modelSearchQuery) return;
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
                                <div className="border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                                  <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between p-3 hover:bg-muted/40 transition-colors cursor-pointer">
                                      <div className="flex items-center gap-3">
                                        <ChevronDown
                                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                            isCategoryOpen
                                              ? "transform rotate-180 text-primary"
                                              : ""
                                          }`}
                                        />
                                        <span className="font-semibold text-sm text-foreground">
                                          {category.name}
                                        </span>
                                        {filteredModels.length > 0 && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs font-normal"
                                          >
                                            {filteredModels.length}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="p-3 space-y-1.5 bg-muted/20 border-t">
                                      {filteredModels.map((model) => {
                                        const hasVariants =
                                          model.variants &&
                                          model.variants.length > 0;
                                        const isModelSelected =
                                          formData.modelIds.some(
                                            (id) =>
                                              (typeof id === "string" &&
                                                id === model.id) ||
                                              (typeof id === "object" &&
                                                id.modelId === model.id &&
                                                !id.variantId)
                                          );

                                        return (
                                          <div
                                            key={model.id}
                                            className="space-y-1"
                                          >
                                            {/* Base Model Checkbox */}
                                            <label
                                              className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-md transition-all ${
                                                isModelSelected
                                                  ? "bg-primary/10 border border-primary/20"
                                                  : "hover:bg-muted/50 border border-transparent"
                                              }`}
                                            >
                                              <div className="relative flex items-center justify-center shrink-0">
                                                <input
                                                  type="checkbox"
                                                  checked={isModelSelected}
                                                  onChange={() =>
                                                    handleModelToggle(model.id)
                                                  }
                                                  className="peer h-5 w-5 appearance-none rounded border-2 border-muted-foreground/40 bg-background cursor-pointer transition-all duration-200 checked:bg-primary checked:border-primary hover:border-primary/60 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                />
                                                <svg
                                                  className="absolute h-5 w-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200 text-primary-foreground"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                  strokeWidth={3}
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                  />
                                                </svg>
                                              </div>
                                              <div className="flex-1 flex items-center gap-2">
                                                <span
                                                  className={`text-sm font-medium ${
                                                    isModelSelected
                                                      ? "text-primary"
                                                      : "text-foreground"
                                                  }`}
                                                >
                                                  {model.name}
                                                </span>
                                                {model.year && (
                                                  <span className="text-xs text-muted-foreground">
                                                    ({model.year})
                                                  </span>
                                                )}
                                                {hasVariants && (
                                                  <Badge
                                                    variant="outline"
                                                    className="text-xs font-normal"
                                                  >
                                                    Base
                                                  </Badge>
                                                )}
                                              </div>
                                            </label>

                                            {/* Variants */}
                                            {hasVariants &&
                                              model.variants
                                                .filter((variant) => {
                                                  if (!modelSearchQuery)
                                                    return true;
                                                  const query =
                                                    modelSearchQuery.toLowerCase();
                                                  return (
                                                    variant.name
                                                      .toLowerCase()
                                                      .includes(query) ||
                                                    model.name
                                                      .toLowerCase()
                                                      .includes(query)
                                                  );
                                                })
                                                .map((variant) => {
                                                  const isVariantSelected =
                                                    formData.modelIds.some(
                                                      (id) =>
                                                        typeof id ===
                                                          "object" &&
                                                        id.modelId ===
                                                          model.id &&
                                                        id.variantId ===
                                                          variant.id
                                                    );
                                                  return (
                                                    <label
                                                      key={variant.id}
                                                      className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all ml-8 ${
                                                        isVariantSelected
                                                          ? "bg-primary/10 border border-primary/20"
                                                          : "hover:bg-muted/40 border border-transparent"
                                                      }`}
                                                    >
                                                      <div className="relative flex items-center justify-center shrink-0">
                                                        <input
                                                          type="checkbox"
                                                          checked={
                                                            isVariantSelected
                                                          }
                                                          onChange={() =>
                                                            handleModelToggle(
                                                              model.id,
                                                              variant.id
                                                            )
                                                          }
                                                          className="peer h-5 w-5 appearance-none rounded border-2 border-muted-foreground/40 bg-background cursor-pointer transition-all duration-200 checked:bg-primary checked:border-primary hover:border-primary/60 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                        />
                                                        <svg
                                                          className="absolute h-5 w-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200 text-primary-foreground"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          stroke="currentColor"
                                                          strokeWidth={3}
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                          />
                                                        </svg>
                                                      </div>
                                                      <div className="flex-1 flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                          {model.name}.
                                                        </span>
                                                        <span
                                                          className={`text-sm font-medium ${
                                                            isVariantSelected
                                                              ? "text-primary"
                                                              : "text-foreground"
                                                          }`}
                                                        >
                                                          {variant.name}
                                                        </span>
                                                        {model.year && (
                                                          <span className="text-xs text-muted-foreground">
                                                            ({model.year})
                                                          </span>
                                                        )}
                                                      </div>
                                                    </label>
                                                  );
                                                })}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </CollapsibleContent>
                                </div>
                              </Collapsible>
                            );
                          })}
                        {categories
                          .map((category) => {
                            if (!modelSearchQuery) return category;
                            const filteredModels = category.models.filter(
                              (model) => {
                                const query = modelSearchQuery.toLowerCase();
                                return (
                                  model.name.toLowerCase().includes(query) ||
                                  model.variants?.some((v) =>
                                    v.name.toLowerCase().includes(query)
                                  )
                                );
                              }
                            );
                            return filteredModels.length > 0 ? category : null;
                          })
                          .filter(Boolean).length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">
                              No models found matching
                            </p>
                            <p className="text-sm font-medium text-foreground mt-1">
                              "{modelSearchQuery}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
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
                      "Create & Send Welcome"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={existingVisitorDialogOpen}
            onOpenChange={setExistingVisitorDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto shadow-md hover:shadow-lg"
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Existing Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader className="space-y-2">
                <DialogTitle>Existing Visitor - New Visit</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Search for an existing visitor by phone number to create a new
                  visit session.
                </DialogDescription>
              </DialogHeader>

              {!foundVisitor ? (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchPhone" className="text-sm">
                      Search by WhatsApp Number *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="searchPhone"
                        type="tel"
                        placeholder="+1234567890"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearchVisitor();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleSearchVisitor}
                        disabled={searching || !searchPhone.trim()}
                      >
                        {searching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                      {error}
                    </div>
                  )}

                  {error && error.includes("not found") && (
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setExistingVisitorDialogOpen(false);
                          setDialogOpen(true);
                        }}
                        className="w-full"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create New Visitor Instead
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleCreateSessionForExistingVisitor}
                  className="space-y-4 mt-4"
                >
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">
                        Visitor Information
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {foundVisitor.sessionCount === 1
                          ? "2nd Visit"
                          : foundVisitor.sessionCount === 2
                          ? "3rd Visit"
                          : `${foundVisitor.sessionCount + 1}th Visit`}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Name:
                        </span>
                        <p className="font-medium">
                          {foundVisitor.firstName} {foundVisitor.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Phone:
                        </span>
                        <p className="font-medium">
                          {foundVisitor.whatsappNumber}
                        </p>
                      </div>
                      {foundVisitor.email && (
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Email:
                          </span>
                          <p className="font-medium">{foundVisitor.email}</p>
                        </div>
                      )}
                      {foundVisitor.address && (
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Address:
                          </span>
                          <p className="font-medium">{foundVisitor.address}</p>
                        </div>
                      )}
                    </div>
                    {foundVisitor.interests &&
                      foundVisitor.interests.length > 0 && (
                        <div className="pt-2 border-t">
                          <span className="text-muted-foreground text-xs">
                            Previous Interests:
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {foundVisitor.interests.map(
                              (interest: any, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {interest.categoryName} - {interest.modelName}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        Vehicle Interests (Optional - Update if changed)
                      </Label>
                      {existingVisitorModelIds.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {existingVisitorModelIds.length} selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select vehicles the visitor is interested in for this
                      visit. Previous interests are pre-selected.
                    </p>
                    {categories.length === 0 ? (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        No vehicle models available. Please add categories and
                        models in Settings.
                      </p>
                    ) : (
                      <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                        {/* Search Bar */}
                        <div className="p-4 border-b bg-gradient-to-r from-muted/50 to-muted/30">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search models or variants..."
                              value={existingVisitorModelSearchQuery}
                              onChange={(e) =>
                                setExistingVisitorModelSearchQuery(
                                  e.target.value
                                )
                              }
                              className="pl-9 pr-9 h-10 text-sm bg-background border-border/50 focus:border-primary"
                            />
                            {existingVisitorModelSearchQuery && (
                              <button
                                onClick={() =>
                                  setExistingVisitorModelSearchQuery("")
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-full p-0.5 hover:bg-muted"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Models List */}
                        <div className="max-h-80 overflow-y-auto p-4 space-y-3 bg-background">
                          {categories
                            .map((category) => {
                              // Filter models that match search query
                              const filteredModels = category.models.filter(
                                (model) => {
                                  if (!existingVisitorModelSearchQuery)
                                    return true;
                                  const query =
                                    existingVisitorModelSearchQuery.toLowerCase();
                                  return (
                                    model.name.toLowerCase().includes(query) ||
                                    model.variants?.some((v) =>
                                      v.name.toLowerCase().includes(query)
                                    )
                                  );
                                }
                              );

                              // Only show category if it has matching models
                              if (
                                existingVisitorModelSearchQuery &&
                                filteredModels.length === 0
                              ) {
                                return null;
                              }

                              // Auto-expand categories when searching
                              const isCategoryOpen = existingVisitorModelSearchQuery
                                ? true
                                : openExistingVisitorCategories.has(
                                    category.id
                                  );

                              return (
                                <Collapsible
                                  key={category.id}
                                  open={isCategoryOpen}
                                  onOpenChange={(open) => {
                                    // Don't allow closing when searching
                                    if (existingVisitorModelSearchQuery) return;
                                    setOpenExistingVisitorCategories((prev) => {
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
                                  <div className="border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <CollapsibleTrigger className="w-full">
                                      <div className="flex items-center justify-between p-3 hover:bg-muted/40 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                          <ChevronDown
                                            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                              isCategoryOpen
                                                ? "transform rotate-180 text-primary"
                                                : ""
                                            }`}
                                          />
                                          <span className="font-semibold text-sm text-foreground">
                                            {category.name}
                                          </span>
                                          <Badge
                                            variant="secondary"
                                            className="text-xs font-normal"
                                          >
                                            {filteredModels.length}
                                          </Badge>
                                        </div>
                                      </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <div className="p-3 space-y-1.5 bg-muted/20 border-t">
                                        {filteredModels.map((model) => {
                                          const hasVariants =
                                            model.variants &&
                                            model.variants.length > 0;
                                          const isModelSelected =
                                            existingVisitorModelIds.some(
                                              (id) =>
                                                (typeof id === "string" &&
                                                  id === model.id) ||
                                                (typeof id === "object" &&
                                                  id.modelId === model.id &&
                                                  !id.variantId)
                                            );
                                          const wasPreviousInterest =
                                            foundVisitor.interests?.some(
                                              (i: any) => i.modelId === model.id
                                            );

                                          return (
                                            <div
                                              key={model.id}
                                              className="space-y-1.5 pl-2"
                                            >
                                              {/* Base Model Checkbox */}
                                              <label
                                                className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-md transition-all ${
                                                  isModelSelected
                                                    ? "bg-primary/10 border border-primary/20"
                                                    : wasPreviousInterest
                                                    ? "bg-primary/5 border border-primary/10"
                                                    : "hover:bg-muted/50 border border-transparent"
                                                }`}
                                              >
                                                <div className="relative flex items-center justify-center shrink-0">
                                                  <input
                                                    type="checkbox"
                                                    checked={isModelSelected}
                                                    onChange={() =>
                                                      handleExistingVisitorModelToggle(
                                                        model.id
                                                      )
                                                    }
                                                    className="peer h-5 w-5 appearance-none rounded border-2 border-muted-foreground/40 bg-background cursor-pointer transition-all duration-200 checked:bg-primary checked:border-primary hover:border-primary/60 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                  />
                                                  <svg
                                                    className="absolute h-5 w-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200 text-primary-foreground"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M5 13l4 4L19 7"
                                                    />
                                                  </svg>
                                                </div>
                                                <div className="flex-1 flex items-center gap-2">
                                                  <span
                                                    className={`text-sm font-medium ${
                                                      isModelSelected
                                                        ? "text-primary"
                                                        : "text-foreground"
                                                    }`}
                                                  >
                                                    {model.name}
                                                  </span>
                                                  {model.year && (
                                                    <span className="text-xs text-muted-foreground">
                                                      ({model.year})
                                                    </span>
                                                  )}
                                                  {hasVariants && (
                                                    <Badge
                                                      variant="outline"
                                                      className="text-xs font-normal"
                                                    >
                                                      Base
                                                    </Badge>
                                                  )}
                                                  {wasPreviousInterest && (
                                                    <Badge
                                                      variant="secondary"
                                                      className="text-xs font-normal"
                                                    >
                                                      Previous
                                                    </Badge>
                                                  )}
                                                </div>
                                              </label>

                                              {/* Variants */}
                                              {hasVariants &&
                                                model.variants
                                                  .filter((variant) => {
                                                    if (
                                                      !existingVisitorModelSearchQuery
                                                    )
                                                      return true;
                                                    const query =
                                                      existingVisitorModelSearchQuery.toLowerCase();
                                                    return (
                                                      variant.name
                                                        .toLowerCase()
                                                        .includes(query) ||
                                                      model.name
                                                        .toLowerCase()
                                                        .includes(query)
                                                    );
                                                  })
                                                  .map((variant) => {
                                                    const isVariantSelected =
                                                      existingVisitorModelIds.some(
                                                        (id) =>
                                                          typeof id ===
                                                            "object" &&
                                                          id.modelId ===
                                                            model.id &&
                                                          id.variantId ===
                                                            variant.id
                                                      );
                                                    return (
                                                      <label
                                                        key={variant.id}
                                                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all ml-8 ${
                                                          isVariantSelected
                                                            ? "bg-primary/10 border border-primary/20"
                                                            : "hover:bg-muted/40 border border-transparent"
                                                        }`}
                                                      >
                                                        <div className="relative flex items-center justify-center shrink-0">
                                                          <input
                                                            type="checkbox"
                                                            checked={
                                                              isVariantSelected
                                                            }
                                                            onChange={() =>
                                                              handleExistingVisitorModelToggle(
                                                                model.id,
                                                                variant.id
                                                              )
                                                            }
                                                            className="peer h-5 w-5 appearance-none rounded border-2 border-muted-foreground/40 bg-background cursor-pointer transition-all duration-200 checked:bg-primary checked:border-primary hover:border-primary/60 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                          />
                                                          <svg
                                                            className="absolute h-5 w-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200 text-primary-foreground"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={3}
                                                          >
                                                            <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              d="M5 13l4 4L19 7"
                                                            />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 flex items-center gap-2">
                                                          <span className="text-xs text-muted-foreground">
                                                            {model.name}.
                                                          </span>
                                                          <span
                                                            className={`text-sm font-medium ${
                                                              isVariantSelected
                                                                ? "text-primary"
                                                                : "text-foreground"
                                                            }`}
                                                          >
                                                            {variant.name}
                                                          </span>
                                                          {model.year && (
                                                            <span className="text-xs text-muted-foreground">
                                                              ({model.year})
                                                            </span>
                                                          )}
                                                        </div>
                                                      </label>
                                                    );
                                                  })}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CollapsibleContent>
                                  </div>
                                </Collapsible>
                              );
                            })}
                          {categories
                            .map((category) => {
                              if (!existingVisitorModelSearchQuery)
                                return category;
                              const filteredModels = category.models.filter(
                                (model) => {
                                  const query =
                                    existingVisitorModelSearchQuery.toLowerCase();
                                  return (
                                    model.name.toLowerCase().includes(query) ||
                                    model.variants?.some((v) =>
                                      v.name.toLowerCase().includes(query)
                                    )
                                  );
                                }
                              );
                              return filteredModels.length > 0
                                ? category
                                : null;
                            })
                            .filter(Boolean).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <Search className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                              <p className="text-sm text-muted-foreground">
                                No models found matching
                              </p>
                              <p className="text-sm font-medium text-foreground mt-1">
                                "{existingVisitorModelSearchQuery}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitReason" className="text-sm">
                      Reason for This Visit *
                    </Label>
                    <Textarea
                      id="visitReason"
                      placeholder="Why is the visitor here today? (e.g., Follow-up on previous inquiry, Test drive, etc.)"
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      required
                      className="min-h-24"
                    />
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetSearch}
                      className="w-full sm:w-auto"
                    >
                      Search Another
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setExistingVisitorDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={creatingSession || !visitReason.trim()}
                      className="w-full sm:w-auto"
                    >
                      {creatingSession ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create{" "}
                          {foundVisitor.sessionCount === 1
                            ? "2nd"
                            : foundVisitor.sessionCount === 2
                            ? "3rd"
                            : `${foundVisitor.sessionCount + 1}th`}{" "}
                          Visit Session
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Visitors List - Responsive Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visitors.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <UserPlus className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground text-center px-4 font-medium">
                No visitors yet. Click "New Visitor" to add your first visitor.
              </p>
            </CardContent>
          </Card>
        ) : (
          visitors.map((visitor) => (
            <Card
              key={visitor.id}
              className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleVisitorClick(visitor)}
            >
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                  {visitor.firstName} {visitor.lastName}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm truncate">
                  {visitor.whatsappNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm flex-1 pt-4">
                {visitor.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Email:
                    </span>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {visitor.email}
                    </p>
                  </div>
                )}
                {visitor.sessions[0] && (
                  <div>
                    <Badge
                      variant={
                        visitor.sessions[0].status === "completed"
                          ? "default"
                          : visitor.sessions[0].status === "test_drive"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {visitor.sessions[0].status}
                    </Badge>
                  </div>
                )}
                {visitor.interests.length > 0 && (
                  <div className="text-xs sm:text-sm border-t pt-3">
                    <p className="font-semibold text-xs mb-2 text-foreground">
                      Interested in:
                    </p>
                    <div className="space-y-1">
                      {visitor.interests.map((interest, idx) => (
                        <p
                          key={idx}
                          className="text-muted-foreground text-xs truncate"
                        >
                          • {interest.model.category.name} -{" "}
                          {interest.model.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
