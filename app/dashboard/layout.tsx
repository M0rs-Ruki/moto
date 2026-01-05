"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        className={`fixed left-0 top-0 z-40 h-screen w-16 border-r bg-gradient-to-b from-card to-card/95 shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 md:sticky md:top-0 md:w-16 md:shadow-none ${
          sidebarOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full items-center py-4">
            {/* Logo/Profile Picture - Hidden on mobile with header */}
            <div className="mb-6 hidden md:flex items-center justify-center">
              {user?.profilePicture ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary">
                  <img
                    src={user.profilePicture.startsWith("http") ? user.profilePicture : `/${user.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to SM if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-primary-foreground font-bold text-lg flex items-center justify-center w-full h-full bg-primary">SM</span>';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">SM</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-center space-y-2 w-full px-2 overflow-y-auto">
              {/* Dashboard */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="w-full">
                    <Button
                      variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                      size="icon"
                      className="w-full h-12 relative"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      {pathname === "/dashboard" && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Dashboard</p>
                </TooltipContent>
              </Tooltip>

              {/* Daily Walkins */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
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
                      size="icon"
                      className="w-full h-12 relative"
                    >
                      <DoorOpen className="h-5 w-5" />
                      {(pathname === "/dashboard/daily-walkins" ||
                        pathname?.startsWith("/dashboard/daily-walkins/")) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Daily Walkins</p>
                </TooltipContent>
              </Tooltip>

              {/* Digital Enquiry */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
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
                      size="icon"
                      className="w-full h-12 relative"
                    >
                      <MessageSquare className="h-5 w-5" />
                      {(pathname === "/dashboard/digital-enquiry" ||
                        pathname?.startsWith("/dashboard/digital-enquiry/")) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Digital Enquiry</p>
                </TooltipContent>
              </Tooltip>

              {/* Field Inquiry */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
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
                      size="icon"
                      className="w-full h-12 relative"
                    >
                      <MapPin className="h-5 w-5" />
                      {(pathname === "/dashboard/field-inquiry" ||
                        pathname?.startsWith("/dashboard/field-inquiry/")) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Field Inquiry</p>
                </TooltipContent>
              </Tooltip>

              {/* Delivery Update */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
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
                      size="icon"
                      className="w-full h-12 relative"
                    >
                      <Package className="h-5 w-5" />
                      {(pathname === "/dashboard/delivery-update" ||
                        pathname?.startsWith("/dashboard/delivery-update/")) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Delivery Update</p>
                </TooltipContent>
              </Tooltip>

              {/* Settings */}
              <div className="pt-2 border-t w-full mt-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
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
                        size="icon"
                        className="w-full h-12 relative"
                      >
                        <Globe className="h-5 w-5" />
                        {pathname === "/dashboard/global-settings" && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </nav>

            {/* User actions */}
            <div className="border-t w-full pt-4 space-y-2 flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeSwitcher />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-12 w-12"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full bg-gradient-to-br from-background to-muted/30 p-4 sm:p-6 md:p-8 mt-16 md:mt-0 md:ml-16">
        {children}
      </main>
    </div>
  );
}
