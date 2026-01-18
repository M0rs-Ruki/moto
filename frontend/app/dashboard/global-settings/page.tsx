"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/contexts/permissions";
import SettingsLoading from "./loading";
import ProfileSettings from "./components/ProfileSettings";
import VehicleModelsSettings from "./components/VehicleModelsSettings";
import LeadSourcesSettings from "./components/LeadSourcesSettings";
import WhatsAppSettings from "./components/WhatsAppSettings";

export default function SettingsPage() {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <SettingsLoading />;
  }

  const hasProfile = hasPermission("settingsProfile");
  const hasVehicleModels = hasPermission("settingsVehicleModels");
  const hasLeadSources = hasPermission("settingsLeadSources");
  const hasWhatsApp = hasPermission("settingsWhatsApp");

  // Determine default tab based on available permissions
  const getDefaultTab = () => {
    if (hasProfile) return "profile";
    if (hasVehicleModels) return "vehicles";
    if (hasLeadSources) return "lead-sources";
    if (hasWhatsApp) return "templates";
    return "profile";
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  // If user has no permissions, show access denied
  if (!hasProfile && !hasVehicleModels && !hasLeadSources && !hasWhatsApp) {
    return (
      <div className="space-y-8">
        <div className="pb-2 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Configure vehicle models, WhatsApp templates, lead sources, and appearance
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have permission to access any settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Configure vehicle models, WhatsApp templates, lead sources, and appearance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-xs sm:text-base">
          {hasProfile && <TabsTrigger value="profile">Profile & Appearance</TabsTrigger>}
          {hasVehicleModels && <TabsTrigger value="vehicles">Vehicle Models</TabsTrigger>}
          {hasLeadSources && <TabsTrigger value="lead-sources">Lead Sources</TabsTrigger>}
          {hasWhatsApp && <TabsTrigger value="templates">WhatsApp</TabsTrigger>}
        </TabsList>

        {hasProfile && (
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
        )}

        {hasVehicleModels && (
          <TabsContent value="vehicles" className="space-y-4">
            <VehicleModelsSettings />
          </TabsContent>
        )}

        {hasLeadSources && (
          <TabsContent value="lead-sources" className="space-y-4">
            <LeadSourcesSettings />
          </TabsContent>
        )}

        {hasWhatsApp && (
          <TabsContent value="templates" className="space-y-4">
            <WhatsAppSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
