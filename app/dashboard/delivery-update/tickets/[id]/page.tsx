"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Loader2, ArrowLeft, Send, Calendar, Package } from "lucide-react";
import Link from "next/link";

interface DeliveryTicket {
  id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string | null;
  address: string | null;
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

export default function DeliveryTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<DeliveryTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get("/api/delivery-tickets");
      const foundTicket = response.data.tickets.find(
        (t: DeliveryTicket) => t.id === ticketId
      );
      setTicket(foundTicket || null);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    if (!ticket) return;

    setSending(true);
    try {
      await axios.post(`/api/delivery-tickets/${ticketId}/send-now`);
      await fetchTicket(); // Refresh ticket data
    } catch (error: any) {
      console.error("Failed to send message:", error);
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/delivery-update">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Ticket Not Found
          </h1>
        </div>
      </div>
    );
  }

  const deliveryDate = new Date(ticket.deliveryDate);
  const today = new Date();
  const daysUntil = Math.ceil(
    (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const hasPendingMessage = ticket.scheduledMessages.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/delivery-update">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Delivery Ticket
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
            {ticket.firstName} {ticket.lastName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Name
                  </div>
                  <div className="text-sm sm:text-base font-medium">
                    {ticket.firstName} {ticket.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    WhatsApp
                  </div>
                  <div className="text-sm sm:text-base">{ticket.whatsappNumber}</div>
                </div>
                {ticket.email && (
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Email
                    </div>
                    <div className="text-sm sm:text-base">{ticket.email}</div>
                  </div>
                )}
                {ticket.address && (
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Address
                    </div>
                    <div className="text-sm sm:text-base">{ticket.address}</div>
                  </div>
                )}
              </div>
              {ticket.description && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Description
                  </div>
                  <div className="text-sm sm:text-base">{ticket.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Delivery Date
                  </div>
                  <div className="text-sm sm:text-base font-medium">
                    {deliveryDate.toLocaleDateString()}
                  </div>
                </div>
                {daysUntil >= 0 && (
                  <Badge variant="outline" className="ml-auto">
                    {daysUntil === 0
                      ? "Today"
                      : daysUntil === 1
                      ? "Tomorrow"
                      : `${daysUntil} days`}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Model
                  </div>
                  <div className="text-sm sm:text-base font-medium">
                    {ticket.model.category.name} - {ticket.model.name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messageSent ? (
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-full justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  Message Sent
                </Badge>
              ) : hasPendingMessage ? (
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    Scheduled
                  </Badge>
                  <div className="text-xs text-muted-foreground text-center">
                    Will be sent on{" "}
                    {new Date(
                      ticket.scheduledMessages[0].scheduledFor
                    ).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <Badge variant="outline" className="w-full justify-center">
                  Not Sent
                </Badge>
              )}

              {!ticket.messageSent && (
                <Button
                  onClick={handleSendNow}
                  disabled={sending}
                  className="w-full"
                  variant="default"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

