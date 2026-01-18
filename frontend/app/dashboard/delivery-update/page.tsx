"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { getCachedData, setCachedData } from "@/lib/cache";
import { usePermissions } from "@/contexts/permissions";
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
  const { hasPermission } = usePermissions();

  if (!hasPermission("deliveryUpdate")) {
    return (
      <div className="space-y-8">
        <div className="pb-2 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Delivery Update
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base">You don't have permission to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [tickets, setTickets] = useState<DeliveryTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(20); // Show 20 initially
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {}
  );
  const [sendingCompletion, setSendingCompletion] = useState<Record<string, boolean>>({});
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

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
    mountedRef.current = true;
    
    // Try to load from cache first - use longer cache duration
    const cached = getCachedData<DeliveryTicket[]>("cache_delivery_tickets", 120000); // 2 minutes
    if (cached) {
      setTickets(cached);
      setLoading(false);
      
      // Check cache age to decide if we need to refresh
      try {
        const cacheEntry = JSON.parse(sessionStorage.getItem("cache_delivery_tickets") || '{}');
        const cacheAge = Date.now() - (cacheEntry.timestamp || 0);
        
        // If cache is fresh (< 30 seconds), don't fetch
        if (cacheAge < 30000) {
          // Cache is fresh, no need to fetch
        } else {
          // Cache is stale (> 30 seconds), refresh in background
          if (mountedRef.current && !fetchingRef.current) {
            setTimeout(() => {
              if (mountedRef.current && !fetchingRef.current) {
                fetchTickets(0, false, true); // Background fetch
              }
            }, 500);
          }
        }
      } catch {
        // If cache parsing fails, fetch normally
        fetchTickets(0, false);
      }
    } else {
      // No cache, fetch normally
      fetchTickets(0, false);
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchCreateFormData = async () => {
    try {
      const response = await apiClient.get("/categories");
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
      const response = await apiClient.post("/delivery-tickets", {
        ...formData,
        modelId: formData.modelId || null,
        variantId: formData.variantId || null,
      });

      if (response.data.success) {
        const newTicket = response.data.ticket;

        // 1. IMMEDIATE UI UPDATE - Add ticket to list immediately
        setTickets(prev => [newTicket, ...prev]);

        // 2. UPDATE CACHE
        const cachedTickets = getCachedData<DeliveryTicket[]>(
          "cache_delivery_tickets",
          120000
        );
        if (cachedTickets) {
          setCachedData("cache_delivery_tickets", [newTicket, ...cachedTickets]);
        } else {
          setCachedData("cache_delivery_tickets", [newTicket]);
        }

        // 3. BACKGROUND REFETCH - Ensure consistency
        fetchTickets(0, false, true); // Background fetch

        // Reset form and close dialog
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
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTickets = async (skip: number = 0, append: boolean = false, background: boolean = false) => {
    // Prevent duplicate fetches
    if (fetchingRef.current && !append) return;
    if (!append) fetchingRef.current = true;
    
    try {
      if (!append && !background) {
        setLoading(true);
      } else if (append) {
        setLoadingMore(true);
      }

      const response = await apiClient.get(`/delivery-tickets?limit=20&skip=${skip}`);
      
      // Append or replace tickets
      if (append) {
        setTickets([...tickets, ...response.data.tickets]);
      } else {
        setTickets(response.data.tickets);
        setDisplayedCount(20);
        // Cache the data
        setCachedData("cache_delivery_tickets", response.data.tickets);
      }
      
      setHasMore(response.data.hasMore || false);
      setTotalTickets(response.data.total || response.data.tickets.length);

      // Only fetch phone lookups when loading more data (not on initial load)
      // Use batch lookup to avoid multiple API calls
      if (append && response.data.tickets.length > 0) {
        const newTickets = response.data.tickets;
        const lookups: Record<string, PhoneLookup> = { ...phoneLookups };
        
        try {
          // Extract unique phone numbers
          const phoneNumbers = [...new Set(newTickets.map((t: DeliveryTicket) => t.whatsappNumber))];
          
          // Batch lookup all phones in one request
          const lookupRes = await apiClient.post('/phone-lookup', {
            phones: phoneNumbers
          });
          
          // Merge batch results into lookups
          Object.assign(lookups, lookupRes.data);
          setPhoneLookups(lookups);
      } catch (error) {
        console.error('Failed to batch lookup phones:', error);
        // Don't break the page if phone lookup fails
      }
    }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      if (!append) fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const handleLoadMore = async () => {
    // If we have more tickets than displayed, just show more from what we already have
    if (tickets.length > displayedCount) {
      setDisplayedCount(Math.min(displayedCount + 20, tickets.length));
    } 
    // Otherwise, fetch more from backend if available
    else if (hasMore) {
      const currentSkip = tickets.length;
      await fetchTickets(currentSkip, true);
      // Increase displayed count after new data is loaded
      setDisplayedCount(displayedCount + 20);
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
      const response = await apiClient.post(`/delivery-tickets/${ticketId}/send-completion`);
      if (response.data.success) {
        // Refresh tickets to get updated completionSent status from database
        await fetchTickets(0, false);
      } else {
        alert(response.data.message?.error || "Failed to send completion message");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage = err.response?.data?.error || "Failed to send completion message";
      alert(errorMessage);
      // If error is about already sent, refresh to update UI
      if (errorMessage.includes("already been sent")) {
        await fetchTickets(0, false);
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
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Ticket
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Delivery Date
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Model
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.slice(0, displayedCount).map((ticket) => {
                      const initials = `${ticket.firstName.charAt(0)}${ticket.lastName.charAt(0)}`.toUpperCase();
                      const daysUntil = getDaysUntilDelivery(ticket.deliveryDate);
                      const hasPendingMessage = ticket.scheduledMessages.length > 0;
                      const deliveryDate = new Date(ticket.deliveryDate).toLocaleDateString();
                      
                      return (
                        <tr
                          key={ticket.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          {/* Ticket Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {ticket.firstName} {ticket.lastName}
                                </p>
                                {ticket.email && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {ticket.email}
                                  </p>
                                )}
                                {ticket.description && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {ticket.description.length > 50
                                      ? ticket.description.substring(0, 50) + "..."
                                      : ticket.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact Column */}
                          <td className="py-3 px-4">
                            <p className="text-sm">
                              {ticket.whatsappNumber || "No phone"}
                            </p>
                            {phoneLookups[ticket.whatsappNumber] && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {phoneLookups[ticket.whatsappNumber].dailyWalkins && (
                                  <Link href="/dashboard/daily-walkins">
                                    <Badge
                                      variant="outline"
                                      className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                    >
                                      Walkins
                                    </Badge>
                                  </Link>
                                )}
                                {phoneLookups[ticket.whatsappNumber].digitalEnquiry && (
                                  <Link href="/dashboard/digital-enquiry">
                                    <Badge
                                      variant="outline"
                                      className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                    >
                                      Digital
                                    </Badge>
                                  </Link>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Delivery Date Column */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <p className="text-sm">{deliveryDate}</p>
                              </div>
                              {daysUntil >= 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {daysUntil === 0
                                    ? "Today"
                                    : daysUntil === 1
                                    ? "Tomorrow"
                                    : `${daysUntil} days`}
                                </Badge>
                              )}
                            </div>
                          </td>

                          {/* Model Column */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">
                                {ticket.model.category.name}
                              </p>
                              <p className="text-sm font-medium">
                                {ticket.model.name}
                              </p>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {ticket.messageSent ? (
                                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">
                                  <Send className="h-3 w-3 mr-1" />
                                  Sent
                                </Badge>
                              ) : hasPendingMessage ? (
                                <Badge variant="secondary" className="text-xs">Scheduled</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Not Sent</Badge>
                              )}
                              {ticket.completionSent || ticket.status === "closed" ? (
                                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs mt-1">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Closed
                                </Badge>
                              ) : null}
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="py-3 px-4">
                            {ticket.completionSent || ticket.status === "closed" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-400 border-green-300 dark:border-green-900"
                              >
                                <CheckCircle className="mr-2 h-3 w-3" />
                                Closed
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
                                className="text-xs"
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {(hasMore || tickets.length > displayedCount) ? (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full sm:w-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `See More (${hasMore ? totalTickets - displayedCount : tickets.length - displayedCount} remaining)`
                )}
              </Button>
            </div>
          ) : null}
        </>
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
