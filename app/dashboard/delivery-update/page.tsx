"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Loader2, Package, Calendar, Send, ChevronDown, CheckCircle } from "lucide-react";
import Link from "next/link";

interface DeliveryTicket {
  id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string | null;
  description: string | null;
  deliveryDate: string;
  messageSent: boolean;
  completionSent: boolean;
  status: string;
  model: {
    name: string;
    category: {
      name: string;
    };
  };
  scheduledMessages: Array<{
    id: string;
    scheduledFor: string;
    status: string;
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

export default function DeliveryUpdatePage() {
  const [tickets, setTickets] = useState<DeliveryTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {}
  );
  const [sendingCompletion, setSendingCompletion] = useState<Record<string, boolean>>({});

  // Create ticket dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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
    description: "",
    deliveryDate: "",
    modelId: "",
    variantId: "",
    scheduleOption: "d3", // d3, d2, d1, or "now"
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchCreateFormData = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.post("/api/delivery-tickets", {
        ...formData,
        modelId: formData.modelId || null,
        variantId: formData.variantId || null,
      });

      setCreateDialogOpen(false);
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
      fetchTickets();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get("/api/delivery-tickets");
      setTickets(response.data.tickets);

      // Fetch phone lookups for all tickets
      const lookups: Record<string, PhoneLookup> = {};
      await Promise.all(
        response.data.tickets.map(async (ticket: DeliveryTicket) => {
          try {
            const lookupRes = await axios.get(
              `/api/phone-lookup?phone=${encodeURIComponent(
                ticket.whatsappNumber
              )}`
            );
            lookups[ticket.whatsappNumber] = lookupRes.data;
          } catch (error) {
            console.error(
              `Failed to lookup phone ${ticket.whatsappNumber}:`,
              error
            );
          }
        })
      );
      setPhoneLookups(lookups);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getDaysUntilDelivery = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSendCompletion = async (ticketId: string) => {
    // Find the ticket to check if already sent or closed
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) {
      alert("Ticket not found");
      return;
    }

    // Prevent sending if already sent, closed, or currently sending
    if (ticket.completionSent || ticket.status === "closed" || sendingCompletion[ticketId]) {
      alert("Completion message has already been sent for this ticket. Ticket is closed.");
      return;
    }

    setSendingCompletion((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const response = await axios.post(`/api/delivery-tickets/${ticketId}/send-completion`);
      if (response.data.success) {
        // Refresh tickets to get updated completionSent status from database
        await fetchTickets();
      } else {
        alert(response.data.message?.error || "Failed to send completion message");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage = err.response?.data?.error || "Failed to send completion message";
      alert(errorMessage);
      // If error is about already sent, refresh to update UI
      if (errorMessage.includes("already been sent")) {
        await fetchTickets();
      }
    } finally {
      setSendingCompletion((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Delivery Update
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Manage delivery tickets and scheduled reminders
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
          Create Ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No delivery tickets yet. Create your first ticket to get
                started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => {
            const daysUntil = getDaysUntilDelivery(ticket.deliveryDate);
            const hasPendingMessage = ticket.scheduledMessages.length > 0;

            return (
              <Card
                key={ticket.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    {ticket.firstName} {ticket.lastName}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {ticket.whatsappNumber}
                  </CardDescription>
                  {phoneLookups[ticket.whatsappNumber] && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {phoneLookups[ticket.whatsappNumber].dailyWalkins && (
                        <Link href="/dashboard/daily-walkins">
                          <Badge
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                          >
                            Daily Walkins
                          </Badge>
                        </Link>
                      )}
                      {phoneLookups[ticket.whatsappNumber].digitalEnquiry && (
                        <Link href="/dashboard/digital-enquiry">
                          <Badge
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                          >
                            Digital Enquiry
                          </Badge>
                        </Link>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(ticket.deliveryDate).toLocaleDateString()}
                      </span>
                      {daysUntil >= 0 && (
                        <Badge variant="outline">
                          {daysUntil === 0
                            ? "Today"
                            : daysUntil === 1
                            ? "Tomorrow"
                            : `${daysUntil} days`}
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {ticket.model.category.name} - {ticket.model.name}
                    </div>
                    {ticket.description && (
                      <div className="text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {ticket.messageSent ? (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          <Send className="h-3 w-3 mr-1" />
                          Sent
                        </Badge>
                      ) : hasPendingMessage ? (
                        <Badge variant="secondary">Scheduled</Badge>
                      ) : (
                        <Badge variant="outline">Not Sent</Badge>
                      )}
                    </div>
                    <div className="pt-3 border-t">
                      {ticket.completionSent || ticket.status === "closed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="w-full text-xs bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-400 border-green-300 dark:border-green-900"
                        >
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Ticket Closed
                        </Button> 
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendCompletion(ticket.id);
                          }}
                          disabled={sendingCompletion[ticket.id] || ticket.completionSent}
                          className="w-full text-xs"
                        >
                          {sendingCompletion[ticket.id] ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Send Completion
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Delivery Ticket</DialogTitle>
            <DialogDescription>
              Add a new delivery client
            </DialogDescription>
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
                <Label htmlFor="deliveryDate" className="text-sm font-medium">
                  Delivery Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10 w-full cursor-pointer"
                    style={{
                      colorScheme: "light dark",
                    }}
                  />
                </div>
                {formData.deliveryDate && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {new Date(formData.deliveryDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduleOption" className="text-sm font-medium">
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
                  <SelectTrigger className="w-full">
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
                    {formData.scheduleOption === "d3" && "Message will be sent 3 days before delivery"}
                    {formData.scheduleOption === "d2" && "Message will be sent 2 days before delivery"}
                    {formData.scheduleOption === "d1" && "Message will be sent 1 day before delivery"}
                    {(() => {
                      const deliveryDate = new Date(formData.deliveryDate);
                      const days = formData.scheduleOption === "d3" ? 3 : formData.scheduleOption === "d2" ? 2 : 1;
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
                  "Create Ticket"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
