"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { usePermissions } from "@/contexts/permissions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  DoorOpen,
  MessageSquare,
  MapPin,
  Package,
  FileSpreadsheet,
  Settings,
  Save,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

interface FeatureToggles {
  id?: string;
  dashboard: boolean;
  dailyWalkinsVisitors: boolean;
  dailyWalkinsSessions: boolean;
  digitalEnquiry: boolean;
  fieldInquiry: boolean;
  deliveryUpdate: boolean;
  exportExcel: boolean;
  settingsProfile: boolean;
  settingsVehicleModels: boolean;
  settingsLeadSources: boolean;
  settingsWhatsApp: boolean;
}

interface FeatureConfig {
  key: keyof Omit<FeatureToggles, "id">;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "core" | "settings";
}

const featureConfigs: FeatureConfig[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Main analytics dashboard with statistics",
    icon: <LayoutDashboard className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "dailyWalkinsVisitors",
    label: "Daily Walkins - Visitors",
    description: "Track and manage walk-in visitors",
    icon: <DoorOpen className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "dailyWalkinsSessions",
    label: "Daily Walkins - Sessions",
    description: "Manage visitor sessions and follow-ups",
    icon: <DoorOpen className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "digitalEnquiry",
    label: "Digital Enquiry",
    description: "Manage online and digital enquiries",
    icon: <MessageSquare className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "fieldInquiry",
    label: "Field Inquiry",
    description: "Track field sales and outdoor enquiries",
    icon: <MapPin className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "deliveryUpdate",
    label: "Delivery Update",
    description: "Manage vehicle delivery schedules and notifications",
    icon: <Package className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "exportExcel",
    label: "Export Excel",
    description: "Export data to Excel spreadsheets",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    category: "core",
  },
  {
    key: "settingsProfile",
    label: "Settings - Profile",
    description: "User profile and appearance settings",
    icon: <Settings className="h-4 w-4" />,
    category: "settings",
  },
  {
    key: "settingsVehicleModels",
    label: "Settings - Vehicle Models",
    description: "Manage vehicle categories and models",
    icon: <Settings className="h-4 w-4" />,
    category: "settings",
  },
  {
    key: "settingsLeadSources",
    label: "Settings - Lead Sources",
    description: "Configure lead source options",
    icon: <Settings className="h-4 w-4" />,
    category: "settings",
  },
  {
    key: "settingsWhatsApp",
    label: "Settings - WhatsApp",
    description: "WhatsApp message templates and integration",
    icon: <Settings className="h-4 w-4" />,
    category: "settings",
  },
];

export default function OrgSettingsPage() {
  const router = useRouter();
  const {
    user,
    isSuperAdmin,
    loading: permissionsLoading,
    refreshPermissions,
  } = usePermissions();
  const [featureToggles, setFeatureToggles] = useState<FeatureToggles | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalToggles, setOriginalToggles] = useState<FeatureToggles | null>(
    null,
  );

  // Redirect non-super-admins
  useEffect(() => {
    if (!permissionsLoading && !isSuperAdmin) {
      router.push("/dashboard");
    }
  }, [isSuperAdmin, permissionsLoading, router]);

  // Fetch feature toggles
  useEffect(() => {
    if (isSuperAdmin) {
      fetchFeatureToggles();
    }
  }, [isSuperAdmin]);

  const fetchFeatureToggles = async () => {
    try {
      const response = await apiClient.get("/organizations/feature-toggles");
      const toggles = response.data.featureToggles || getDefaultToggles();
      setFeatureToggles(toggles);
      setOriginalToggles(toggles);
    } catch (error) {
      console.error("Failed to fetch feature toggles:", error);
      // Set defaults if fetch fails
      const defaults = getDefaultToggles();
      setFeatureToggles(defaults);
      setOriginalToggles(defaults);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultToggles = (): FeatureToggles => ({
    dashboard: true,
    dailyWalkinsVisitors: true,
    dailyWalkinsSessions: true,
    digitalEnquiry: true,
    fieldInquiry: true,
    deliveryUpdate: true,
    exportExcel: true,
    settingsProfile: true,
    settingsVehicleModels: true,
    settingsLeadSources: true,
    settingsWhatsApp: true,
  });

  const handleToggleChange = (
    key: keyof Omit<FeatureToggles, "id">,
    value: boolean,
  ) => {
    if (!featureToggles) return;

    const newToggles = { ...featureToggles, [key]: value };
    setFeatureToggles(newToggles);

    // Check if there are changes
    const changed = Object.keys(newToggles).some(
      (k) =>
        k !== "id" &&
        newToggles[k as keyof FeatureToggles] !==
          originalToggles?.[k as keyof FeatureToggles],
    );
    setHasChanges(changed);
  };

  const handleSave = async () => {
    if (!featureToggles) return;

    setSaving(true);
    try {
      const { id, ...togglesWithoutId } = featureToggles;
      await apiClient.patch("/organizations/feature-toggles", togglesWithoutId);
      toast.success("Feature toggles saved successfully");
      setOriginalToggles(featureToggles);
      setHasChanges(false);
      // Refresh permissions to update the UI
      await refreshPermissions();
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to save feature toggles",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalToggles) {
      setFeatureToggles(originalToggles);
      setHasChanges(false);
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSuperAdmin || !featureToggles) {
    return null;
  }

  const coreFeatures = featureConfigs.filter((f) => f.category === "core");
  const settingsFeatures = featureConfigs.filter(
    (f) => f.category === "settings",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Organization Settings
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage feature availability for your entire organization:{" "}
            {user?.organization?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Feature Gates:</strong> Disabling a feature here will hide
            it from <em>all users</em> in your organization, regardless of their
            individual permissions. This is useful for controlling which modules
            are available across your organization.
          </p>
        </CardContent>
      </Card>

      {/* Core Features */}
      <Card>
        <CardHeader>
          <CardTitle>Core Features</CardTitle>
          <CardDescription>
            Main application features available to your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {coreFeatures.map((feature, index) => (
            <div key={feature.key}>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">
                    {feature.icon}
                  </div>
                  <div>
                    <Label
                      htmlFor={feature.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {feature.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      featureToggles[feature.key] ? "default" : "secondary"
                    }
                  >
                    {featureToggles[feature.key] ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    id={feature.key}
                    checked={featureToggles[feature.key]}
                    onCheckedChange={(value) =>
                      handleToggleChange(feature.key, value)
                    }
                  />
                </div>
              </div>
              {index < coreFeatures.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings Features */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Features</CardTitle>
          <CardDescription>
            Configuration and settings options for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settingsFeatures.map((feature, index) => (
            <div key={feature.key}>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">
                    {feature.icon}
                  </div>
                  <div>
                    <Label
                      htmlFor={feature.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {feature.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      featureToggles[feature.key] ? "default" : "secondary"
                    }
                  >
                    {featureToggles[feature.key] ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    id={feature.key}
                    checked={featureToggles[feature.key]}
                    onCheckedChange={(value) =>
                      handleToggleChange(feature.key, value)
                    }
                  />
                </div>
              </div>
              {index < settingsFeatures.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
