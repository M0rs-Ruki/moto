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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Loader2, Plus, ChevronDown, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DigitalEnquirySession {
  id: string;
  notes: string | null;
  status: string;
  createdAt: string;
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
  sessions: DigitalEnquirySession[];
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

export default function DigitalEnquirySessionsPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<DigitalEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedEnquiries, setExpandedEnquiries] = useState<Set<string>>(
    new Set()
  );
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>({});

  const [sessionData, setSessionData] = useState({
    digitalEnquiryId: "",
    notes: "",
    status: "active",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/digital-enquiry/sessions");
      setEnquiries(response.data.enquiries);
      
      // Fetch phone lookups for all enquiries
      const lookups: Record<string, PhoneLookup> = {};
      await Promise.all(
        response.data.enquiries.map(async (enquiry: DigitalEnquiry) => {
          try {
            const lookupRes = await axios.get(
              `/api/phone-lookup?phone=${encodeURIComponent(enquiry.whatsappNumber)}`
            );
            lookups[enquiry.whatsappNumber] = lookupRes.data;
          } catch (error) {
            console.error(`Failed to lookup phone ${enquiry.whatsappNumber}:`, error);
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

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/digital-enquiry/sessions", sessionData);
      setSessionData({ digitalEnquiryId: "", notes: "", status: "active" });
      setSessionDialogOpen(false);
      setSelectedEnquiryId(null);
      fetchData();
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openSessionDialog = (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
    setSessionData({ digitalEnquiryId: enquiryId, notes: "", status: "active" });
    setSessionDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "closed":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  const getLeadScopeColor = (scope: string) => {
    switch (scope) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
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
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Digital Enquiry Sessions
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
              Track follow-up sessions and interactions for digital enquiries
            </p>
          </div>
          {enquiries.length > 0 && (
            <Link href="/dashboard/digital-enquiry">
              <Badge
                variant="secondary"
                className="text-sm font-medium px-3 py-1.5 cursor-pointer hover:bg-primary/10 transition-colors"
              >
                {enquiries.length} {enquiries.length === 1 ? "Inquiry" : "Inquiries"}
              </Badge>
            </Link>
          )}
        </div>
      </div>

      <Dialog open={sessionDialogOpen} onOpenChange={(open) => {
        setSessionDialogOpen(open);
        if (!open) {
          setSelectedEnquiryId(null);
          setSessionData({ digitalEnquiryId: "", notes: "", status: "active" });
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Add a new follow-up session for a digital enquiry
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSession} className="space-y-4 mt-4">
            {!selectedEnquiryId && (
              <div className="space-y-2">
                <Label htmlFor="enquiry">Select Enquiry</Label>
                <Select
                  value={sessionData.digitalEnquiryId}
                  onValueChange={(value) =>
                    setSessionData({ ...sessionData, digitalEnquiryId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an enquiry" />
                  </SelectTrigger>
                  <SelectContent>
                    {enquiries.map((enquiry) => (
                      <SelectItem key={enquiry.id} value={enquiry.id}>
                        {enquiry.firstName} {enquiry.lastName} - {enquiry.whatsappNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={sessionData.status}
                  onValueChange={(value) =>
                    setSessionData({ ...sessionData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={sessionData.notes}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, notes: e.target.value })
                  }
                  placeholder="Add session notes or follow-up information..."
                  rows={4}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSessionDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No enquiries yet. Create your first enquiry to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => {
            const isExpanded = expandedEnquiries.has(enquiry.id);
            const sessionCount = enquiry.sessions.length;

            return (
              <Card
                key={enquiry.id}
                className="hover:shadow-lg transition-shadow"
              >
                <Collapsible
                  open={isExpanded}
                  onOpenChange={(open) => {
                    setExpandedEnquiries((prev) => {
                      const newSet = new Set(prev);
                      if (open) {
                        newSet.add(enquiry.id);
                      } else {
                        newSet.delete(enquiry.id);
                      }
                      return newSet;
                    });
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-base sm:text-lg truncate">
                            {enquiry.firstName} {enquiry.lastName}
                          </CardTitle>
                          {sessionCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
                            </Badge>
                          )}
                          <Badge
                            className={getLeadScopeColor(enquiry.leadScope)}
                            variant="secondary"
                          >
                            {enquiry.leadScope.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs sm:text-sm">
                          {enquiry.whatsappNumber}
                        </CardDescription>
                        {phoneLookups[enquiry.whatsappNumber] && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {phoneLookups[enquiry.whatsappNumber].dailyWalkins && (
                              <Link href="/dashboard/daily-walkins/visitors">
                                <Badge
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                >
                                  Daily Walkins
                                </Badge>
                              </Link>
                            )}
                            {phoneLookups[enquiry.whatsappNumber].deliveryUpdate && (
                              <Link href="/dashboard/delivery-update">
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
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openSessionDialog(enquiry.id);
                          }}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Session
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      <div className="space-y-2 text-xs sm:text-sm">
                        {enquiry.email && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Email:</span> {enquiry.email}
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          <span className="font-medium">Reason:</span> {enquiry.reason}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {enquiry.leadSource && (
                            <Badge variant="outline">
                              {enquiry.leadSource.name}
                            </Badge>
                          )}
                          {enquiry.model && (
                            <Badge variant="outline">
                              {enquiry.model.category.name} - {enquiry.model.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground pt-2">
                          Enquiry created: {new Date(enquiry.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {enquiry.sessions.length > 0 && (
                        <div className="border-t pt-4 space-y-3">
                          <h4 className="text-sm font-semibold">Sessions ({sessionCount})</h4>
                          {enquiry.sessions.map((session) => (
                            <div
                              key={session.id}
                              className="border rounded-lg p-3 bg-muted/30"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge
                                  className={getStatusColor(session.status)}
                                  variant="secondary"
                                >
                                  {session.status.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(session.createdAt).toLocaleString()}
                                </span>
                              </div>
                              {session.notes && (
                                <p className="text-sm text-muted-foreground">
                                  {session.notes}
                                </p>
                              )}
                            </div>
                          ))}
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
    </div>
  );
}

