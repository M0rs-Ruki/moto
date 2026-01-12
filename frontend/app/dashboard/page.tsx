"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DoorOpen,
  MessageSquare,
  Package,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Activity,
  MapPin,
} from "lucide-react";
import DashboardLoading from "./loading";

interface Statistics {
  dailyWalkins: {
    today: number;
    week: number;
    month: number;
    year: number;
    total: number;
  };
  digitalEnquiry: {
    today: number;
    week: number;
    month: number;
    year: number;
    total: number;
  };
  fieldInquiry: {
    today: number;
    week: number;
    month: number;
    year: number;
    total: number;
  };
  deliveryUpdate: {
    today: number;
    week: number;
    month: number;
    year: number;
    total: number;
  };
}

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  stats: {
    today: number;
    week: number;
    month: number;
    year: number;
    total: number;
  };
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

function StatCard({
  title,
  icon,
  stats,
  iconBg,
  iconColor,
  borderColor,
}: StatCardProps) {
  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor} group`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            {title}
          </CardTitle>
          <div
            className={`p-2.5 rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Highlight Today's stat */}
          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Today
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {stats.today}
            </div>
          </div>

          {/* Other stats in grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-medium">
                This Week
              </div>
              <div className="text-lg sm:text-xl font-semibold">
                {stats.week}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-medium">
                This Month
              </div>
              <div className="text-lg sm:text-xl font-semibold">
                {stats.month}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-medium">
                This Year
              </div>
              <div className="text-lg sm:text-xl font-semibold">
                {stats.year}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-medium">
                Total
              </div>
              <div className="text-lg sm:text-xl font-semibold">
                {stats.total}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get("/statistics");
      setStatistics(response.data);
      setError("");
    } catch (err: unknown) {
      console.error("Failed to fetch statistics:", err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="pb-4 border-b">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Overview of all sections and activities
          </p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center text-destructive font-medium">
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Overview of all sections and activities
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-4 w-4 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Daily Walkins"
          icon={<DoorOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.dailyWalkins}
          iconBg="bg-blue-500/10 dark:bg-blue-400/20"
          iconColor="text-blue-600 dark:text-blue-400"
          borderColor="border-blue-500"
        />
        <StatCard
          title="Digital Enquiry"
          icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.digitalEnquiry}
          iconBg="bg-green-500/10 dark:bg-green-400/20"
          iconColor="text-green-600 dark:text-green-400"
          borderColor="border-green-500"
        />
        <StatCard
          title="Field Inquiry"
          icon={<MapPin className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.fieldInquiry}
          iconBg="bg-purple-500/10 dark:bg-purple-400/20"
          iconColor="text-purple-600 dark:text-purple-400"
          borderColor="border-purple-500"
        />
        <StatCard
          title="Delivery Update"
          icon={<Package className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.deliveryUpdate}
          iconBg="bg-orange-500/10 dark:bg-orange-400/20"
          iconColor="text-orange-600 dark:text-orange-400"
          borderColor="border-orange-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Metrics
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Important statistics at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Users className="h-3.5 w-3.5" />
                  Visitors Today
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {statistics.dailyWalkins.today}
                </div>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Digital Leads (Week)
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {statistics.digitalEnquiry.week}
                </div>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Package className="h-3.5 w-3.5" />
                  Deliveries (Month)
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {statistics.deliveryUpdate.month}
                </div>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Total Records
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {statistics.dailyWalkins.total +
                    statistics.digitalEnquiry.total +
                    statistics.fieldInquiry.total +
                    statistics.deliveryUpdate.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary/50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Activity Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Recent activity summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Daily Walkins
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total entries
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {statistics.dailyWalkins.total}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Digital Enquiries
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total entries
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {statistics.digitalEnquiry.total}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Delivery Updates
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total entries
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {statistics.deliveryUpdate.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
