"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/lib/api";
import { UserPermissions, User } from "@/lib/auth";

interface PermissionsContextType {
  user: User | null;
  permissions: UserPermissions | null;
  loading: boolean;
  isAdmin: boolean;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  canAccess: (permission: keyof UserPermissions) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAndPermissions = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      const userData = response.data.user;
      setUser(userData);
      setPermissions(userData.permissions || null);
    } catch (error) {
      console.error("Failed to fetch user permissions:", error);
      setUser(null);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndPermissions();
  }, []);

  const isAdmin = user?.role === "admin";

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (isAdmin) {
      return true; // Admins have all permissions
    }
    if (!permissions) {
      return false;
    }
    return permissions[permission] === true;
  };

  const canAccess = (permission: keyof UserPermissions): boolean => {
    if (!user || !user.isActive) {
      return false;
    }
    return hasPermission(permission);
  };

  const refreshPermissions = async () => {
    await fetchUserAndPermissions();
  };

  return (
    <PermissionsContext.Provider
      value={{
        user,
        permissions,
        loading,
        isAdmin,
        hasPermission,
        canAccess,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}
