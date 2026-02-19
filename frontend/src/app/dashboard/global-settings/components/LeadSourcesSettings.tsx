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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { usePermissions } from "@/contexts/permissions";

interface LeadSource {
  id: string;
  name: string;
  order: number;
  isDefault: boolean;
}

export default function LeadSourcesSettings() {
  const { hasPermission } = usePermissions();
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  const [newLeadSource, setNewLeadSource] = useState("");
  const [leadSourceDialogOpen, setLeadSourceDialogOpen] = useState(false);
  const [deleteLeadSourceDialogOpen, setDeleteLeadSourceDialogOpen] =
    useState(false);
  const [leadSourceToDelete, setLeadSourceToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    mountedRef.current = true;
    const cachedLeadSources = getCachedData<any[]>(
      "cache_settings_lead_sources",
      300000,
    ); // 5 minutes
    if (cachedLeadSources) {
      setLeadSources(cachedLeadSources);
      setLoading(false);

      // Check cache age - refresh in background if stale
      try {
        const cacheEntry = JSON.parse(
          sessionStorage.getItem("cache_settings_lead_sources") || "{}",
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
      const response = await apiClient.get("/lead-sources");
      const leadSourcesData = response.data?.leadSources || [];
      setLeadSources(leadSourcesData);
      setCachedData("cache_settings_lead_sources", leadSourcesData);
    } catch (error) {
      console.error("Failed to fetch lead sources:", error);
    } finally {
      fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleCreateLeadSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission("settingsLeadSources")) {
      toast.error("You don't have permission to create lead sources");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/lead-sources", { name: newLeadSource });
      setNewLeadSource("");
      setLeadSourceDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create lead source:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLeadSource = async () => {
    if (!leadSourceToDelete || !hasPermission("settingsLeadSources")) return;
    setSaving(true);
    try {
      await apiClient.delete("/lead-sources", {
        data: { id: leadSourceToDelete },
      });
      setDeleteLeadSourceDialogOpen(false);
      setLeadSourceToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete lead source:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!hasPermission("settingsLeadSources")) {
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
        <CardHeader className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="w-full">
              <CardTitle className="text-lg sm:text-xl">Lead Sources</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage lead source options for Digital Enquiry
              </CardDescription>
            </div>
            <Dialog
              open={leadSourceDialogOpen}
              onOpenChange={setLeadSourceDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add Lead Source
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg">Add Lead Source</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Create a new lead source option
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleCreateLeadSource}
                  className="space-y-4 mt-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="lead-source-name" className="text-sm">
                      Lead Source Name
                    </Label>
                    <Input
                      id="lead-source-name"
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value)}
                      placeholder="e.g., Facebook Ads"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLeadSourceDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : leadSources.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
              No lead sources yet. Click "Add Lead Source" to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {leadSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-medium">
                      {source.name}
                    </span>
                    {source.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setLeadSourceToDelete(source.id);
                      setDeleteLeadSourceDialogOpen(true);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteLeadSourceDialogOpen}
        onOpenChange={setDeleteLeadSourceDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Lead Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead source? This action
              cannot be undone. If this lead source is being used by any digital
              enquiries, it cannot be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteLeadSourceDialogOpen(false);
                setLeadSourceToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteLeadSource}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
