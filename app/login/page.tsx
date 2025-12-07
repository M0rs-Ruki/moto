"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dealershipName: "",
    dealershipLocation: "",
    theme: "light",
    accentColor: "#3b82f6",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", loginData);

      if (response.data.success) {
        // Apply theme immediately
        localStorage.setItem("theme", response.data.user.theme);
        localStorage.setItem("accentColor", response.data.user.accentColor);
        router.push(redirect);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        email: registerData.email,
        password: registerData.password,
        dealershipName: registerData.dealershipName,
        dealershipLocation: registerData.dealershipLocation,
        theme: registerData.theme,
        accentColor: registerData.accentColor,
      });

      if (response.data.success) {
        // Apply theme immediately
        localStorage.setItem("theme", response.data.user.theme);
        localStorage.setItem("accentColor", response.data.user.accentColor);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
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
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl">
            Showroom Management
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Login or create an account to manage your showroom visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs sm:text-base">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={handleRegister}
                className="space-y-3 max-h-[70vh] overflow-y-auto pr-2"
              >
                {error && (
                  <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm" className="text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dealership-name" className="text-sm">
                    Dealership Name
                  </Label>
                  <Input
                    id="dealership-name"
                    type="text"
                    placeholder="Suzuki Motors - Downtown"
                    value={registerData.dealershipName}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        dealershipName: e.target.value,
                      })
                    }
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dealership-location" className="text-sm">
                    Branch Location
                  </Label>
                  <Input
                    id="dealership-location"
                    type="text"
                    placeholder="123 Main St, City"
                    value={registerData.dealershipLocation}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        dealershipLocation: e.target.value,
                      })
                    }
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme-select" className="text-sm">
                    Theme
                  </Label>
                  <select
                    id="theme-select"
                    className="w-full p-2 border rounded text-sm"
                    value={registerData.theme}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        theme: e.target.value,
                      })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {registerData.theme === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-sm">
                      Accent Color
                    </Label>
                    <Input
                      id="accent-color"
                      type="color"
                      value={registerData.accentColor}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          accentColor: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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
