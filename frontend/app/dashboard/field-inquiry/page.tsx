"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { getCachedData, setCachedData } from "@/lib/cache";
import { usePermissions } from "@/contexts/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Loader2,
  MapPin,
  ChevronDown,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

interface LeadSource {
  id: string;
  name: string;
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

interface FieldInquiry {
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
  createdAt: string;
}

interface PhoneLookup {
  dailyWalkins: boolean;
  digitalEnquiry: boolean;
  fieldInquiry: boolean;
  deliveryUpdate: boolean;
  visitorId: string | null;
  enquiryId: string | null;
  fieldInquiryId: string | null;
  ticketId: string | null;
}

export default function FieldInquiryPage() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("fieldInquiry")) {
    return (
      <div className="space-y-8">
        <div className="pb-2 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Field Inquiry
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base">
                You don't have permission to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const PAGE_SIZE = 10;

  const [enquiries, setEnquiries] = useState<FieldInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [phoneLookups, setPhoneLookups] = useState<Record<string, PhoneLookup>>(
    {},
  );
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  // Create enquiry dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Bulk upload dialog state
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResults, setUploadResults] = useState<{
    summary: { total: number; success: number; errors: number };
    results: Array<{
      success: boolean;
      rowNumber: number;
      enquiryId?: string;
      error?: string;
    }>;
  } | null>(null);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [openModelCategories, setOpenModelCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set(),
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    email: "",
    address: "",
    reason: "",
    leadSourceId: "",
    leadScope: "warm",
    interestedModelId: "",
    interestedVariantId: "",
  });

  useEffect(() => {
    mountedRef.current = true;

    // Try to load from cache first - use longer cache duration
    const cached = getCachedData<FieldInquiry[]>("cache_field_inquiry", 120000); // 2 minutes
    if (cached) {
      setEnquiries(cached);
      setLoading(false);

      // Check cache age to decide if we need to refresh
      try {
        const cacheEntry = JSON.parse(
          sessionStorage.getItem("cache_field_inquiry") || "{}",
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
                fetchData(0, false, true); // Background fetch
              }
            }, 500);
          }
        }
      } catch {
        // If cache parsing fails, fetch normally
        fetchData(0, false);
      }
    } else {
      // No cache, fetch normally
      fetchData(0, false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

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
        setPageLoading(true);
      }

      const response = await apiClient.get(
        `/field-inquiry?limit=${PAGE_SIZE}&skip=${skip}`,
      );

      // Append or replace enquiries
      if (append) {
        setEnquiries([...enquiries, ...response.data.enquiries]);
      } else {
        setEnquiries(response.data.enquiries);
        setCurrentPage(1);
        // Cache the data
        setCachedData("cache_field_inquiry", response.data.enquiries);
      }

      setHasMore(response.data.hasMore || false);
      setTotalEnquiries(response.data.total || response.data.enquiries.length);

      // Only fetch phone lookups when loading more data (not on initial load)
      // Use batch lookup to avoid multiple API calls
      if (append && response.data.enquiries.length > 0) {
        const newEnquiries = response.data.enquiries;
        const lookups: Record<string, PhoneLookup> = { ...phoneLookups };

        try {
          // Extract unique phone numbers
          const phoneNumbers = [
            ...new Set(newEnquiries.map((e: FieldInquiry) => e.whatsappNumber)),
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
      console.error("Failed to fetch enquiries:", error);
    } finally {
      if (!append) fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
        setPageLoading(false);
      }
    }
  };

  const handlePageChange = async (page: number) => {
    const totalPages = Math.max(1, Math.ceil(totalEnquiries / PAGE_SIZE));
    const targetPage = Math.min(Math.max(page, 1), totalPages);

    if (targetPage * PAGE_SIZE <= enquiries.length || !hasMore) {
      setCurrentPage(targetPage);
      return;
    }

    if (hasMore && !pageLoading) {
      await fetchData(enquiries.length, true);
      setCurrentPage(targetPage);
    }
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

  const fetchCreateFormData = async () => {
    try {
      const [leadSourcesRes, categoriesRes] = await Promise.all([
        apiClient.get("/lead-sources"),
        apiClient.get("/categories"),
      ]);
      setLeadSources(leadSourcesRes.data.leadSources);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error("Failed to fetch form data:", error);
    }
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await apiClient.post("/field-inquiry", {
        ...formData,
        leadSourceId: formData.leadSourceId || null,
        interestedModelId: formData.interestedModelId || null,
        interestedVariantId: formData.interestedVariantId || null,
      });

      if (response.data.success) {
        const newEnquiry = response.data.enquiry;

        // 1. IMMEDIATE UI UPDATE - Add enquiry to list immediately
        setEnquiries((prev) => [newEnquiry, ...prev]);
        setTotalEnquiries((prev) => prev + 1);
        setCurrentPage(1);
        setHasMore(true);

        // 2. UPDATE CACHE
        const cachedEnquiries = getCachedData<FieldInquiry[]>(
          "cache_field_inquiry",
          120000,
        );
        if (cachedEnquiries) {
          setCachedData("cache_field_inquiry", [
            newEnquiry,
            ...cachedEnquiries,
          ]);
        } else {
          setCachedData("cache_field_inquiry", [newEnquiry]);
        }

        // 3. BACKGROUND REFETCH - Ensure consistency
        fetchData(0, false, true); // Background fetch

        // Reset form and close dialog
        setCreateDialogOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          whatsappNumber: "",
          email: "",
          address: "",
          reason: "",
          leadSourceId: "",
          leadScope: "warm",
          interestedModelId: "",
          interestedVariantId: "",
        });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to create enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadError("");
    setUploadResults(null);

    const fileInput = e.currentTarget.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setUploadError("Please select a file");
      setUploading(false);
      return;
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      setUploadError(
        "Invalid file type. Please upload an Excel file (.xlsx or .xls)",
      );
      setUploading(false);
      return;
    }

    try {
      // Read Excel file and convert to JSON
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        setUploadError("Excel file has no sheets");
        setUploading(false);
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (rows.length === 0) {
        setUploadError("Excel file is empty");
        setUploading(false);
        return;
      }

      // Validate required columns
      const firstRow = rows[0];
      const requiredColumns = ["Date", "Name", "WhatsApp Number", "Model"];
      const missingColumns = requiredColumns.filter(
        (col) => !(col in firstRow),
      );

      if (missingColumns.length > 0) {
        setUploadError(
          `Missing required columns: ${missingColumns.join(", ")}`,
        );
        setUploading(false);
        return;
      }

      // Send JSON data to backend
      const response = await apiClient.post("/field-inquiry/bulk", {
        rows: rows,
      });

      if (response.data.success) {
        setUploadResults(response.data);
        // Refresh the enquiry list in background
        fetchData(0, false, true); // Background fetch after bulk upload
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string; details?: string } };
      };
      setUploadError(
        error.response?.data?.error ||
          error.response?.data?.details ||
          "Failed to upload file",
      );
    } finally {
      setUploading(false);
    }
  };

  const getLeadScopeColor = (scope: string) => {
    switch (scope) {
      case "hot":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "warm":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "cold":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalEnquiries / PAGE_SIZE));
  const paginatedEnquiries = enquiries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const pageNumbers = getVisiblePages(totalPages, currentPage);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Field Inquiry
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Manage field lead inquiries
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setBulkUploadDialogOpen(true);
            setUploadError("");
            setUploadResults(null);
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
        <Button
          onClick={() => {
            setCreateDialogOpen(true);
            fetchCreateFormData();
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Inquiry
        </Button>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No field enquiries yet. Create your first inquiry to get
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
                        Inquiry
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Lead Scope
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Lead Source
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Model
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEnquiries.map((enquiry) => {
                      const initials =
                        `${enquiry.firstName.charAt(0)}${enquiry.lastName.charAt(0)}`.toUpperCase();

                      return (
                        <tr
                          key={enquiry.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          {/* Inquiry Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {enquiry.firstName} {enquiry.lastName}
                                </p>
                                {enquiry.email && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {enquiry.email}
                                  </p>
                                )}
                                {enquiry.reason && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {enquiry.reason.length > 50
                                      ? enquiry.reason.substring(0, 50) + "..."
                                      : enquiry.reason}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact Column */}
                          <td className="py-3 px-4">
                            <p className="text-sm">
                              {enquiry.whatsappNumber || "No phone"}
                            </p>
                          </td>

                          {/* Lead Scope Column */}
                          <td className="py-3 px-4">
                            <Badge
                              className={getLeadScopeColor(enquiry.leadScope)}
                              variant="secondary"
                            >
                              {enquiry.leadScope.toUpperCase()}
                            </Badge>
                          </td>

                          {/* Lead Source Column */}
                          <td className="py-3 px-4">
                            {enquiry.leadSource ? (
                              <Badge variant="outline" className="text-xs">
                                {enquiry.leadSource.name}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                None
                              </span>
                            )}
                          </td>

                          {/* Model Column */}
                          <td className="py-3 px-4">
                            {enquiry.model ? (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  {enquiry.model.category.name}
                                </p>
                                <p className="text-sm font-medium">
                                  {enquiry.model.name}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                None
                              </span>
                            )}
                          </td>

                          {/* Created Column */}
                          <td className="py-3 px-4">
                            <p className="text-sm">
                              {formatDate(enquiry.createdAt)}
                            </p>
                          </td>

                          {/* Actions Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {phoneLookups[enquiry.whatsappNumber]
                                ?.dailyWalkins && (
                                <Link
                                  href="/dashboard/daily-walkins"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Badge
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                  >
                                    Walkins
                                  </Badge>
                                </Link>
                              )}
                              {phoneLookups[enquiry.whatsappNumber]
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
          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || pageLoading}
                className="w-auto"
              >
                Previous
              </Button>

              {pageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={pageLoading}
                  className="w-auto"
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || pageLoading}
                className="w-auto"
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}

      {/* Create Enquiry Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Field Inquiry</DialogTitle>
            <DialogDescription>
              Add a new digital lead inquiry
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEnquiry} className="space-y-4 mt-4">
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
              <Label htmlFor="reason" className="text-sm">
                Reason for Enquiry *
              </Label>
              <Textarea
                id="reason"
                placeholder="Why are they interested?"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadSource" className="text-sm">
                  Lead Source
                </Label>
                <Select
                  value={formData.leadSourceId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, leadSourceId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadScope" className="text-sm">
                  Lead Scope (Priority)
                </Label>
                <Select
                  value={formData.leadScope}
                  onValueChange={(value) =>
                    setFormData({ ...formData, leadScope: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Interested Model</Label>
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
                                formData.interestedModelId === model.id &&
                                !formData.interestedVariantId;
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
                                        name="interestedModel"
                                        checked={isModelSelected}
                                        onChange={() =>
                                          setFormData({
                                            ...formData,
                                            interestedModelId: model.id,
                                            interestedVariantId: "",
                                          })
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
                                  {hasVariants && (
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
                                            formData.interestedModelId ===
                                              model.id &&
                                            formData.interestedVariantId ===
                                              variant.id;
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
                                                  name="interestedModel"
                                                  checked={isVariantSelected}
                                                  onChange={() =>
                                                    setFormData({
                                                      ...formData,
                                                      interestedModelId:
                                                        model.id,
                                                      interestedVariantId:
                                                        variant.id,
                                                    })
                                                  }
                                                  className="absolute opacity-0 cursor-pointer w-5 h-5"
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
                  "Create Inquiry"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog
        open={bulkUploadDialogOpen}
        onOpenChange={setBulkUploadDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Upload Field Enquiries</DialogTitle>
            <DialogDescription>
              Upload an Excel file (.xlsx or .xls) with columns: Date, Name,
              WhatsApp Number, Location, Model, Source
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBulkUpload} className="space-y-4 mt-4">
            {uploadError && (
              <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                {uploadError}
              </div>
            )}

            {uploadResults && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Upload Results</h3>
                  <Badge
                    variant={
                      uploadResults.summary.errors === 0
                        ? "default"
                        : "secondary"
                    }
                  >
                    {uploadResults.summary.success} /{" "}
                    {uploadResults.summary.total} successful
                  </Badge>
                </div>
                {uploadResults.summary.errors > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <p className="text-xs font-medium text-destructive">
                      Errors ({uploadResults.summary.errors}):
                    </p>
                    <div className="space-y-1 text-xs">
                      {uploadResults.results
                        .filter((r) => !r.success)
                        .map((result, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-background rounded border-l-2 border-destructive"
                          >
                            <span className="font-medium">
                              Row {result.rowNumber}:
                            </span>{" "}
                            {result.error}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {uploadResults.summary.success > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {uploadResults.summary.success} enquiries created
                    successfully. All enquiries have been set to "Cold" lead
                    scope.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="excelFile" className="text-sm">
                Excel File *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="excelFile"
                  type="file"
                  accept=".xlsx,.xls"
                  required
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Required columns: Date, Name, WhatsApp Number, Location, Model,
                Source
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBulkUploadDialogOpen(false);
                  setUploadError("");
                  setUploadResults(null);
                }}
                className="w-full sm:w-auto"
                disabled={uploading}
              >
                {uploadResults ? "Close" : "Cancel"}
              </Button>
              {!uploadResults && (
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full sm:w-auto"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Process
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
