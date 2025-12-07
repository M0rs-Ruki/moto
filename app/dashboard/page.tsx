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
import { Plus, Loader2, UserPlus, Search, UserCheck } from "lucide-react";
import DashboardLoading from "./loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VehicleModel {
  id: string;
  name: string;
  year: number | null;
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
  const [existingVisitorDialogOpen, setExistingVisitorDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [foundVisitor, setFoundVisitor] = useState<any>(null);
  const [visitReason, setVisitReason] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [existingVisitorModelIds, setExistingVisitorModelIds] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    email: "",
    address: "",
    reason: "",
    modelIds: [] as string[],
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

  const handleModelToggle = (modelId: string) => {
    setFormData((prev) => ({
      ...prev,
      modelIds: prev.modelIds.includes(modelId)
        ? prev.modelIds.filter((id) => id !== modelId)
        : [...prev.modelIds, modelId],
    }));
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
    const sessionId = visitor.sessions && visitor.sessions.length > 0 
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
      const response = await axios.get(`/api/visitors?phone=${encodeURIComponent(searchPhone.trim())}`);
      
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
        router.push(`/dashboard/sessions?sessionId=${response.data.session.id}`);
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

  const handleExistingVisitorModelToggle = (modelId: string) => {
    setExistingVisitorModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
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
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
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
                <Label className="text-sm">Interested Models</Label>
                {categories.length === 0 ? (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No vehicle models available. Please add categories and
                    models in Settings.
                  </p>
                ) : (
                  <div className="space-y-3 border rounded-lg p-3 sm:p-4 max-h-64 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <h4 className="font-semibold text-sm mb-2">
                          {category.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {category.models.map((model) => (
                            <Badge
                              key={model.id}
                              variant={
                                formData.modelIds.includes(model.id)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer text-xs sm:text-sm"
                              onClick={() => handleModelToggle(model.id)}
                            >
                              {model.name} {model.year ? `(${model.year})` : ""}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
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

        <Dialog open={existingVisitorDialogOpen} onOpenChange={setExistingVisitorDialogOpen}>
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
                Search for an existing visitor by phone number to create a new visit session.
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
              <form onSubmit={handleCreateSessionForExistingVisitor} className="space-y-4 mt-4">
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Visitor Information</h3>
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
                      <span className="text-muted-foreground text-xs">Name:</span>
                      <p className="font-medium">
                        {foundVisitor.firstName} {foundVisitor.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Phone:</span>
                      <p className="font-medium">{foundVisitor.whatsappNumber}</p>
                    </div>
                    {foundVisitor.email && (
                      <div>
                        <span className="text-muted-foreground text-xs">Email:</span>
                        <p className="font-medium">{foundVisitor.email}</p>
                      </div>
                    )}
                    {foundVisitor.address && (
                      <div>
                        <span className="text-muted-foreground text-xs">Address:</span>
                        <p className="font-medium">{foundVisitor.address}</p>
                      </div>
                    )}
                  </div>
                  {foundVisitor.interests && foundVisitor.interests.length > 0 && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-xs">Previous Interests:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {foundVisitor.interests.map((interest: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest.categoryName} - {interest.modelName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">
                    Vehicle Interests (Optional - Update if changed)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Select vehicles the visitor is interested in for this visit. Previous interests are pre-selected.
                  </p>
                  {categories.length === 0 ? (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No vehicle models available. Please add categories and models in Settings.
                    </p>
                  ) : (
                    <div className="space-y-3 border rounded-lg p-3 sm:p-4 max-h-64 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category.id}>
                          <h4 className="font-semibold text-sm mb-2">
                            {category.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {category.models.map((model) => {
                              const isSelected = existingVisitorModelIds.includes(model.id);
                              const wasPreviousInterest = foundVisitor.interests?.some(
                                (i: any) => i.modelId === model.id
                              );
                              return (
                                <Badge
                                  key={model.id}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`cursor-pointer text-xs sm:text-sm ${
                                    wasPreviousInterest && !isSelected
                                      ? "border-primary/50 bg-primary/5"
                                      : ""
                                  }`}
                                  onClick={() => handleExistingVisitorModelToggle(model.id)}
                                >
                                  {model.name} {model.year ? `(${model.year})` : ""}
                                  {wasPreviousInterest && (
                                    <span className="ml-1 text-xs opacity-70">
                                      (Previous)
                                    </span>
                                  )}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ))}
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
                        Create {foundVisitor.sessionCount === 1
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
