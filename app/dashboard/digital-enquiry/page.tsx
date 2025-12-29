"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Plus, Loader2, MessageSquare, ChevronDown } from "lucide-react";
import Link from "next/link";

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

interface DigitalEnquiry {
  id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string | null;
  reason: string;
  leadScope: string;
  leadSource: {
    id: string;
    name: string;
  } | null;
  model: {
    name: string;
    category: {
      name: string;
    };
  } | null;
  createdAt: string;
}

interface PhoneLookup {
  dailyWalkins: boolean;
  digitalEnquiry: boolean;
  deliveryUpdate: boolean;
  visitorId: string | null;
  enquiryId: string | null;
  ticketId: string | null;
}

export default function DigitalEnquiryPage() {
  const [enquiries, setEnquiries] = useState<DigitalEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {}
  );

  // Create enquiry dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set()
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/digital-enquiry");
      setEnquiries(response.data.enquiries);

      // Fetch phone lookups for all enquiries
      const lookups: Record<string, PhoneLookup> = {};
      await Promise.all(
        response.data.enquiries.map(async (enquiry: DigitalEnquiry) => {
          try {
            const lookupRes = await axios.get(
              `/api/phone-lookup?phone=${encodeURIComponent(
                enquiry.whatsappNumber
              )}`
            );
            lookups[enquiry.whatsappNumber] = lookupRes.data;
          } catch (error) {
            console.error(
              `Failed to lookup phone ${enquiry.whatsappNumber}:`,
              error
            );
          }
        })
      );
      setPhoneLookups(lookups);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreateFormData = async () => {
    try {
      const [leadSourcesRes, categoriesRes] = await Promise.all([
        axios.get("/api/lead-sources"),
        axios.get("/api/categories"),
      ]);
      setLeadSources(leadSourcesRes.data.leadSources);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error("Failed to fetch form data:", error);
    }
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post("/api/digital-enquiry", {
        ...formData,
        leadSourceId: formData.leadSourceId || null,
        interestedModelId: formData.interestedModelId || null,
        interestedVariantId: formData.interestedVariantId || null,
      });

      if (response.data.success) {
        setCreateDialogOpen(false);
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
        fetchData();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to create enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const getLeadScopeColor = (scope: string) => {
    switch (scope) {
      case "hot":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "warm":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "cold":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Digital Enquiry
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Manage digital lead inquiries
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setCreateDialogOpen(true);
            fetchCreateFormData();
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Inquiry
        </Button>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No digital enquiries yet. Create your first inquiry to get
                started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enquiries.map((enquiry) => (
            <Card
              key={enquiry.id}
              className="overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent border-b">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg font-semibold truncate">
                      {enquiry.firstName} {enquiry.lastName}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-4 sm:pb-6 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">
                      Phone:
                    </span>
                    <span className="text-xs sm:text-sm">
                      {enquiry.whatsappNumber}
                    </span>
                  </div>
                  {enquiry.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">
                        Email:
                      </span>
                      <span className="text-xs sm:text-sm break-words">
                        {enquiry.email}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">
                      Created:
                    </span>
                    <span className="text-xs sm:text-sm">
                      {formatDate(enquiry.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={getLeadScopeColor(enquiry.leadScope)}
                    variant="secondary"
                  >
                    {enquiry.leadScope.toUpperCase()}
                  </Badge>
                  {enquiry.leadSource && (
                    <Badge variant="outline">{enquiry.leadSource.name}</Badge>
                  )}
                  {enquiry.model && (
                    <Badge variant="outline">
                      {enquiry.model.category.name} - {enquiry.model.name}
                    </Badge>
                  )}
                </div>
                {phoneLookups[enquiry.whatsappNumber] && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t">
                    {phoneLookups[enquiry.whatsappNumber].dailyWalkins && (
                      <Link
                        href="/dashboard/daily-walkins"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          Daily Walkins
                        </Badge>
                      </Link>
                    )}
                    {phoneLookups[enquiry.whatsappNumber].deliveryUpdate && (
                      <Link
                        href="/dashboard/delivery-update"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          Delivery Update
                        </Badge>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Enquiry Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Digital Enquiry</DialogTitle>
            <DialogDescription>
              Add a new digital lead inquiry
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEnquiry} className="space-y-4 mt-4">
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
                                                      interestedModelId:
                                                        model.id,
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
                onClick={() => setCreateDialogOpen(false)}
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
    </div>
  );
}
