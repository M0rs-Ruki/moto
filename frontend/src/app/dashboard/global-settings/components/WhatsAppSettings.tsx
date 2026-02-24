"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { getCachedData, setCachedData } from "@/lib/cache";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { usePermissions } from "@/contexts/permissions";

interface WhatsAppTemplate {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  language: string;
  type: string;
  section?: string;
}

export default function WhatsAppSettings() {
  const { hasPermission } = usePermissions();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const [dealershipForm, setDealershipForm] = useState({
    showroomNumber: "",
  });
  const [savingDealership, setSavingDealership] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    const cachedTemplates = getCachedData<any[]>(
      "cache_settings_templates",
      300000,
    ); // 5 minutes
    if (cachedTemplates) {
      setTemplates(cachedTemplates);
      setLoading(false);

      // Check cache age - refresh in background if stale
      try {
        const cacheEntry = JSON.parse(
          sessionStorage.getItem("cache_settings_templates") || "{}",
        );
        const cacheAge = Date.now() - (cacheEntry.timestamp || 0);
        if (cacheAge > 30000 && mountedRef.current && !fetchingRef.current) {
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              fetchData();
            }
          }, 500);
        }
      } catch {
        // If cache parsing fails, fetch normally
        fetchData();
      }
    } else {
      fetchData();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      setLoading(true);
      const [templatesRes, dealershipRes] = await Promise.all([
        apiClient.get("/templates"),
        apiClient.get("/dealership"),
      ]);

      const templatesData = templatesRes.data?.templates || [];
      setTemplates(templatesData);
      setCachedData("cache_settings_templates", templatesData);

      if (dealershipRes.data?.dealership) {
        setDealershipForm({
          showroomNumber: dealershipRes.data.dealership.showroomNumber || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleUpdateTemplate = async (template: WhatsAppTemplate) => {
    if (!hasPermission("settingsWhatsApp")) {
      toast.error("You don't have permission to update templates");
      return;
    }
    if (!template?.id) {
      toast.error("Invalid template");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        id: String(template.id),
        name: String(template.name ?? ""),
        templateId: String(template.templateId ?? ""),
        templateName: String(template.templateName ?? ""),
        language: String(template.language ?? "en_US"),
        section: String(template.section ?? "global"),
      };
      await apiClient.put("/templates", payload);
      toast.success("Template saved");
      fetchData();
    } catch (error: unknown) {
      console.error("Failed to update template:", error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDealership = async () => {
    if (!hasPermission("settingsProfile")) {
      toast.error("You don't have permission to update showroom number");
      return;
    }
    setSavingDealership(true);
    try {
      await apiClient.put("/dealership", {
        showroomNumber: dealershipForm.showroomNumber,
      });
      await fetchData();
    } catch (error) {
      console.error("Failed to update dealership:", error);
      toast.error("Failed to update showroom number");
    } finally {
      setSavingDealership(false);
    }
  };

  if (!hasPermission("settingsWhatsApp")) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm sm:text-base">
              You don't have permission to access this section.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            WhatsApp Templates
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Configure template IDs and names for WhatsApp messages. Leave both
            empty to disable WhatsApp for that template.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="border rounded-lg p-3 sm:p-4 space-y-3 bg-muted/30">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm sm:text-base">
                Showroom Number
              </h3>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phone Number</Label>
              <Input
                value={dealershipForm.showroomNumber}
                onChange={(e) =>
                  setDealershipForm({
                    ...dealershipForm,
                    showroomNumber: e.target.value,
                  })
                }
                placeholder="e.g., +1234567890"
                className="text-xs sm:text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This number will be used in template parameters when sending
                messages
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleUpdateDealership}
              disabled={savingDealership}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {savingDealership ? (
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              )}
              Save Number
            </Button>
          </div>

          <div className="border-t pt-4">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
                Loading templates...
              </p>
            ) : templates.length === 0 ? (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
                No templates found
              </p>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-3 sm:p-4 space-y-3 mb-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {template.name}
                    </h3>
                    <span className="text-xs text-muted-foreground uppercase whitespace-nowrap">
                      {template.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Template ID</Label>
                      <Input
                        value={template.templateId || ""}
                        onChange={(e) => {
                          const updated = templates.map((t) =>
                            t.id === template.id
                              ? { ...t, templateId: e.target.value }
                              : t,
                          );
                          setTemplates(updated);
                        }}
                        placeholder="e.g., 728805729727726 (leave empty to disable)"
                        className="text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Template Name</Label>
                      <Input
                        value={template.templateName || ""}
                        onChange={(e) => {
                          const updated = templates.map((t) =>
                            t.id === template.id
                              ? { ...t, templateName: e.target.value }
                              : t,
                          );
                          setTemplates(updated);
                        }}
                        placeholder="e.g., welcome_msg (leave empty to disable)"
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave both Template ID and Template Name empty to stop
                    sending WhatsApp messages for this template.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateTemplate(template)}
                    disabled={saving}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    Save
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
