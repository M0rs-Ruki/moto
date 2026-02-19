"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { getCachedData, setCachedData } from "@/lib/cache";
import { usePermissions } from "@/contexts/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import CreateTicketDialog from "./components/CreateTicketDialog";
import DeliveryTicketsTable from "./components/DeliveryTicketsTable";
import Pagination from "./components/Pagination";
import DeliveryUpdateLoading from "./loading";

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

export default function DeliveryUpdatePage() {
  const { hasPermission } = usePermissions();

  const PAGE_SIZE = 10;

  const [tickets, setTickets] = useState<DeliveryTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {},
  );
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  // Create ticket dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    // Try to load from cache first - use longer cache duration
    const cached = getCachedData<DeliveryTicket[]>(
      "cache_delivery_tickets",
      120000,
    ); // 2 minutes
    if (cached) {
      setTickets(cached);
      setLoading(false);

      // Check cache age to decide if we need to refresh
      try {
        const cacheEntry = JSON.parse(
          sessionStorage.getItem("cache_delivery_tickets") || "{}",
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = async (
    skip: number = 0,
    append: boolean = false,
    background: boolean = false,
  ) => {
    // Prevent duplicate fetches
    if (fetchingRef.current && !append) return;
    if (!append) fetchingRef.current = true;

    try {
      if (!append && !background) {
        setLoading(true);
      } else if (append) {
        setPageLoading(true);
      }

      const response = await apiClient.get(
        `/delivery-tickets?limit=${PAGE_SIZE}&skip=${skip}`,
      );

      // Append or replace tickets
      if (append) {
        setTickets([...tickets, ...response.data.tickets]);
      } else {
        setTickets(response.data.tickets);
        setCurrentPage(1);
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
          const phoneNumbers = [
            ...new Set(newTickets.map((t: DeliveryTicket) => t.whatsappNumber)),
          ];

          // Batch lookup all phones in one request
          const lookupRes = await apiClient.post("/phone-lookup", {
            phones: phoneNumbers,
          });

          // Merge batch results into lookups
          Object.assign(lookups, lookupRes.data);
          setPhoneLookups(lookups);
        } catch (error) {
          console.error("Failed to batch lookup phones:", error);
          // Don't break the page if phone lookup fails
        }
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      if (!append) fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
        setPageLoading(false);
      }
    }
  };

  const handleTicketCreated = () => {
    // Refresh the tickets list
    fetchTickets(0, false, true);
  };

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
              <p className="text-base">
                You don&apos;t have permission to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <DeliveryUpdateLoading />;
  }

  const totalPages = Math.max(1, Math.ceil(totalTickets / PAGE_SIZE));
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handlePageChange = async (page: number) => {
    const totalPages = Math.max(1, Math.ceil(totalTickets / PAGE_SIZE));
    const targetPage = Math.min(Math.max(page, 1), totalPages);

    if (targetPage * PAGE_SIZE <= tickets.length || !hasMore) {
      setCurrentPage(targetPage);
      return;
    }

    if (hasMore && !pageLoading) {
      await fetchTickets(tickets.length, true);
      setCurrentPage(targetPage);
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

      <div className="flex justify-end gap-4">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      <DeliveryTicketsTable
        tickets={paginatedTickets}
        phoneLookups={phoneLookups}
        onRefresh={() => fetchTickets(0, false)}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageLoading={pageLoading}
        />
      )}

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}
