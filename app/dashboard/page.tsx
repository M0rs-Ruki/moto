"use client";

import { useState, useEffect } from "react";
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
import { Plus, Loader2, UserPlus } from "lucide-react";
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
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
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
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base sm:text-lg truncate">
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
