"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Users, Settings, LogOut, Car, FileText, Menu, X } from "lucide-react";

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
          <nav className="flex-1 space-y-2">
            <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Visitors</span>
              </Button>
            </Link>
            <Link
              href="/dashboard/sessions"
              onClick={() => setSidebarOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Sessions</span>
              </Button>
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Button>
            </Link>
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
