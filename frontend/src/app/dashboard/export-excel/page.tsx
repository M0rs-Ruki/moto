"use client";

import { useState } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { usePermissions } from "@/contexts/permissions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileSpreadsheet,
  Users,
  MessageSquare,
  MapPin,
  Package,
  Loader2,
} from "lucide-react";

type ExportType =
  | "visitors"
  | "digital-enquiry"
  | "field-inquiry"
  | "delivery-tickets";
type DateRange = "1m" | "3m" | "6m" | "1y";

interface ExportSection {
  type: ExportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const exportSections: ExportSection[] = [
  {
    type: "visitors",
    title: "Daily Walkins",
    description:
      "Export visitor data including their interests, sessions, and test drives",
    icon: <Users className="h-6 w-6" />,
    color: "#1976B8",
  },
  {
    type: "digital-enquiry",
    title: "Digital Enquiry",
    description:
      "Export digital enquiry data with lead sources and model interests",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "#1976B8",
  },
  {
    type: "field-inquiry",
    title: "Field Inquiry",
    description:
      "Export field inquiry data with lead information and follow-ups",
    icon: <MapPin className="h-6 w-6" />,
    color: "#1976B8",
  },
  {
    type: "delivery-tickets",
    title: "Delivery Update",
    description:
      "Export delivery ticket data with vehicle and customer details",
    icon: <Package className="h-6 w-6" />,
    color: "#1976B8",
  },
];

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "1m", label: "Last 1 Month" },
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last 1 Year" },
];

export default function ExportExcelPage() {
  const { hasPermission, isAdmin } = usePermissions();
  const [selectedRanges, setSelectedRanges] = useState<
    Record<ExportType, DateRange>
  >({
    visitors: "1m",
    "digital-enquiry": "1m",
    "field-inquiry": "1m",
    "delivery-tickets": "1m",
  });
  const [loadingStates, setLoadingStates] = useState<
    Record<ExportType, boolean>
  >({
    visitors: false,
    "digital-enquiry": false,
    "field-inquiry": false,
    "delivery-tickets": false,
  });

  // Permission check
  if (!isAdmin && !hasPermission("exportExcel")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                You don&apos;t have permission to access the Export Excel
                feature.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExport = async (type: ExportType) => {
    const range = selectedRanges[type];

    setLoadingStates((prev) => ({ ...prev, [type]: true }));

    try {
      const response = await apiClient.get(`/export/${type}`, {
        params: { range },
        responseType: "blob",
      });

      // Extract filename from Content-Disposition header or generate default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `${type}-export.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/"/g, "");
        }
      }

      // Create download link
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `${exportSections.find((s) => s.type === type)?.title} exported successfully!`,
      );
    } catch (error: unknown) {
      console.error("Export error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export data";
      toast.error(errorMessage);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleRangeChange = (type: ExportType, range: DateRange) => {
    setSelectedRanges((prev) => ({ ...prev, [type]: range }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Export Excel</h1>
          <p className="text-muted-foreground mt-1">
            Download your dealership data in Excel format
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Select time range and export</span>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {exportSections.map((section) => (
          <Card key={section.type} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <div style={{ color: section.color }}>{section.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={selectedRanges[section.type]}
                  onValueChange={(value: DateRange) =>
                    handleRangeChange(section.type, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleExport(section.type)}
                  disabled={loadingStates[section.type]}
                  className="flex-1 sm:flex-initial"
                  style={{
                    backgroundColor: section.color,
                    borderColor: section.color,
                  }}
                >
                  {loadingStates[section.type] ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="p-2 rounded-full bg-primary/10 h-fit">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">About Excel Export</h4>
              <p className="text-sm text-muted-foreground">
                Your data will be downloaded as an Excel file (.xlsx) containing
                all records from your dealership within the selected time range.
                The file includes all relevant fields and can be opened in
                Microsoft Excel, Google Sheets, or any compatible spreadsheet
                application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
