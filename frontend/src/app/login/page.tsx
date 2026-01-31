"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4 md:p-6">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-3 sm:space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-1 sm:mb-2">
            <Image
              src="/autopluse-black.png"
              alt="Autopluse Logo"
              width={120}
              height={96}
              className="h-20 sm:h-24 w-auto object-contain dark:hidden"
              priority
            />
            <Image
              src="/autopluse-white.png"
              alt="Autopluse Logo"
              width={120}
              height={96}
              className="h-20 sm:h-24 w-auto object-contain hidden dark:block"
              priority
            />
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl text-center font-semibold leading-tight">
            WhatsApp-powered CRM For Smarter Dealership Management
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-center">
            AutoPulse by{" "}
            <a
              href="https://prominds.digital/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              Prominds Digital
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-2.5 sm:p-3 rounded">
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
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Copyright Footer */}
            <div className="mt-6 text-center">
              <a
                href="https://prominds.digital/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:underline"
              >
                © 2026 Prominds Digital. All rights reserved.
              </a>
            </div>
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
