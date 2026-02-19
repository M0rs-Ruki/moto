"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/lib/api";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ThemeSwitcherButtons } from "@/components/theme-switcher-buttons";
import { useTheme } from "@/lib/theme-provider";
import { PermissionsProvider, usePermissions } from "@/contexts/permissions";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  LogOut,
  Car,
  FileText,
  Menu,
  X,
  LayoutDashboard,
  DoorOpen,
  Globe,
  MessageSquare,
  Package,
  MapPin,
  FileSpreadsheet,
  Building2,
  BarChart3,
} from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, loading, isAdmin, isSuperAdmin, hasPermission } =
    usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set browser tab title to organization name (fallback to Autopulse)
  useEffect(() => {
    const title =
      user?.organization?.name || user?.dealership?.name || "Autopulse";
    if (typeof document !== "undefined") {
      document.title = title;
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile/Tablet Header */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden border-b bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center h-10 sm:h-12">
            <img
              src="/autopluse-black.png"
              alt="Brand Logo"
              className="h-full w-auto object-contain dark:hidden"
            />
            <img
              src="/autopluse-white.png"
              alt="Brand Logo"
              className="h-full w-auto object-contain hidden dark:block"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0 min-h-[44px] min-w-[44px]"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile/Tablet Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden mt-14 sm:mt-16 sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen w-64 sm:w-64 md:w-72 border-r bg-gradient-to-b from-card to-card/95 shadow-lg sidebar-enter lg:relative lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-56 xl:w-60 lg:shadow-none lg:z-auto ${
            sidebarOpen
              ? "translate-x-0 pt-14 sm:pt-16 lg:pt-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full items-center py-3 px-3">
            {/* Logo/Theme-aware Logo */}
            <div className="mb-1 hidden md:flex items-center justify-center w-full px-2">
              <img
                src="/autopluse-black.png"
                alt="Logo"
                className="h-14 w-full object-contain dark:hidden"
              />
              <img
                src="/autopluse-white.png"
                alt="Logo"
                className="h-14 w-full object-contain hidden dark:block"
              />
            </div>

            {/* Powered by link */}
            <a
              href="https://prominds.digital/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 hidden md:flex items-center justify-center text-[10px] text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Powered by{" "}
              <span className="font-semibold ml-1">Prominds Digital</span>
            </a>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-start space-y-1 w-full overflow-y-auto px-1">
              {/* Dashboard */}
              {hasPermission("dashboard") && (
                <Link
                  prefetch={false}
                  href="/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <LayoutDashboard
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Dashboard</span>
                    {pathname === "/dashboard" && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Daily Walkins */}
              {(hasPermission("dailyWalkinsVisitors") ||
                hasPermission("dailyWalkinsSessions")) && (
                <Link
                  prefetch={false}
                  href="/dashboard/daily-walkins"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={
                      pathname === "/dashboard/daily-walkins" ||
                      pathname?.startsWith("/dashboard/daily-walkins/")
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <DoorOpen
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Daily Walkins</span>
                    {(pathname === "/dashboard/daily-walkins" ||
                      pathname?.startsWith("/dashboard/daily-walkins/")) && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Digital Enquiry */}
              {hasPermission("digitalEnquiry") && (
                <Link
                  prefetch={false}
                  href="/dashboard/digital-enquiry"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={
                      pathname === "/dashboard/digital-enquiry" ||
                      pathname?.startsWith("/dashboard/digital-enquiry/")
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <MessageSquare
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Digital Enquiry</span>
                    {(pathname === "/dashboard/digital-enquiry" ||
                      pathname?.startsWith("/dashboard/digital-enquiry/")) && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Field Inquiry */}
              {hasPermission("fieldInquiry") && (
                <Link
                  prefetch={false}
                  href="/dashboard/field-inquiry"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={
                      pathname === "/dashboard/field-inquiry" ||
                      pathname?.startsWith("/dashboard/field-inquiry/")
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <MapPin
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Field Inquiry</span>
                    {(pathname === "/dashboard/field-inquiry" ||
                      pathname?.startsWith("/dashboard/field-inquiry/")) && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Delivery Update */}
              {hasPermission("deliveryUpdate") && (
                <Link
                  prefetch={false}
                  href="/dashboard/delivery-update"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={
                      pathname === "/dashboard/delivery-update" ||
                      pathname?.startsWith("/dashboard/delivery-update/")
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <Package
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Delivery Update</span>
                    {(pathname === "/dashboard/delivery-update" ||
                      pathname?.startsWith("/dashboard/delivery-update/")) && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Export Excel */}
              {hasPermission("exportExcel") && (
                <Link
                  prefetch={false}
                  href="/dashboard/export-excel"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={
                      pathname === "/dashboard/export-excel" ||
                      pathname?.startsWith("/dashboard/export-excel/")
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <FileSpreadsheet
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Export Excel</span>
                    {(pathname === "/dashboard/export-excel" ||
                      pathname?.startsWith("/dashboard/export-excel/")) && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Settings */}
              {(hasPermission("settingsProfile") ||
                hasPermission("settingsVehicleModels") ||
                hasPermission("settingsLeadSources") ||
                hasPermission("settingsWhatsApp")) && (
                <div className="pt-1.5 border-t w-full mt-auto">
                  <Link
                    prefetch={false}
                    href="/dashboard/global-settings"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/global-settings"
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full h-9 justify-start relative min-h-[36px]"
                    >
                      <Globe
                        className="h-5 w-5 mr-3 flex-shrink-0"
                        style={{ color: "#1976B8" }}
                      />
                      <span className="text-xs font-medium">Settings</span>
                      {pathname === "/dashboard/global-settings" && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                          style={{ backgroundColor: "#1976B8" }}
                        />
                      )}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Role Management - Admin only */}
              {isAdmin && (
                <Link
                  prefetch={false}
                  href="/dashboard/role-management"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={
                      pathname === "/dashboard/role-management" ||
                      pathname?.startsWith("/dashboard/role-management/")
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-9 justify-start relative min-h-[36px]"
                  >
                    <Users
                      className="h-5 w-5 mr-3 flex-shrink-0"
                      style={{ color: "#1976B8" }}
                    />
                    <span className="text-xs font-medium">Role Management</span>
                    {(pathname === "/dashboard/role-management" ||
                      pathname?.startsWith("/dashboard/role-management/")) && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#1976B8" }}
                      />
                    )}
                  </Button>
                </Link>
              )}

              {/* Organization Management - Super Admin only */}
              {isSuperAdmin && (
                <>
                  <div className="pt-1.5 border-t w-full">
                    <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-wider">
                      Organization
                    </p>
                  </div>
                  <Link
                    prefetch={false}
                    href="/dashboard/org-settings"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/org-settings"
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full h-9 justify-start relative min-h-[36px]"
                    >
                      <Building2
                        className="h-5 w-5 mr-3 flex-shrink-0"
                        style={{ color: "#1976B8" }}
                      />
                      <span className="text-xs font-medium">Org Settings</span>
                      {pathname === "/dashboard/org-settings" && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                          style={{ backgroundColor: "#1976B8" }}
                        />
                      )}
                    </Button>
                  </Link>
                  <Link
                    prefetch={false}
                    href="/dashboard/usage-stats"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/usage-stats"
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full h-9 justify-start relative min-h-[36px]"
                    >
                      <BarChart3
                        className="h-5 w-5 mr-3 flex-shrink-0"
                        style={{ color: "#1976B8" }}
                      />
                      <span className="text-xs font-medium">Usage Stats</span>
                      {pathname === "/dashboard/usage-stats" && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                          style={{ backgroundColor: "#1976B8" }}
                        />
                      )}
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            {/* User actions */}
            <div className="border-t w-full pt-2 space-y-1.5 flex flex-col items-start">
              <Button
                variant="ghost"
                className="w-full h-9 justify-start"
                onClick={handleLogout}
              >
                <LogOut
                  className="h-4 w-4 mr-2 flex-shrink-0"
                  style={{ color: "#1976B8" }}
                />
                <span className="text-xs font-medium">Logout</span>
              </Button>
              <div className="w-full">
                <ThemeSwitcherButtons />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full bg-gradient-to-br from-background to-muted/30 mt-14 sm:mt-16 lg:mt-0 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10">
          {/* Responsive container: max-width + mx-auto centers content with space on sides */}
          <div className="max-w-[1600px] mx-auto w-full">
            {/* Breadcrumb & Profile Box */}
            <div className="mb-4 sm:mb-6 lg:mb-8 border bg-card rounded-lg px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex flex-row items-center justify-between shadow-sm gap-3 sm:gap-4">
              <div className="flex-1 min-w-0 flex items-center">
                <Breadcrumb />
              </div>
              {/* User Profile Picture */}
              <button
                onClick={() => router.push("/dashboard/global-settings")}
                className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity shrink-0 min-h-[44px]"
                title="Click to go to settings"
              >
                {user?.profilePicture ? (
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md overflow-hidden border-2"
                    style={{ borderColor: "#1976B8" }}
                  >
                    <img
                      src={
                        user.profilePicture.startsWith("http")
                          ? user.profilePicture
                          : `/${user.profilePicture}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: "#1976B8" }}
                  >
                    Admin
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-md md:text-base font-medium text-foreground">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                  {/* <span className="text-xs text-muted-foreground">
                    {user?.dealership?.name
                      ? `${user.dealership.name}${
                          user.dealership.location
                            ? " · " + user.dealership.location
                            : ""
                        }`
                      : "No dealership assigned"}
                  </span> */}
                </div>
              </button>
            </div>
            {/* Page content */}
            <div>{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionsProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PermissionsProvider>
  );
}
