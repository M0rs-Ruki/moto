"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/api";
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
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", loginData);

      if (response.data.success) {
        // Apply theme immediately
        localStorage.setItem("theme", response.data.user.theme);
        // Full page reload to ensure cookie is available to middleware
        window.location.href = redirect;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/autopluse-black.png"
              alt="Autopluse Logo"
              className="h-16 w-auto object-contain dark:hidden"
            />
            <img
              src="/autopluse-white.png"
              alt="Autopluse Logo"
              className="h-16 w-auto object-contain hidden dark:block"
            />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">
            Showroom Management
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-center">
            Login to manage your showroom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="text-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
