"use client";

import { useState } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Send, CheckCircle, Loader2, Package } from "lucide-react";
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

interface DeliveryTicketsTableProps {
  tickets: DeliveryTicket[];
  phoneLookups: Record<string, PhoneLookup>;
  onRefresh: () => void;
}

export default function DeliveryTicketsTable({
  tickets,
  phoneLookups,
  onRefresh,
}: DeliveryTicketsTableProps) {
  const [sendingCompletion, setSendingCompletion] = useState<
    Record<string, boolean>
  >({});

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
      toast.error("Ticket not found");
      return;
    }

    // Prevent sending if already sent, closed, or currently sending
    if (
      ticket.completionSent ||
      ticket.status === "closed" ||
      sendingCompletion[ticketId]
    ) {
      toast.warning(
        "Completion message has already been sent for this ticket. Ticket is closed.",
      );
      return;
    }

    setSendingCompletion((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const response = await apiClient.post(
        `/delivery-tickets/${ticketId}/send-completion`,
      );
      if (response.data.success) {
        // Refresh tickets to get updated completionSent status from database
        onRefresh();
      } else {
        toast.error(
          response.data.message?.error || "Failed to send completion message",
        );
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage =
        err.response?.data?.error || "Failed to send completion message";
      toast.error(errorMessage);
      // If error is about already sent, refresh to update UI
      if (errorMessage.includes("already been sent")) {
        onRefresh();
      }
    } finally {
      setSendingCompletion((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">
              No delivery tickets yet. Create your first ticket to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
              {tickets.map((ticket) => {
                const initials =
                  `${ticket.firstName.charAt(0)}${ticket.lastName.charAt(0)}`.toUpperCase();
                const daysUntil = getDaysUntilDelivery(ticket.deliveryDate);
                const hasPendingMessage =
                  (ticket.scheduledMessages?.length ?? 0) > 0;
                const deliveryDate = new Date(
                  ticket.deliveryDate,
                ).toLocaleDateString();

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
                          {phoneLookups[ticket.whatsappNumber]
                            .digitalEnquiry && (
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
                          {ticket.model?.category?.name || "N/A"}
                        </p>
                        <p className="text-sm font-medium">
                          {ticket.model?.name || "N/A"}
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
                          <Badge variant="secondary" className="text-xs">
                            Scheduled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Not Sent
                          </Badge>
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
                          disabled={
                            sendingCompletion[ticket.id] ||
                            ticket.completionSent
                          }
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
  );
}
