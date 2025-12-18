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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Loader2,
  UserPlus,
  Search,
  UserCheck,
  ChevronDown,
  Calendar,
  X,
  Car,
  LogOut,
  Star,
  Check,
} from "lucide-react";
import Link from "next/link";

// Interfaces
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
  createdAt: string;
  sessions: Array<{
    id: string;
    status: string;
    reason: string;
    createdAt: string;
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

interface Session {
  id: string;
  reason: string;
  status: string;
  exitFeedback: string | null;
  exitRating: number | null;
  createdAt: string;
  visitor: {
    id: string;
    firstName: string;
    lastName: string;
    whatsappNumber: string;
  };
  testDrives: Array<{
    id: string;
    outcome: string | null;
    feedback: string | null;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
  visitorInterests?: Array<{
    id: string;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
}

interface PhoneLookup {
  dailyWalkins: boolean;
  digitalEnquiry: boolean;
  deliveryUpdate: boolean;
  visitorId: string | null;
  enquiryId: string | null;
  ticketId: string | null;
}

export default function DailyWalkinsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Visitors state
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false);
  const [existingVisitorDialogOpen, setExistingVisitorDialogOpen] =
    useState(false);
  const [visitorSubmitting, setVisitorSubmitting] = useState(false);
  const [visitorError, setVisitorError] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [foundVisitor, setFoundVisitor] = useState<any>(null);
  const [visitReason, setVisitReason] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [existingVisitorModelIds, setExistingVisitorModelIds] = useState<
    Array<string | { modelId: string; variantId?: string }>
  >([]);
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set()
  );
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {}
  );

  // Tab state
  const [activeTab, setActiveTab] = useState<"visitors" | "sessions">("visitors");
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  
  // Sessions state
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [testDriveDialogOpen, setTestDriveDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);

  // Test drive form
  const [testDriveData, setTestDriveData] = useState({
    modelId: "",
    variantId: "",
    outcome: "",
    feedback: "",
  });

  // Exit form
  const [exitData, setExitData] = useState({
    exitFeedback: "",
    exitRating: "",
  });

  // Date filter state
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });

  // Form data
  const [visitorFormData, setVisitorFormData] = useState({
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

  // Apply date filter
  useEffect(() => {
    applyDateFilter();
  }, [dateFilter, visitors]);

  const fetchData = async () => {
    try {
      const [categoriesRes, visitorsRes, sessionsRes] = await Promise.all([
        axios.get("/api/categories"),
        axios.get("/api/visitors"),
        axios.get("/api/sessions"),
      ]);

      setCategories(categoriesRes.data.categories);
      setVisitors(visitorsRes.data.visitors);
      setAllSessions(sessionsRes.data.sessions || []);

      // Fetch phone lookups for visitors
      const lookups: Record<string, PhoneLookup> = {};
      await Promise.all(
        visitorsRes.data.visitors.map(async (visitor: Visitor) => {
          try {
            const lookupRes = await axios.get(
              `/api/phone-lookup?phone=${encodeURIComponent(
                visitor.whatsappNumber
              )}`
            );
            lookups[visitor.whatsappNumber] = lookupRes.data;
          } catch (error) {
            console.error(
              `Failed to lookup phone ${visitor.whatsappNumber}:`,
              error
            );
          }
        })
      );
      setPhoneLookups(lookups);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await axios.get("/api/sessions");
      setAllSessions(response.data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setAllSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const applyDateFilter = () => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      setFilteredVisitors(visitors);
      return;
    }

    const startDate = dateFilter.startDate
      ? new Date(dateFilter.startDate)
      : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const filteredV = visitors.filter((visitor) => {
      const visitorDate = new Date(visitor.createdAt);
      if (startDate && visitorDate < startDate) return false;
      if (endDate && visitorDate > endDate) return false;
      return true;
    });

    setFilteredVisitors(filteredV);
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: "", endDate: "" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewSessions = async (visitor: Visitor) => {
    setSelectedVisitorId(visitor.id);
    setActiveTab("sessions");
    
    // Fetch all sessions if not already loaded
    if (allSessions.length === 0) {
      await fetchAllSessions();
    }
    
    // Find and expand the latest session for this visitor
    const visitorSessions = allSessions
      .filter((s: Session) => s.visitor.id === visitor.id)
      .sort((a: Session, b: Session) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    if (visitorSessions.length > 0) {
      // Expand the latest session
      setExpandedSessions(new Set([visitorSessions[0].id]));
    }
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    if (!testDriveData.modelId) {
      alert("Please select a vehicle model");
      return;
    }

    setSessionSubmitting(true);
    try {
      const [modelId, variantId] = testDriveData.modelId.includes(":")
        ? testDriveData.modelId.split(":")
        : [testDriveData.modelId, undefined];

      const response = await axios.post("/api/test-drives", {
        sessionId: selectedSession.id,
        modelId,
        variantId: variantId || testDriveData.variantId || undefined,
        outcome: testDriveData.outcome,
        feedback: testDriveData.feedback,
      });

      if (response.data.success) {
        setTestDriveDialogOpen(false);
        setTestDriveData({
          modelId: "",
          variantId: "",
          outcome: "",
          feedback: "",
        });
        // Refresh sessions
        await fetchAllSessions();
      } else {
        throw new Error(response.data.error || "Failed to create test drive");
      }
    } catch (error: any) {
      console.error("Failed to create test drive:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create test drive. Please try again.";
      alert(errorMessage);
    } finally {
      setSessionSubmitting(false);
    }
  };

  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    setSessionSubmitting(true);
    try {
      const response = await axios.post("/api/sessions/exit", {
        sessionId: selectedSession.id,
        ...exitData,
      });

      if (response.data.success) {
        setExitDialogOpen(false);
        setExitData({ exitFeedback: "", exitRating: "" });

        // Refresh sessions
        await fetchAllSessions();
      } else {
        throw new Error(response.data.error || "Failed to exit session");
      }
    } catch (error: any) {
      console.error("Failed to exit session:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to exit session. Please try again.";
      alert(errorMessage);
    } finally {
      setSessionSubmitting(false);
    }
  };

  // Visitor handlers
  const handleModelToggle = (modelId: string, variantId?: string) => {
    setVisitorFormData((prev) => {
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

  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitorSubmitting(true);
    setVisitorError("");

    try {
      const response = await axios.post("/api/visitors", visitorFormData);

      // Check if visitor was created successfully (even if WhatsApp message failed)
      if (response.data.success) {
        setVisitorFormData({
          firstName: "",
          lastName: "",
          whatsappNumber: "",
          email: "",
          address: "",
          reason: "",
          modelIds: [],
        });
        setVisitorDialogOpen(false);
        await fetchData();
        await fetchAllSessions();

        // Show warning if WhatsApp message failed but visitor was created
        if (response.data.message?.status === "failed") {
          console.warn(
            "Visitor created but WhatsApp message failed:",
            response.data.message.error
          );
        }
      } else {
        setVisitorError("Failed to create visitor");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to create visitor";
      setVisitorError(errorMessage);
      console.error("Error creating visitor:", err);
    } finally {
      setVisitorSubmitting(false);
    }
  };

  const handleSearchVisitor = async () => {
    if (!searchPhone.trim()) {
      setVisitorError("Please enter a phone number");
      return;
    }

    setSearching(true);
    setVisitorError("");
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
        setVisitorError(
          "Visitor not found. You can create a new visitor instead."
        );
      }
    } catch (err: any) {
      setVisitorError(err.response?.data?.error || "Failed to search visitor");
    } finally {
      setSearching(false);
    }
  };

  const handleCreateSessionForExistingVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundVisitor || !visitReason.trim()) {
      setVisitorError("Please enter a reason for visit");
      return;
    }

    setCreatingSession(true);
    setVisitorError("");

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
      await fetchData();
      await fetchAllSessions();
    } catch (err: any) {
      setVisitorError(err.response?.data?.error || "Failed to create session");
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
      {/* Header */}
      <div className="pb-2 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Daily Walkins
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
              Manage daily walk-in visitors
            </p>
          </div>

          {/* Date Filter Button */}
          <Dialog open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Filter by Date
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Filter by Date Range</DialogTitle>
                <DialogDescription>
                  Select a date range to filter visitors
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) =>
                      setDateFilter({
                        ...dateFilter,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) =>
                      setDateFilter({ ...dateFilter, endDate: e.target.value })
                    }
                    min={dateFilter.startDate}
                  />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <Button
                    variant="outline"
                    onClick={clearDateFilter}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filter
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "visitors" | "sessions")} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        {/* Visitors Tab */}
        <TabsContent value="visitors" className="space-y-6 mt-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Dialog open={visitorDialogOpen} onOpenChange={setVisitorDialogOpen}>
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
                  Fill in visitor details and select interested models. A
                  WhatsApp welcome message will be sent automatically.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleVisitorSubmit} className="space-y-4 mt-4">
                {visitorError && (
                  <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                    {visitorError}
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
                      value={visitorFormData.firstName}
                      onChange={(e) =>
                        setVisitorFormData({
                          ...visitorFormData,
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
                      value={visitorFormData.lastName}
                      onChange={(e) =>
                        setVisitorFormData({
                          ...visitorFormData,
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
                    value={visitorFormData.whatsappNumber}
                    onChange={(e) =>
                      setVisitorFormData({
                        ...visitorFormData,
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
                      value={visitorFormData.email}
                      onChange={(e) =>
                        setVisitorFormData({
                          ...visitorFormData,
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
                      value={visitorFormData.address}
                      onChange={(e) =>
                        setVisitorFormData({
                          ...visitorFormData,
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
                    value={visitorFormData.reason}
                    onChange={(e) =>
                      setVisitorFormData({
                        ...visitorFormData,
                        reason: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Interested Models
                  </Label>
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
                                    visitorFormData.modelIds.some(
                                      (id) =>
                                        (typeof id === "string" &&
                                          id === model.id) ||
                                        (typeof id === "object" &&
                                          id.modelId === model.id &&
                                          !id.variantId)
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
                                            open={expandedVariants.has(
                                              model.id
                                            )}
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
                                                  visitorFormData.modelIds.some(
                                                    (id) =>
                                                      typeof id === "object" &&
                                                      id.modelId === model.id &&
                                                      id.variantId ===
                                                        variant.id
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
                                                        checked={
                                                          isVariantSelected
                                                        }
                                                        onChange={() =>
                                                          handleModelToggle(
                                                            model.id,
                                                            variant.id
                                                          )
                                                        }
                                                        className="absolute opacity-0 cursor-pointer w-5 h-5"
                                                      />
                                                    </div>
                                                    <span className="text-sm text-foreground flex-1">
                                                      {model.name}.
                                                      {variant.name}
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

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVisitorDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={visitorSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {visitorSubmitting ? (
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
                  {visitorError && (
                    <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                      {visitorError}
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleCreateSessionForExistingVisitor}
                  className="space-y-4 mt-4"
                >
                  {visitorError && (
                    <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                      {visitorError}
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

        {filteredVisitors.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">
                  No visitors found. Create your first visitor to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVisitors.map((visitor) => {
              return (
                <Card
                  key={visitor.id}
                  className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewSessions(visitor)}
                >
                  <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent border-b">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-base sm:text-lg font-semibold truncate">
                            {visitor.firstName} {visitor.lastName}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium whitespace-nowrap"
                          >
                            {visitor.sessions.length} session
                            {visitor.sessions.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
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
                          {visitor.whatsappNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">
                          Last Visit:
                        </span>
                        <span className="text-xs sm:text-sm">
                          {visitor.sessions && visitor.sessions.length > 0
                            ? formatDate(
                                visitor.sessions.sort(
                                  (a, b) =>
                                    new Date(b.createdAt).getTime() -
                                    new Date(a.createdAt).getTime()
                                )[0].createdAt
                              )
                            : formatDate(visitor.createdAt)}
                        </span>
                      </div>
                      {visitor.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">
                            Email:
                          </span>
                          <span className="text-xs sm:text-sm break-words">
                            {visitor.email}
                          </span>
                        </div>
                      )}
                    </div>
                    {phoneLookups[visitor.whatsappNumber] && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t">
                        {phoneLookups[visitor.whatsappNumber]
                          .digitalEnquiry && (
                          <Link
                            href="/dashboard/digital-enquiry"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                            >
                              Digital Enquiry
                            </Badge>
                          </Link>
                        )}
                        {phoneLookups[visitor.whatsappNumber]
                          .deliveryUpdate && (
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
              );
            })}
          </div>
        )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6 mt-6">
          {/* Visitor Info Header (when opened from visitor) */}
          {selectedVisitorId && (() => {
            const visitor = visitors.find((v) => v.id === selectedVisitorId);
            if (!visitor) return null;
            const visitorSessions = allSessions.filter((s: Session) => s.visitor.id === selectedVisitorId);
            return (
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{visitor.firstName} {visitor.lastName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{visitor.whatsappNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {visitorSessions.length} session{visitorSessions.length !== 1 ? "s" : ""} • {visitorSessions.length} visit{visitorSessions.length !== 1 ? "s" : ""} to showroom
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVisitorId(null)}
                    >
                      Clear Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {loadingSessions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : allSessions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">No sessions found.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(selectedVisitorId 
                ? allSessions.filter((s: Session) => s.visitor.id === selectedVisitorId)
                : allSessions
              ).map((session: Session) => {
                const isExited = session.status === "exited";
                const hasTestDrives = session.testDrives.length > 0;
                const isExpanded = expandedSessions.has(session.id);

                return (
                  <Card key={session.id} className="overflow-hidden">
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={(open) => {
                        setExpandedSessions((prev) => {
                          const newSet = new Set(prev);
                          if (open) {
                            newSet.add(session.id);
                          } else {
                            newSet.delete(session.id);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-3 border-b cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm sm:text-base">
                                  {session.visitor.firstName} {session.visitor.lastName} - Session {formatDateTime(session.createdAt)}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  Status: {session.status}
                                  {!isExpanded && (
                                    <span className="ml-2">
                                      •{" "}
                                      {session.reason.length > 40
                                        ? session.reason.substring(0, 40) + "..."
                                        : session.reason}
                                    </span>
                                  )}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant={
                                isExited
                                  ? "default"
                                  : session.status === "test_drive"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs flex-shrink-0"
                            >
                              {session.status}
                            </Badge>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4 pt-4">
                          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <span className="text-xs font-semibold text-muted-foreground uppercase min-w-fit">
                              Reason:
                            </span>
                            <p className="text-xs sm:text-sm text-muted-foreground break-words flex-1">
                              {session.reason}
                            </p>
                          </div>

                          {session.visitorInterests &&
                            session.visitorInterests.length > 0 && (
                              <div>
                                <p className="text-xs sm:text-sm font-semibold mb-2">
                                  Vehicle Interests:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {session.visitorInterests.map((interest) => (
                                    <Badge
                                      key={interest.id}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {interest.model.category.name} -{" "}
                                      {interest.model.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                          {hasTestDrives && (
                            <div>
                              <p className="text-xs sm:text-sm font-semibold mb-2">
                                Test Drives ({session.testDrives.length}):
                              </p>
                              <div className="space-y-2">
                                {session.testDrives.map((td) => (
                                  <div
                                    key={td.id}
                                    className="text-xs sm:text-sm pl-4 border-l-2 border-primary/30"
                                  >
                                    <p className="font-medium">
                                      {td.model.category.name} - {td.model.name}
                                    </p>
                                    {td.outcome && (
                                      <p className="text-muted-foreground text-xs">
                                        Outcome: {td.outcome}
                                      </p>
                                    )}
                                    {td.feedback && (
                                      <p className="text-muted-foreground break-words text-xs mt-1">
                                        {td.feedback}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {session.exitFeedback && (
                            <div>
                              <p className="text-xs sm:text-sm font-semibold mb-1">
                                Exit Feedback:
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                {session.exitFeedback}
                              </p>
                              {session.exitRating && (
                                <div className="flex items-center gap-1 mt-2">
                                  {Array.from({
                                    length: session.exitRating,
                                  }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {!isExited && (
                            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSession(session);
                                  setTestDriveDialogOpen(true);
                                }}
                                className="w-full sm:w-auto text-xs sm:text-sm"
                              >
                                <Car className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Add Test Drive
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSession(session);
                                  setExitDialogOpen(true);
                                }}
                                className="w-full sm:w-auto text-xs sm:text-sm"
                              >
                                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Exit Session
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Test Drive Dialog */}
      <Dialog open={testDriveDialogOpen} onOpenChange={setTestDriveDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">
              Add Test Drive
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Record a test drive and send a follow-up WhatsApp message.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTestDriveSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="modelId" className="text-sm">
                Vehicle Model *
              </Label>
              <Select
                value={testDriveData.modelId}
                onValueChange={(value) => {
                  setTestDriveData({
                    ...testDriveData,
                    modelId: value,
                    variantId: "",
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectGroup key={cat.id}>
                      <SelectLabel>{cat.name}</SelectLabel>
                      {cat.models.map((model) => {
                        const hasVariants =
                          model.variants && model.variants.length > 0;
                        if (!hasVariants) {
                          return (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name} {model.year ? `(${model.year})` : ""}
                            </SelectItem>
                          );
                        }
                        return (
                          <div key={model.id}>
                            <SelectItem value={model.id}>
                              {model.name} (Base){" "}
                              {model.year ? `(${model.year})` : ""}
                            </SelectItem>
                            {model.variants?.map((variant) => (
                              <SelectItem
                                key={variant.id}
                                value={`${model.id}:${variant.id}`}
                              >
                                {model.name}.{variant.name}{" "}
                                {model.year ? `(${model.year})` : ""}
                              </SelectItem>
                            ))}
                          </div>
                        );
                      })}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome" className="text-sm">
                Outcome
              </Label>
              <Select
                value={testDriveData.outcome}
                onValueChange={(value) =>
                  setTestDriveData({
                    ...testDriveData,
                    outcome: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm">
                Feedback
              </Label>
              <Textarea
                id="feedback"
                value={testDriveData.feedback}
                onChange={(e) =>
                  setTestDriveData({
                    ...testDriveData,
                    feedback: e.target.value,
                  })
                }
                className="min-h-24"
                placeholder="Add feedback about the test drive..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTestDriveDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sessionSubmitting}
                className="w-full sm:w-auto"
              >
                {sessionSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save & Send Message"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exit Session Dialog */}
      <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">
              Exit Session
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Mark session as completed and send a thank you WhatsApp message.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExitSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="exitFeedback" className="text-sm">
                Feedback
              </Label>
              <Textarea
                id="exitFeedback"
                placeholder="Any feedback from the visitor?"
                value={exitData.exitFeedback}
                onChange={(e) =>
                  setExitData({
                    ...exitData,
                    exitFeedback: e.target.value,
                  })
                }
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exitRating" className="text-sm">
                Rating (1-5)
              </Label>
              <Select
                value={exitData.exitRating}
                onValueChange={(value) =>
                  setExitData({
                    ...exitData,
                    exitRating: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setExitDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sessionSubmitting}
                className="w-full sm:w-auto"
              >
                {sessionSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Exit & Send Message"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
