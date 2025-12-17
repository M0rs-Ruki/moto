"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ChevronDown,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  theme: string;
  accentColor: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Track which sections are open
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["daily-walkins"]) // Default to open
  );

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
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
    <div className="min-h-screen bg-background flex">
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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 md:sticky md:top-0 md:w-64 md:shadow-none ${
          sidebarOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Brand - Hidden on mobile with header */}
          <div className="mb-8 hidden md:block">
            <h1 className="text-xl font-bold">Showroom Manager</h1>
            {user?.dealership && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {user.dealership.name}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {/* Dashboard - Always visible */}
            <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
              >
                <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Dashboard</span>
              </Button>
            </Link>

            {/* Daily Walkins */}
            <Link
              href="/dashboard/daily-walkins"
              onClick={() => setSidebarOpen(false)}
            >
              <Button
                variant={
                  pathname === "/dashboard/daily-walkins" ||
                  pathname?.startsWith("/dashboard/daily-walkins/")
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start text-left"
              >
                <DoorOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Daily Walkins</span>
              </Button>
            </Link>

            {/* Digital Enquiry Section */}
            <Collapsible
              open={openSections.has("digital-enquiry")}
              onOpenChange={(open) => {
                setOpenSections((prev) => {
                  const newSet = new Set(prev);
                  if (open) {
                    newSet.add("digital-enquiry");
                  } else {
                    newSet.delete("digital-enquiry");
                  }
                  return newSet;
                });
              }}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left"
                >
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Digital Enquiry</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openSections.has("digital-enquiry") ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-6 space-y-1 mt-1">
                  <Link
                    href="/dashboard/digital-enquiry"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/digital-enquiry" ||
                        pathname === "/dashboard/digital-enquiry/create"
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start text-left text-sm"
                      size="sm"
                    >
                      <MessageSquare className="mr-2 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">Inquiries</span>
                    </Button>
                  </Link>
                  <Link
                    href="/dashboard/digital-enquiry/sessions"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/digital-enquiry/sessions"
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start text-left text-sm"
                      size="sm"
                    >
                      <FileText className="mr-2 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">Sessions</span>
                    </Button>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Field Enquiry Section */}
            <Collapsible
              open={openSections.has("field-enquiry")}
              onOpenChange={(open) => {
                setOpenSections((prev) => {
                  const newSet = new Set(prev);
                  if (open) {
                    newSet.add("field-enquiry");
                  } else {
                    newSet.delete("field-enquiry");
                  }
                  return newSet;
                });
              }}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left"
                >
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Field Enquiry</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openSections.has("field-enquiry") ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-6 space-y-1 mt-1">
                  <Link
                    href="/dashboard/field-enquiry"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/field-enquiry"
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start text-left text-sm"
                      size="sm"
                    >
                      <MapPin className="mr-2 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">Coming Soon</span>
                    </Button>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Delivery Update Section */}
            <Collapsible
              open={openSections.has("delivery-update")}
              onOpenChange={(open) => {
                setOpenSections((prev) => {
                  const newSet = new Set(prev);
                  if (open) {
                    newSet.add("delivery-update");
                  } else {
                    newSet.delete("delivery-update");
                  }
                  return newSet;
                });
              }}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left"
                >
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Delivery Update</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openSections.has("delivery-update") ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-6 space-y-1 mt-1">
                  <Link
                    href="/dashboard/delivery-update"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Button
                      variant={
                        pathname === "/dashboard/delivery-update" ||
                        pathname?.startsWith(
                          "/dashboard/delivery-update/tickets"
                        )
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start text-left text-sm"
                      size="sm"
                    >
                      <Package className="mr-2 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">Tickets</span>
                    </Button>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Global Settings - Always visible */}
            <div className="pt-2 border-t mt-2">
              <Link
                href="/dashboard/global-settings"
                onClick={() => setSidebarOpen(false)}
              >
                <Button
                  variant={
                    pathname === "/dashboard/global-settings"
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start text-left"
                >
                  <Globe className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Global Settings</span>
                </Button>
              </Link>
            </div>
          </nav>

          {/* User info and actions */}
          <div className="border-t pt-4 space-y-2">
            <div className="px-2 py-1 text-xs sm:text-sm text-muted-foreground truncate">
              {user?.email}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ThemeSwitcher />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full bg-gradient-to-br from-background to-muted/30 p-4 sm:p-6 md:p-8 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}
