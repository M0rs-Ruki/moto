"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  MapPin,
  Loader2,
  TrendingUp,
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
  fieldEnquiry: {
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
  color: string;
}

function StatCard({ title, icon, stats, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                Today
              </div>
              <div className="text-lg sm:text-xl font-bold">{stats.today}</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                This Week
              </div>
              <div className="text-lg sm:text-xl font-bold">{stats.week}</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                This Month
              </div>
              <div className="text-lg sm:text-xl font-bold">{stats.month}</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                This Year
              </div>
              <div className="text-lg sm:text-xl font-bold">{stats.year}</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                Total
              </div>
              <div className="text-lg sm:text-xl font-bold">{stats.total}</div>
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
      const response = await axios.get("/api/statistics");
      setStatistics(response.data);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch statistics:", err);
      setError(err.response?.data?.error || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="pb-2 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Overview of all sections
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">{error}</div>
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
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Overview of all sections and activities
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Daily Walkins"
          icon={<DoorOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.dailyWalkins}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Digital Enquiry"
          icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.digitalEnquiry}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Field Enquiry"
          icon={<MapPin className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.fieldEnquiry}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Delivery Update"
          icon={<Package className="h-5 w-5 sm:h-6 sm:w-6" />}
          stats={statistics.deliveryUpdate}
          color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Summary
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Key metrics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                Total Visitors Today
              </div>
              <div className="text-2xl sm:text-3xl font-bold">
                {statistics.dailyWalkins.today}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                Digital Leads This Week
              </div>
              <div className="text-2xl sm:text-3xl font-bold">
                {statistics.digitalEnquiry.week}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                Deliveries This Month
              </div>
              <div className="text-2xl sm:text-3xl font-bold">
                {statistics.deliveryUpdate.month}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                Total Records
              </div>
              <div className="text-2xl sm:text-3xl font-bold">
                {statistics.dailyWalkins.total +
                  statistics.digitalEnquiry.total +
                  statistics.deliveryUpdate.total}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
