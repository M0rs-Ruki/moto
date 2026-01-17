"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/lib/api";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ThemeSwitcherButtons } from "@/components/theme-switcher-buttons";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name?: string;
  theme: string;
  profilePicture: string | null;
  dealership: {
    id: string;
    name: string;
    location: string;
  } | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchUser();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchUser = async () => {
    // Prevent duplicate fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const response = await apiClient.get("/auth/me");
      if (mountedRef.current) {
        setUser(response.data.user);
      }
    } catch (error) {
      if (mountedRef.current) {
        router.push("/login");
      }
    } finally {
      fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

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
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Showroom Manager</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden mt-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen w-64 border-r bg-gradient-to-b from-card to-card/95 shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen md:w-64 md:shadow-none md:z-auto ${
            sidebarOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full items-center py-4 px-4">
            {/* Logo/Theme-aware Logo */}
            <div className="mb-2 hidden md:flex items-center justify-center w-full">
              <img
                src={
                  theme === "dark"
                    ? "/Autopluse White1.png"
                    : "/Autopluse Black1.png"
                }
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Powered by link */}
            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 hidden md:flex items-center justify-center text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              powered by{" "}
              <span className="font-semibold ml-1">Prominds Digital</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-start space-y-1 w-full overflow-y-auto">
              {/* Dashboard */}
              <Link
                prefetch={false}
                href="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="w-full"
              >
                <Button
                  variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                  className="w-full h-12 justify-start relative"
                >
                  <LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Dashboard</span>
                  {pathname === "/dashboard" && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </Button>
              </Link>

              {/* Daily Walkins */}
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
                  className="w-full h-12 justify-start relative"
                >
                  <DoorOpen className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Daily Walkins</span>
                  {(pathname === "/dashboard/daily-walkins" ||
                    pathname?.startsWith("/dashboard/daily-walkins/")) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </Button>
              </Link>

              {/* Digital Enquiry */}
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
                  className="w-full h-12 justify-start relative"
                >
                  <MessageSquare className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Digital Enquiry</span>
                  {(pathname === "/dashboard/digital-enquiry" ||
                    pathname?.startsWith("/dashboard/digital-enquiry/")) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </Button>
              </Link>

              {/* Field Inquiry */}
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
                  className="w-full h-12 justify-start relative"
                >
                  <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Field Inquiry</span>
                  {(pathname === "/dashboard/field-inquiry" ||
                    pathname?.startsWith("/dashboard/field-inquiry/")) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </Button>
              </Link>

              {/* Delivery Update */}
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
                  className="w-full h-12 justify-start relative"
                >
                  <Package className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Delivery Update</span>
                  {(pathname === "/dashboard/delivery-update" ||
                    pathname?.startsWith("/dashboard/delivery-update/")) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </Button>
              </Link>

              {/* Settings */}
              <div className="pt-2 border-t w-full mt-auto">
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
                    className="w-full h-12 justify-start relative"
                  >
                    <Globe className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">Settings</span>
                    {pathname === "/dashboard/global-settings" && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                    )}
                  </Button>
                </Link>
              </div>
            </nav>

            {/* User actions */}
            <div className="border-t w-full pt-4 space-y-2 flex flex-col items-start">
              <Button
                variant="ghost"
                className="w-full h-12 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Logout</span>
              </Button>
              <div className="w-full">
                <ThemeSwitcherButtons />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full bg-gradient-to-br from-background to-muted/30 mt-16 md:mt-0 p-4 sm:p-6 md:p-8">
          {/* Breadcrumb & Profile Box */}
          <div className="mb-6 border bg-card rounded-lg px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between shadow-sm">
            <Breadcrumb />
            {/* User Profile Picture */}
            <button
              onClick={() => router.push("/dashboard/global-settings")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-4"
              title="Click to go to settings"
            >
              {user?.profilePicture ? (
                <div className="w-8 h-8 rounded-md overflow-hidden border-2 border-blue-600 dark:border-blue-400">
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
                <div className="w-8 h-8 rounded-md bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-xs font-bold text-white">
                  Admin
                </div>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.name || user?.email?.split("@")[0] || "User"}
              </span>
            </button>
          </div>
          {/* Page content */}
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
