"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Shield,
  ShieldCheck,
  User as UserIcon,
  BarChart3,
  DoorOpen,
  MessageSquare,
  MapPin,
  Package,
  Calendar,
  Mail,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCw,
  Users,
} from "lucide-react";
import UsageStatsLoading from "./loading";

interface UserWithStats {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserDetails {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  dealership: { id: string; name: string } | null;
  lastActive: string | null;
  activityStats: {
    visitors: number;
    digitalEnquiries: number;
    fieldInquiries: number;
    deliveryTickets: number;
  };
}

interface StatsTotals {
  visitors: number;
  digitalEnquiries: number;
  fieldInquiries: number;
  deliveryTickets: number;
}

export default function UsageStatsPage() {
  const router = useRouter();
  const { isSuperAdmin, loading: permissionsLoading } = usePermissions();
  const [userStats, setUserStats] = useState<UserWithStats[]>([]);
  const [statsTotals, setStatsTotals] = useState<StatsTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    if (!permissionsLoading && !isSuperAdmin) {
      router.push("/dashboard/role-management");
      return;
    }
    if (isSuperAdmin) {
      fetchUserStats();
    }
  }, [isSuperAdmin, permissionsLoading, router]);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/organizations/user-stats");
      setUserStats(response.data.users);
      if (response.data.totals) {
        setStatsTotals(response.data.totals);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      toast.error("Failed to fetch user statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setLoadingUserDetails(true);
    setUserDetailsOpen(true);
    try {
      const response = await apiClient.get(
        `/organizations/user-stats/${userId}`,
      );
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to fetch user details");
      setUserDetailsOpen(false);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-[10px] sm:text-xs">
            <ShieldCheck className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Super Admin</span>
            <span className="sm:hidden">S.Admin</span>
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] sm:text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            <UserIcon className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
    }
  };

  if (permissionsLoading || loading) {
    return <UsageStatsLoading />;
  }

  if (!isSuperAdmin) {
    return null;
  }

  const totalActivity =
    (statsTotals?.visitors || 0) +
    (statsTotals?.digitalEnquiries || 0) +
    (statsTotals?.fieldInquiries || 0) +
    (statsTotals?.deliveryTickets || 0);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Usage Statistics
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
              Organization-wide activity overview
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUserStats}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Totals Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <DoorOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {statsTotals?.visitors || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Daily Walkins
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {statsTotals?.digitalEnquiries || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Digital Enquiry
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {statsTotals?.fieldInquiries || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Field Inquiry
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {statsTotals?.deliveryTickets || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Delivery Update
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {totalActivity}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Total Activity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Organization Users
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Click on a user to view their activity details
              </CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit">
              {userStats.length} {userStats.length === 1 ? "user" : "users"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : userStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">User</TableHead>
                    <TableHead className="text-xs sm:text-sm">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userStats.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fetchUserDetails(user.id)}
                    >
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-2 sm:hidden mt-1">
                              {user.isActive ? (
                                <span className="flex items-center gap-1 text-[10px] text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] text-red-600">
                                  <XCircle className="h-3 w-3" />
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.isActive ? (
                          <Badge className="bg-green-600 hover:bg-green-700 text-[10px] sm:text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="text-[10px] sm:text-xs"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs sm:text-sm hidden md:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              User Details
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              View user information and activity statistics
            </DialogDescription>
          </DialogHeader>

          {loadingUserDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Email
                      </p>
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Role
                      </p>
                      <div className="mt-0.5">
                        {getRoleBadge(selectedUser.role)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    {selectedUser.isActive ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Status
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.dealership && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Dealership
                        </p>
                        <p className="font-medium text-xs sm:text-sm truncate">
                          {selectedUser.dealership.name}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Joined
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Last Active
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {selectedUser.lastActive
                          ? new Date(selectedUser.lastActive).toLocaleString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity Stats */}
              {selectedUser.activityStats && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                    Activity Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                        <DoorOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {selectedUser.activityStats.visitors}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Daily Walkins
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {selectedUser.activityStats.digitalEnquiries}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Digital Enquiry
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-400">
                          {selectedUser.activityStats.fieldInquiries}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Field Inquiry
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 dark:bg-green-900">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-400">
                          {selectedUser.activityStats.deliveryTickets}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Delivery Update
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg sm:text-2xl font-bold">
                          {(selectedUser.activityStats.visitors || 0) +
                            (selectedUser.activityStats.digitalEnquiries || 0) +
                            (selectedUser.activityStats.fieldInquiries || 0) +
                            (selectedUser.activityStats.deliveryTickets || 0)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Total Activity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
