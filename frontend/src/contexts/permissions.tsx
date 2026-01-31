"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiClient from "@/lib/api";
import {
  UserPermissions,
  User,
  OrgFeatureToggles,
  UserRoleType,
} from "@/lib/auth";

// ============================================================
// 3-TIER MULTI-TENANT PERMISSIONS CONTEXT
// ============================================================
// Hierarchy: Super Admin → Admin → User
// Permission check cascade:
// 1. OrgFeatureToggles (org-level master switch)
// 2. Role-based defaults (super_admin/admin have all)
// 3. UserPermissions (individual user overrides)
// ============================================================

interface PermissionsContextType {
  user: User | null;
  permissions: UserPermissions | null;
  orgFeatureToggles: OrgFeatureToggles | null;
  loading: boolean;

  // Role checks
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;

  // Permission checks
  hasPermission: (permission: keyof UserPermissions) => boolean;
  canAccess: (permission: keyof UserPermissions) => boolean;
  isFeatureEnabled: (feature: keyof OrgFeatureToggles) => boolean;

  // Actions
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [orgFeatureToggles, setOrgFeatureToggles] =
    useState<OrgFeatureToggles | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAndPermissions = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      const userData = response.data.user;
      setUser(userData);
      setPermissions(userData.permissions || null);
      setOrgFeatureToggles(userData.orgFeatureToggles || null);
    } catch (error) {
      console.error("Failed to fetch user permissions:", error);
      setUser(null);
      setPermissions(null);
      setOrgFeatureToggles(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndPermissions();
  }, []);

  // Role checks for 3-tier hierarchy
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isUser = user?.role === "user";

  /**
   * Check if a feature is enabled at the organization level
   * If org toggles don't exist, default to enabled
   */
  const isFeatureEnabled = (feature: keyof OrgFeatureToggles): boolean => {
    if (!orgFeatureToggles) {
      return true; // Default to enabled if no org toggles
    }
    return orgFeatureToggles[feature] === true;
  };

  /**
   * Check if user has a specific permission
   * Super Admins and Admins have all permissions
   * For Users, checks both org toggle AND user permission
   */
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    // Super Admins and Admins have all permissions
    if (isSuperAdmin || user?.role === "admin") {
      return true;
    }

    // For regular users, check org toggle first
    if (!isFeatureEnabled(permission as keyof OrgFeatureToggles)) {
      return false; // Feature disabled at org level
    }

    // Then check user-level permission
    if (!permissions) {
      return false;
    }
    return permissions[permission] === true;
  };

  /**
   * Check if user can access a feature
   * Combines active status with permission check
   */
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
        orgFeatureToggles,
        loading,
        isSuperAdmin,
        isAdmin,
        isUser,
        hasPermission,
        canAccess,
        isFeatureEnabled,
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
