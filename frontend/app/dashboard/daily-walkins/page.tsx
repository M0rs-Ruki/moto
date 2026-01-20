"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "@/lib/api";
import { getCachedData, setCachedData } from "@/lib/cache";
import { usePermissions } from "@/contexts/permissions";
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
  sessions?: Array<{
    id: string;
    status: string;
    reason: string;
    createdAt: string;
  }>;
  interests?: Array<{
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
  createdAt: string;
  visitor: {
    id: string;
    firstName: string;
    lastName: string;
    whatsappNumber: string;
  };
  testDrives: Array<{
    id: string;
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
  const VISITOR_PAGE_SIZE = 10;
  const SESSION_PAGE_SIZE = 10;

  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  // Visitors state
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [visitorPage, setVisitorPage] = useState(1);
  const [visitorPageLoading, setVisitorPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false);
  const [visitorSubmitting, setVisitorSubmitting] = useState(false);
  const [visitorError, setVisitorError] = useState("");
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set(),
  );
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {},
  );

  const { hasPermission } = usePermissions();
  const canViewVisitors = hasPermission("dailyWalkinsVisitors");
  const canViewSessions = hasPermission("dailyWalkinsSessions");

  // Tab state - default to first available tab
  const [activeTab, setActiveTab] = useState<"visitors" | "sessions">(() => {
    if (canViewVisitors) return "visitors";
    if (canViewSessions) return "sessions";
    return "visitors"; // fallback
  });
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  );

  // Sessions state
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionPageLoading, setSessionPageLoading] = useState(false);
  const [sessionsHasMore, setSessionsHasMore] = useState(false);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set(),
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [testDriveDialogOpen, setTestDriveDialogOpen] = useState(false);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);
  const [exitConfirmDialogOpen, setExitConfirmDialogOpen] = useState(false);
  const [sessionToExit, setSessionToExit] = useState<Session | null>(null);

  // Test drive form
  const [testDriveData, setTestDriveData] = useState({
    modelId: "",
    variantId: "",
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
    mountedRef.current = true;

    // Try to load from cache first - use longer cache durations
    const cachedCategories = getCachedData<VehicleCategory[]>(
      "cache_daily_walkins_categories",
      300000, // 5 minutes (categories don't change often)
    );
    const cachedVisitors = getCachedData<Visitor[]>(
      "cache_daily_walkins_visitors",
      120000, // 2 minutes (visitors change more often)
    );
    const cachedSessions = getCachedData<Session[]>(
      "cache_daily_walkins_sessions",
      120000, // 2 minutes
    );

    // Use cache if available (even if partial)
    const hasAnyCache = cachedCategories || cachedVisitors || cachedSessions;

    if (hasAnyCache) {
      // Set whatever we have in cache
      if (cachedCategories) setCategories(cachedCategories);
      if (cachedVisitors) setVisitors(cachedVisitors);
      if (cachedSessions) setAllSessions(cachedSessions);
      setLoading(false);

      // Check cache age to decide if we need to refresh
      try {
        const visitorsCacheEntry = JSON.parse(
          sessionStorage.getItem("cache_daily_walkins_visitors") || "{}",
        );
        const cacheAge = Date.now() - (visitorsCacheEntry.timestamp || 0);

        // If cache is fresh (< 30 seconds), don't fetch
        if (cacheAge < 30000) {
          // Cache is fresh, only fetch missing data if needed
          if (!cachedCategories || !cachedVisitors || !cachedSessions) {
            fetchData(0, false, true); // Background fetch for missing data
          }
        } else {
          // Cache is stale (> 30 seconds), refresh in background
          if (mountedRef.current && !fetchingRef.current) {
            setTimeout(() => {
              if (mountedRef.current && !fetchingRef.current) {
                fetchData(0, false, true); // Background fetch
              }
            }, 500);
          }
        }
      } catch {
        // If cache parsing fails, fetch normally
        if (!cachedCategories || !cachedVisitors || !cachedSessions) {
          fetchData();
        }
      }
    } else {
      // No cache at all, fetch normally
      fetchData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const applyFilters = useCallback(() => {
    let filteredV = [...visitors];

    // Apply date filter
    if (dateFilter.startDate || dateFilter.endDate) {
      const startDate = dateFilter.startDate
        ? new Date(dateFilter.startDate)
        : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      filteredV = filteredV.filter((visitor) => {
        const visitorDate = new Date(visitor.createdAt);
        if (startDate && visitorDate < startDate) return false;
        if (endDate && visitorDate > endDate) return false;
        return true;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filteredV = filteredV.filter((visitor) => {
        const fullName =
          `${visitor.firstName} ${visitor.lastName}`.toLowerCase();
        const phone = visitor.whatsappNumber.toLowerCase();
        const email = visitor.email?.toLowerCase() || "";

        return (
          fullName.includes(query) ||
          phone.includes(query) ||
          email.includes(query)
        );
      });
    }

    setFilteredVisitors(filteredV);
    // Reset pagination when filters change
    setVisitorPage(1);
  }, [dateFilter, visitors, searchQuery]);

  // Apply date filter and search
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchData = async (
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
        setVisitorPageLoading(true);
      }

      const promises: Promise<any>[] = [apiClient.get("/categories")];

      if (canViewVisitors) {
        promises.push(
          apiClient.get(`/visitors?limit=${VISITOR_PAGE_SIZE}&skip=${skip}`),
        );
      }

      if (canViewSessions) {
        promises.push(
          apiClient.get(`/sessions?limit=${SESSION_PAGE_SIZE}&skip=0`),
        );
      }

      const results = await Promise.all(promises);
      const categoriesRes = results[0];
      let visitorsRes = null;
      let sessionsRes = null;

      if (canViewVisitors) {
        visitorsRes = results[1];
        if (canViewSessions) {
          sessionsRes = results[2];
        }
      } else if (canViewSessions) {
        sessionsRes = results[1];
      }

      setCategories(categoriesRes.data.categories);
      setCachedData(
        "cache_daily_walkins_categories",
        categoriesRes.data.categories,
      );

      // Append or replace visitors (only if permission granted)
      if (canViewVisitors && visitorsRes) {
        if (append) {
          // Deduplicate: only add visitors that don't already exist
          const existingIds = new Set(visitors.map((v) => v.id));
          const newVisitors = visitorsRes.data.visitors.filter(
            (v: Visitor) => !existingIds.has(v.id),
          );
          setVisitors([...visitors, ...newVisitors]);
        } else {
          setVisitors(visitorsRes.data.visitors);
          setVisitorPage(1);
        }

        setHasMore(visitorsRes.data.hasMore || false);
        setTotalVisitors(
          visitorsRes.data.total || visitorsRes.data.visitors.length,
        );
      }

      // Handle sessions (only if permission granted)
      if (canViewSessions && sessionsRes) {
        if (append) {
          // Don't reload sessions when loading more visitors
        } else {
          setAllSessions(sessionsRes.data.sessions || []);
          setCachedData(
            "cache_daily_walkins_sessions",
            sessionsRes.data.sessions || [],
          );
          setSessionsHasMore(sessionsRes.data.hasMore || false);
          setSessionsTotal(
            sessionsRes.data.total || sessionsRes.data.sessions?.length || 0,
          );
          setSessionPage(1);
        }
      }

      // Cache visitors (only if we have visitors data and permission)
      if (!append && canViewVisitors && visitorsRes) {
        setCachedData(
          "cache_daily_walkins_visitors",
          visitorsRes.data.visitors,
        );
      }

      // Only fetch phone lookups when loading more data (not on initial load)
      // Use batch lookup to avoid multiple API calls
      if (
        append &&
        canViewVisitors &&
        visitorsRes &&
        visitorsRes.data.visitors.length > 0
      ) {
        const newVisitors = visitorsRes.data.visitors;
        const lookups: Record<string, PhoneLookup> = { ...phoneLookups };

        try {
          // Extract unique phone numbers
          const phoneNumbers = [
            ...new Set(newVisitors.map((v: Visitor) => v.whatsappNumber)),
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
      console.error("Failed to fetch data:", error);
    } finally {
      if (!append) fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
        setVisitorPageLoading(false);
      }
    }
  };

  const handleVisitorPageChange = async (page: number) => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        (hasMore
          ? Math.max(totalVisitors, filteredVisitors.length)
          : filteredVisitors.length) / VISITOR_PAGE_SIZE,
      ),
    );
    const targetPage = Math.min(Math.max(page, 1), totalPages);

    if (targetPage * VISITOR_PAGE_SIZE <= visitors.length || !hasMore) {
      setVisitorPage(targetPage);
      return;
    }

    if (hasMore && !visitorPageLoading) {
      await fetchData(visitors.length, true);
      setVisitorPage(targetPage);
    }
  };

  const fetchAllSessions = async (
    skip: number = 0,
    append: boolean = false,
    visitorIdOverride?: string | null,
  ) => {
    if (!append) {
      setLoadingSessions(true);
    } else {
      setSessionPageLoading(true);
    }

    try {
      const visitorId =
        visitorIdOverride !== undefined ? visitorIdOverride : selectedVisitorId;
      const visitorIdParam = visitorId ? `&visitorId=${visitorId}` : "";
      const response = await apiClient.get(
        `/sessions?limit=${SESSION_PAGE_SIZE}&skip=${skip}${visitorIdParam}`,
      );

      if (append) {
        setAllSessions([...allSessions, ...(response.data.sessions || [])]);
      } else {
        setAllSessions(response.data.sessions || []);
        setSessionPage(1);
      }

      setSessionsHasMore(response.data.hasMore || false);
      setSessionsTotal(
        response.data.total || response.data.sessions?.length || 0,
      );
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      if (!append) {
        setAllSessions([]);
      }
    } finally {
      setLoadingSessions(false);
      setSessionPageLoading(false);
    }
  };

  const handleSessionPageChange = async (page: number) => {
    const currentSessions = selectedVisitorId
      ? allSessions.filter((s: Session) => s.visitor.id === selectedVisitorId)
      : allSessions;

    const totalPages = Math.max(
      1,
      Math.ceil(
        (sessionsHasMore
          ? Math.max(sessionsTotal, currentSessions.length)
          : currentSessions.length) / SESSION_PAGE_SIZE,
      ),
    );
    const targetPage = Math.min(Math.max(page, 1), totalPages);

    if (
      targetPage * SESSION_PAGE_SIZE <= currentSessions.length ||
      !sessionsHasMore
    ) {
      setSessionPage(targetPage);
      return;
    }

    if (sessionsHasMore && !sessionPageLoading) {
      await fetchAllSessions(allSessions.length, true);
      setSessionPage(targetPage);
    }
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: "", endDate: "" });
  };

  const clearSearch = () => {
    setSearchQuery("");
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

  const getVisiblePages = (totalPages: number, page: number) => {
    const maxVisible = 5;
    const pages: number[] = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) {
      start = 1;
      end = Math.min(totalPages, maxVisible);
    } else if (page >= totalPages - 2) {
      end = totalPages;
      start = Math.max(1, totalPages - (maxVisible - 1));
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  const handleViewSessions = async (visitor: Visitor) => {
    setSelectedVisitorId(visitor.id);
    setActiveTab("sessions");

    // Reset sessions pagination and fetch sessions for this visitor
    setSessionPage(1);
    await fetchAllSessions(0, false);

    // Find and expand the latest session for this visitor
    const visitorSessions = allSessions
      .filter((s: Session) => s.visitor.id === visitor.id)
      .sort(
        (a: Session, b: Session) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

      const response = await apiClient.post("/test-drives", {
        sessionId: selectedSession.id,
        modelId,
        variantId: variantId || testDriveData.variantId || undefined,
      });

      if (response.data.success) {
        setTestDriveDialogOpen(false);
        setTestDriveData({
          modelId: "",
          variantId: "",
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

  const handleExitSession = (session: Session) => {
    if (!session) return;
    setSessionToExit(session);
    setExitConfirmDialogOpen(true);
  };

  const confirmExitSession = async () => {
    if (!sessionToExit) return;

    setExitConfirmDialogOpen(false);
    setSessionSubmitting(true);
    try {
      if (!canViewSessions) {
        alert("You don't have permission to exit sessions");
        return;
      }
      const response = await apiClient.post("/sessions/exit", {
        sessionId: sessionToExit.id,
      });

      if (response.data.success) {
        const updatedSession = response.data.session;

        // 1. IMMEDIATE UI UPDATE - Update session status immediately
        setAllSessions((prev) =>
          prev.map((s) =>
            s.id === sessionToExit.id ? { ...s, ...updatedSession } : s,
          ),
        );

        // 2. UPDATE CACHE
        const cachedSessions = getCachedData<Session[]>(
          "cache_daily_walkins_sessions",
          120000,
        );
        if (cachedSessions) {
          const updatedCache = cachedSessions.map((s) =>
            s.id === sessionToExit.id ? { ...s, ...updatedSession } : s,
          );
          setCachedData("cache_daily_walkins_sessions", updatedCache);
        }

        // 3. BACKGROUND REFETCH - Ensure consistency
        fetchAllSessions(0, false);
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
      setSessionToExit(null);
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
      if (!canViewVisitors) {
        alert("You don't have permission to create visitors");
        return;
      }
      const response = await apiClient.post("/visitors", visitorFormData);

      // Check if visitor was created successfully (even if WhatsApp message failed)
      if (response.data.success) {
        const newVisitor = response.data.visitor;

        // 1. IMMEDIATE UI UPDATE (Real-time!) - Add visitor to list immediately
        setVisitors((prev) => {
          // Check if visitor already exists to prevent duplicates
          const exists = prev.some((v) => v.id === newVisitor.id);
          return exists ? prev : [newVisitor, ...prev];
        });
        setTotalVisitors((prev) => prev + 1);
        setVisitorPage(1);
        setHasMore(true);

        // 2. UPDATE CACHE - Update cache with new visitor
        const cachedVisitors = getCachedData<Visitor[]>(
          "cache_daily_walkins_visitors",
          120000,
        );
        if (cachedVisitors) {
          setCachedData("cache_daily_walkins_visitors", [
            newVisitor,
            ...cachedVisitors,
          ]);
        } else {
          setCachedData("cache_daily_walkins_visitors", [newVisitor]);
        }

        // 3. BACKGROUND REFETCH - Ensure data consistency (fetch in background)
        fetchData(0, false, true);
        fetchAllSessions(0, false);

        // Reset form
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

        // Show warning if WhatsApp message failed but visitor was created
        if (response.data.message?.status === "failed") {
          console.warn(
            "Visitor created but WhatsApp message failed:",
            response.data.message.error,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const visitorTotalItems = hasMore
    ? Math.max(totalVisitors, filteredVisitors.length)
    : filteredVisitors.length;
  const visitorTotalPages = Math.max(
    1,
    Math.ceil(visitorTotalItems / VISITOR_PAGE_SIZE),
  );
  const paginatedVisitors = filteredVisitors.slice(
    (visitorPage - 1) * VISITOR_PAGE_SIZE,
    visitorPage * VISITOR_PAGE_SIZE,
  );
  const visitorPageNumbers = getVisiblePages(visitorTotalPages, visitorPage);

  const sessionsForView = selectedVisitorId
    ? allSessions.filter((s) => s.visitor.id === selectedVisitorId)
    : allSessions;
  const sessionTotalItems = sessionsHasMore
    ? Math.max(sessionsTotal, sessionsForView.length)
    : sessionsForView.length;
  const sessionTotalPages = Math.max(
    1,
    Math.ceil(sessionTotalItems / SESSION_PAGE_SIZE),
  );
  const paginatedSessions = sessionsForView.slice(
    (sessionPage - 1) * SESSION_PAGE_SIZE,
    sessionPage * SESSION_PAGE_SIZE,
  );
  const sessionPageNumbers = getVisiblePages(sessionTotalPages, sessionPage);

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
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "visitors" | "sessions")
        }
        className="space-y-6"
      >
        <TabsList
          className={`grid w-full ${canViewVisitors && canViewSessions ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {canViewVisitors && (
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
          )}
          {canViewSessions && (
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          )}
        </TabsList>

        {/* Visitors Tab */}
        {canViewVisitors && (
          <TabsContent value="visitors" className="space-y-6 mt-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, phone number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredVisitors.length} result
                  {filteredVisitors.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
              <div className="w-full sm:w-auto order-2 sm:order-1">
                {/* Placeholder for other content if needed */}
              </div>
              <div className="order-1 sm:order-2">
                <Dialog
                  open={visitorDialogOpen}
                  onOpenChange={setVisitorDialogOpen}
                >
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

                    <form
                      onSubmit={handleVisitorSubmit}
                      className="space-y-4 mt-4"
                    >
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
                              No models available. Add models in Global
                              Settings.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {categories.map((category) => {
                                const isOpen = openModelCategories.has(
                                  category.id,
                                );
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
                                                !id.variantId),
                                          );
                                        return (
                                          <div
                                            key={model.id}
                                            className="space-y-0.5"
                                          >
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
                                                    model.id,
                                                  )}
                                                  onOpenChange={(open) => {
                                                    setExpandedVariants(
                                                      (prev) => {
                                                        const newSet = new Set(
                                                          prev,
                                                        );
                                                        if (open) {
                                                          newSet.add(model.id);
                                                        } else {
                                                          newSet.delete(
                                                            model.id,
                                                          );
                                                        }
                                                        return newSet;
                                                      },
                                                    );
                                                  }}
                                                >
                                                  <CollapsibleTrigger className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded transition-all">
                                                    <ChevronDown
                                                      className={`h-4 w-4 transition-transform ${
                                                        expandedVariants.has(
                                                          model.id,
                                                        )
                                                          ? "rotate-180"
                                                          : ""
                                                      }`}
                                                    />
                                                    <span>
                                                      {model.variants.length}{" "}
                                                      variant
                                                      {model.variants.length !==
                                                      1
                                                        ? "s"
                                                        : ""}
                                                    </span>
                                                  </CollapsibleTrigger>
                                                  <CollapsibleContent className="ml-6 space-y-1 mt-1">
                                                    {model.variants.map(
                                                      (variant) => {
                                                        const isVariantSelected =
                                                          visitorFormData.modelIds.some(
                                                            (id) =>
                                                              typeof id ===
                                                                "object" &&
                                                              id.modelId ===
                                                                model.id &&
                                                              id.variantId ===
                                                                variant.id,
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
                                                                    variant.id,
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
                                                      },
                                                    )}
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
              </div>
            </div>

            {filteredVisitors.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">
                      No visitors found. Create your first visitor to get
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
                              Visitor
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Contact
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Last Visit
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Sessions
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Interested Models
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedVisitors.map((visitor) => {
                            const initials = `${visitor.firstName.charAt(
                              0,
                            )}${visitor.lastName.charAt(0)}`.toUpperCase();
                            const lastVisit =
                              visitor.sessions && visitor.sessions.length > 0
                                ? formatDate(
                                    visitor.sessions.sort(
                                      (a, b) =>
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime(),
                                    )[0].createdAt,
                                  )
                                : formatDate(visitor.createdAt);

                            return (
                              <tr
                                key={visitor.id}
                                className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => handleViewSessions(visitor)}
                              >
                                {/* Visitor Column */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                                      {initials}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {visitor.firstName} {visitor.lastName}
                                      </p>
                                      {visitor.email && (
                                        <p className="text-xs text-muted-foreground truncate">
                                          {visitor.email}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Contact Column */}
                                <td className="py-3 px-4">
                                  <div className="space-y-1">
                                    <p className="text-sm">
                                      {visitor.whatsappNumber || "No phone"}
                                    </p>
                                  </div>
                                </td>

                                {/* Last Visit Column */}
                                <td className="py-3 px-4">
                                  <p className="text-sm">{lastVisit}</p>
                                </td>

                                {/* Sessions Column */}
                                <td className="py-3 px-4">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-medium"
                                  >
                                    {visitor.sessions?.length || 0} session
                                    {(visitor.sessions?.length || 0) !== 1
                                      ? "s"
                                      : ""}
                                  </Badge>
                                </td>

                                {/* Interested Models Column */}
                                <td className="py-3 px-4">
                                  {visitor.interests &&
                                  visitor.interests.length > 0 ? (
                                    <div className="space-y-1">
                                      {visitor.interests
                                        .slice(0, 2)
                                        .map((interest, idx) => (
                                          <p
                                            key={idx}
                                            className="text-xs text-muted-foreground"
                                          >
                                            {interest.model.category.name} -{" "}
                                            {interest.model.name}
                                          </p>
                                        ))}
                                      {visitor.interests.length > 2 && (
                                        <p className="text-xs text-muted-foreground">
                                          +{visitor.interests.length - 2} more
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      None
                                    </span>
                                  )}
                                </td>

                                {/* Actions Column */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {phoneLookups[visitor.whatsappNumber]
                                      ?.digitalEnquiry && (
                                      <Link
                                        href="/dashboard/digital-enquiry"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Badge
                                          variant="outline"
                                          className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                        >
                                          Digital
                                        </Badge>
                                      </Link>
                                    )}
                                    {phoneLookups[visitor.whatsappNumber]
                                      ?.deliveryUpdate && (
                                      <Link
                                        href="/dashboard/delivery-update"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Badge
                                          variant="outline"
                                          className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                        >
                                          Delivery
                                        </Badge>
                                      </Link>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewSessions(visitor);
                                      }}
                                    >
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                {visitorTotalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisitorPageChange(visitorPage - 1)}
                      disabled={visitorPage === 1 || visitorPageLoading}
                      className="w-auto"
                    >
                      Previous
                    </Button>

                    {visitorPageNumbers.map((page) => (
                      <Button
                        key={page}
                        variant={page === visitorPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVisitorPageChange(page)}
                        disabled={visitorPageLoading}
                        className="w-auto"
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisitorPageChange(visitorPage + 1)}
                      disabled={
                        visitorPage === visitorTotalPages || visitorPageLoading
                      }
                      className="w-auto"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        )}

        {/* Sessions Tab */}
        {canViewSessions && (
          <TabsContent value="sessions" className="space-y-6 mt-6">
            {/* Visitor Info Header (when opened from visitor) */}
            {selectedVisitorId &&
              (() => {
                const visitor = visitors.find(
                  (v) => v.id === selectedVisitorId,
                );
                if (!visitor) return null;
                const visitorSessions = allSessions.filter(
                  (s: Session) => s.visitor.id === selectedVisitorId,
                );
                return (
                  <Card className="bg-muted/30 border-primary/30">
                    <CardContent className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold">
                            {visitor.firstName} {visitor.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {visitor.whatsappNumber}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {visitorSessions.length} session
                            {visitorSessions.length !== 1 ? "s" : ""} •{" "}
                            {visitorSessions.length} visit
                            {visitorSessions.length !== 1 ? "s" : ""} to
                            showroom
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVisitorId(null);
                              setSessionPage(1);
                              fetchAllSessions(0, false, null);
                            }}
                          >
                            Show All Sessions
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedVisitorId(null);
                              setSessionPage(1);
                              fetchAllSessions(0, false, null);
                            }}
                            className="px-2"
                            title="Close filter"
                          >
                            ✕
                          </Button>
                        </div>
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
              <>
                <div className="space-y-4">
                  {paginatedSessions.map((session: Session) => {
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
                                      {session.visitor.firstName}{" "}
                                      {session.visitor.lastName} - Session{" "}
                                      {formatDateTime(session.createdAt)}
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                      Status: {session.status}
                                      {!isExpanded && (
                                        <span className="ml-2">
                                          •{" "}
                                          {session.reason.length > 40
                                            ? session.reason.substring(0, 40) +
                                              "..."
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
                                      {session.visitorInterests.map(
                                        (interest) => (
                                          <Badge
                                            key={interest.id}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {interest.model.category.name} -{" "}
                                            {interest.model.name}
                                          </Badge>
                                        ),
                                      )}
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
                                          {td.model.category.name} -{" "}
                                          {td.model.name}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
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
                                      handleExitSession(session);
                                    }}
                                    disabled={sessionSubmitting}
                                    className="w-full sm:w-auto text-xs sm:text-sm"
                                  >
                                    {sessionSubmitting ? (
                                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                    ) : (
                                      <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    )}
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
                {sessionTotalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSessionPageChange(sessionPage - 1)}
                      disabled={sessionPage === 1 || sessionPageLoading}
                      className="w-auto"
                    >
                      Previous
                    </Button>

                    {sessionPageNumbers.map((page) => (
                      <Button
                        key={page}
                        variant={page === sessionPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSessionPageChange(page)}
                        disabled={sessionPageLoading}
                        className="w-auto"
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSessionPageChange(sessionPage + 1)}
                      disabled={
                        sessionPage === sessionTotalPages || sessionPageLoading
                      }
                      className="w-auto"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        )}
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

      {/* Exit Session Confirmation Dialog */}
      <Dialog
        open={exitConfirmDialogOpen}
        onOpenChange={setExitConfirmDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exit Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit this session? This will close the
              session and send a thank you message to the visitor.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setExitConfirmDialogOpen(false);
                setSessionToExit(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmExitSession}
              disabled={sessionSubmitting}
              className="w-full sm:w-auto"
            >
              {sessionSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exiting...
                </>
              ) : (
                "Exit Session"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
