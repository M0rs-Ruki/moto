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

export default function VisitorsPage() {
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

  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set()
  );
  const [existingVisitorModelSearchQuery, setExistingVisitorModelSearchQuery] =
    useState("");
  const [openExistingVisitorCategories, setOpenExistingVisitorCategories] =
    useState<Set<string>>(new Set());

  // Track which visitor cards are expanded (default: all closed)
  const [expandedVisitors, setExpandedVisitors] = useState<Set<string>>(
    new Set()
  );

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
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create visitor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisitorClick = (visitor: Visitor) => {
    const sessionId =
      visitor.sessions && visitor.sessions.length > 0
        ? visitor.sessions[0].id
        : null;

    if (sessionId) {
      router.push(`/dashboard/daily-walkins/sessions?sessionId=${sessionId}`);
    } else {
      router.push(`/dashboard/daily-walkins/sessions?visitorId=${visitor.id}`);
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
      setError("Please enter a reason for visit");
      return;
    }

    setCreatingSession(true);
    setError("");

    try {
      await axios.post("/api/visitors/session", {
        visitorId: foundVisitor.id,
        reason: visitReason,
        modelIds: existingVisitorModelIds,
      });

      setExistingVisitorDialogOpen(false);
      setSearchPhone("");
      setFoundVisitor(null);
      setVisitReason("");
      setExistingVisitorModelIds([]);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create session");
    } finally {
      setCreatingSession(false);
    }
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
          Visitors
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Manage daily walk-in visitors
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  Reason for Visit *
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Why are they visiting?"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Interested Models</Label>
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                  {categories.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No models available. Add models in Global Settings.
                    </p>
                  ) : (
                    <div className="space-y-2">
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
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-2 hover:bg-muted rounded text-sm">
                              <span>{category.name}</span>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 space-y-1 mt-1">
                              {category.models.map((model) => (
                                <div key={model.id} className="space-y-1">
                                  <label className="flex items-center space-x-2 p-1 hover:bg-muted rounded cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.modelIds.some(
                                        (id) =>
                                          (typeof id === "string" &&
                                            id === model.id) ||
                                          (typeof id === "object" &&
                                            id.modelId === model.id &&
                                            !id.variantId)
                                      )}
                                      onChange={() =>
                                        handleModelToggle(model.id)
                                      }
                                      className="rounded"
                                    />
                                    <span className="text-sm">
                                      {model.name}
                                      {model.year && ` (${model.year})`}
                                    </span>
                                  </label>
                                  {model.variants &&
                                    model.variants.length > 0 && (
                                      <div className="pl-6 space-y-1">
                                        {model.variants.map((variant) => (
                                          <label
                                            key={variant.id}
                                            className="flex items-center space-x-2 p-1 hover:bg-muted rounded cursor-pointer"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={formData.modelIds.some(
                                                (id) =>
                                                  typeof id === "object" &&
                                                  id.modelId === model.id &&
                                                  id.variantId === variant.id
                                              )}
                                              onChange={() =>
                                                handleModelToggle(
                                                  model.id,
                                                  variant.id
                                                )
                                              }
                                              className="rounded"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                              {model.name}.{variant.name}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
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

        <Dialog
          open={existingVisitorDialogOpen}
          onOpenChange={setExistingVisitorDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Create Session for Existing Visitor</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {foundVisitor
                  ? `${foundVisitor.firstName} ${foundVisitor.lastName} - ${foundVisitor.whatsappNumber}`
                  : "Search for a visitor by phone number"}
              </DialogDescription>
            </DialogHeader>

            {!foundVisitor ? (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="searchPhone" className="text-sm">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="searchPhone"
                      placeholder="+1234567890"
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleSearchVisitor}
                      disabled={searching}
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
              </div>
            ) : (
              <form
                onSubmit={handleCreateSessionForExistingVisitor}
                className="space-y-4 mt-4"
              >
                {error && (
                  <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="visitReason" className="text-sm">
                    Reason for Visit *
                  </Label>
                  <Textarea
                    id="visitReason"
                    placeholder="Why are they visiting?"
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setExistingVisitorDialogOpen(false);
                      setFoundVisitor(null);
                      setVisitReason("");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creatingSession}
                    className="w-full sm:w-auto"
                  >
                    {creatingSession ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Create Session
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={() => setExistingVisitorDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Existing Visitor
        </Button>
      </div>

      {visitors.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No visitors yet. Create your first visitor to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitors.map((visitor) => {
            const isExpanded = expandedVisitors.has(visitor.id);
            return (
              <Card
                key={visitor.id}
                className="overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <Collapsible
                  open={isExpanded}
                  onOpenChange={(open) => {
                    setExpandedVisitors((prev) => {
                      const newSet = new Set(prev);
                      if (open) {
                        newSet.add(visitor.id);
                      } else {
                        newSet.delete(visitor.id);
                      }
                      return newSet;
                    });
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent border-b cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-base sm:text-lg font-semibold truncate">
                              {visitor.firstName} {visitor.lastName}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
                              {visitor.sessions.length} session{visitor.sessions.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-1">
                            <CardDescription className="text-xs sm:text-sm">
                              {visitor.whatsappNumber}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-4 pb-4 sm:pb-6">
                      {visitor.email && (
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <span className="text-xs font-semibold text-muted-foreground uppercase min-w-fit">
                            Email:
                          </span>
                          <p className="text-xs sm:text-sm break-words flex-1">
                            {visitor.email}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {visitor.sessions.length} session
                          {visitor.sessions.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      {visitor.interests.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            Interested in:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {visitor.interests.map((interest, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {interest.model.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="pt-2 border-t">
                        <Button
                          size="sm"
                          variant="default"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisitorClick(visitor);
                          }}
                        >
                          View Sessions
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

