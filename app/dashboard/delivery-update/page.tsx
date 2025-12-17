"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Package, Calendar, Send } from "lucide-react";
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

export default function DeliveryUpdatePage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<DeliveryTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {}
  );

  useEffect(() => {
    fetchTickets();
  }, []);

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
          onClick={() => router.push("/dashboard/delivery-update/create")}
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
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/delivery-update/tickets/${ticket.id}`)
                }
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
