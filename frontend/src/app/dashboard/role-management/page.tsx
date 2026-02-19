"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { usePermissions } from "@/contexts/permissions";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Shield,
  ShieldCheck,
  User as UserIcon,
  BarChart3,
  Users,
} from "lucide-react";
import { UserPermissions } from "@/lib/auth";
import RoleManagementLoading from "./loading";

interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  dealership?: {
    id: string;
    name: string;
    location: string;
  } | null;
  permissions?: UserPermissions | null;
}

export default function RoleManagementPage() {
  const router = useRouter();
  const { isAdmin, isSuperAdmin, refreshPermissions } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");
  const [createRole, setCreateRole] = useState<"admin" | "user">("user");

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [editPermissions, setEditPermissions] = useState<UserPermissions>({
    dashboard: false,
    dailyWalkinsVisitors: false,
    dailyWalkinsSessions: false,
    digitalEnquiry: false,
    fieldInquiry: false,
    deliveryUpdate: false,
    exportExcel: false,
    settingsProfile: false,
    settingsVehicleModels: false,
    settingsLeadSources: false,
    settingsWhatsApp: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/auth/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await apiClient.post("/auth/users", {
        ...newUser,
        permissions: editPermissions,
      });

      if (response.data.success) {
        const newUserData = response.data.user;
        setUsers((prev) => [newUserData, ...prev]);
        toast.success("User created successfully");

        // Reset form
        setNewUser({ email: "", password: "", role: "user" });
        setEditPermissions({
          dashboard: false,
          dailyWalkinsVisitors: false,
          dailyWalkinsSessions: false,
          digitalEnquiry: false,
          fieldInquiry: false,
          deliveryUpdate: false,
          exportExcel: false,
          settingsProfile: false,
          settingsVehicleModels: false,
          settingsLeadSources: false,
          settingsWhatsApp: false,
        });
        setCreateDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setResetPassword("");
    setEditPermissions(
      user.permissions || {
        dashboard: false,
        dailyWalkinsVisitors: false,
        dailyWalkinsSessions: false,
        digitalEnquiry: false,
        fieldInquiry: false,
        deliveryUpdate: false,
        exportExcel: false,
        settingsProfile: false,
        settingsVehicleModels: false,
        settingsLeadSources: false,
        settingsWhatsApp: false,
      },
    );
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const updatePayload: any = {
        isActive: selectedUser.isActive,
        permissions: editPermissions,
      };

      if (resetPassword.trim()) {
        updatePayload.password = resetPassword;
      }

      const response = await apiClient.put(
        `/auth/users/${selectedUser.id}`,
        updatePayload,
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)),
        );
        toast.success("User updated successfully");
        setEditDialogOpen(false);
        setSelectedUser(null);
        refreshPermissions();
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setSaving(true);
    try {
      await apiClient.delete(`/auth/users/${userToDelete}`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permission: keyof UserPermissions) => {
    setEditPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const setAllPermissions = (value: boolean) => {
    setEditPermissions({
      dashboard: value,
      dailyWalkinsVisitors: value,
      dailyWalkinsSessions: value,
      digitalEnquiry: value,
      fieldInquiry: value,
      deliveryUpdate: value,
      exportExcel: value,
      settingsProfile: value,
      settingsVehicleModels: value,
      settingsLeadSources: value,
      settingsWhatsApp: value,
    });
  };

  const openCreateDialog = (role: "admin" | "user") => {
    setCreateRole(role);
    setNewUser({ email: "", password: "", role });
    // Set default permissions based on role
    if (role === "admin") {
      setAllPermissions(true);
    } else {
      setAllPermissions(false);
    }
    setCreateDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <UserIcon className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
    }
  };

  // Filter users based on active tab
  const getFilteredUsers = () => {
    switch (activeTab) {
      case "admins":
        return users.filter((u) => u.role === "admin");
      case "users":
        return users.filter((u) => u.role === "user");
      case "all":
      default:
        return users;
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return <RoleManagementLoading />;
  }

  const filteredUsers = getFilteredUsers();
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;
  const superAdminCount = users.filter((u) => u.role === "super_admin").length;

  return (
    <div className="space-y-6 md:space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="pb-2 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Role Management
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2">
              Manage users, roles, and permissions
            </p>
          </div>
          {isSuperAdmin && (
            <Link href="/dashboard/usage-stats">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Usage Stats
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{superAdminCount}</p>
                <p className="text-xs text-muted-foreground">Super Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adminCount}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userCount}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="all" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">All Users</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admins</span>
            <span className="sm:hidden">Admin</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
            <span className="sm:hidden">User</span>
          </TabsTrigger>
        </TabsList>

        {/* All Users Tab */}
        <TabsContent value="all">
          <UserListCard
            title="All Users"
            description="View and manage all system users"
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={(id) => {
              setUserToDelete(id);
              setDeleteDialogOpen(true);
            }}
            getRoleBadge={getRoleBadge}
            showCreateButton={false}
          />
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins">
          <UserListCard
            title="Admin Users"
            description="Manage administrator accounts"
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={(id) => {
              setUserToDelete(id);
              setDeleteDialogOpen(true);
            }}
            getRoleBadge={getRoleBadge}
            showCreateButton={true}
            onCreateClick={() => openCreateDialog("admin")}
            createButtonText="Create Admin"
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <UserListCard
            title="Regular Users"
            description="Manage staff user accounts"
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={(id) => {
              setUserToDelete(id);
              setDeleteDialogOpen(true);
            }}
            getRoleBadge={getRoleBadge}
            showCreateButton={true}
            onCreateClick={() => openCreateDialog("user")}
            createButtonText="Create User"
          />
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Create New {createRole === "admin" ? "Admin" : "User"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Create a new{" "}
              {createRole === "admin" ? "administrator" : "staff user"} account
              with custom permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
                className="text-sm"
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Password</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                className="text-sm"
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base sm:text-lg font-semibold">
                  Permissions
                </Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllPermissions(true)}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllPermissions(false)}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <PermissionSwitch
                    label="Dashboard"
                    checked={editPermissions.dashboard}
                    onCheckedChange={() => togglePermission("dashboard")}
                  />
                  <PermissionSwitch
                    label="Daily Walkins - Visitors"
                    checked={editPermissions.dailyWalkinsVisitors}
                    onCheckedChange={() =>
                      togglePermission("dailyWalkinsVisitors")
                    }
                  />
                  <PermissionSwitch
                    label="Daily Walkins - Sessions"
                    checked={editPermissions.dailyWalkinsSessions}
                    onCheckedChange={() =>
                      togglePermission("dailyWalkinsSessions")
                    }
                  />
                  <PermissionSwitch
                    label="Digital Enquiry"
                    checked={editPermissions.digitalEnquiry}
                    onCheckedChange={() => togglePermission("digitalEnquiry")}
                  />
                  <PermissionSwitch
                    label="Field Inquiry"
                    checked={editPermissions.fieldInquiry}
                    onCheckedChange={() => togglePermission("fieldInquiry")}
                  />
                  <PermissionSwitch
                    label="Delivery Update"
                    checked={editPermissions.deliveryUpdate}
                    onCheckedChange={() => togglePermission("deliveryUpdate")}
                  />
                </div>
                <div className="space-y-3">
                  <PermissionSwitch
                    label="Export Excel"
                    checked={editPermissions.exportExcel}
                    onCheckedChange={() => togglePermission("exportExcel")}
                  />
                  <PermissionSwitch
                    label="Settings - Profile"
                    checked={editPermissions.settingsProfile}
                    onCheckedChange={() => togglePermission("settingsProfile")}
                  />
                  <PermissionSwitch
                    label="Settings - Vehicle Models"
                    checked={editPermissions.settingsVehicleModels}
                    onCheckedChange={() =>
                      togglePermission("settingsVehicleModels")
                    }
                  />
                  <PermissionSwitch
                    label="Settings - Lead Sources"
                    checked={editPermissions.settingsLeadSources}
                    onCheckedChange={() =>
                      togglePermission("settingsLeadSources")
                    }
                  />
                  <PermissionSwitch
                    label="Settings - WhatsApp"
                    checked={editPermissions.settingsWhatsApp}
                    onCheckedChange={() => togglePermission("settingsWhatsApp")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create {createRole === "admin" ? "Admin" : "User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit User</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update user settings and permissions for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{selectedUser?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {getRoleBadge(selectedUser?.role || "user")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label>Active</Label>
                <Switch
                  checked={selectedUser?.isActive ?? true}
                  onCheckedChange={(checked) =>
                    setSelectedUser(
                      selectedUser
                        ? { ...selectedUser, isActive: checked }
                        : null,
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Reset Password</Label>
              <Input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Leave empty to keep current password"
                className="text-sm"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base sm:text-lg font-semibold">
                  Permissions
                </Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllPermissions(true)}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllPermissions(false)}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <PermissionSwitch
                    label="Dashboard"
                    checked={editPermissions.dashboard}
                    onCheckedChange={() => togglePermission("dashboard")}
                  />
                  <PermissionSwitch
                    label="Daily Walkins - Visitors"
                    checked={editPermissions.dailyWalkinsVisitors}
                    onCheckedChange={() =>
                      togglePermission("dailyWalkinsVisitors")
                    }
                  />
                  <PermissionSwitch
                    label="Daily Walkins - Sessions"
                    checked={editPermissions.dailyWalkinsSessions}
                    onCheckedChange={() =>
                      togglePermission("dailyWalkinsSessions")
                    }
                  />
                  <PermissionSwitch
                    label="Digital Enquiry"
                    checked={editPermissions.digitalEnquiry}
                    onCheckedChange={() => togglePermission("digitalEnquiry")}
                  />
                  <PermissionSwitch
                    label="Field Inquiry"
                    checked={editPermissions.fieldInquiry}
                    onCheckedChange={() => togglePermission("fieldInquiry")}
                  />
                  <PermissionSwitch
                    label="Delivery Update"
                    checked={editPermissions.deliveryUpdate}
                    onCheckedChange={() => togglePermission("deliveryUpdate")}
                  />
                </div>
                <div className="space-y-3">
                  <PermissionSwitch
                    label="Export Excel"
                    checked={editPermissions.exportExcel}
                    onCheckedChange={() => togglePermission("exportExcel")}
                  />
                  <PermissionSwitch
                    label="Settings - Profile"
                    checked={editPermissions.settingsProfile}
                    onCheckedChange={() => togglePermission("settingsProfile")}
                  />
                  <PermissionSwitch
                    label="Settings - Vehicle Models"
                    checked={editPermissions.settingsVehicleModels}
                    onCheckedChange={() =>
                      togglePermission("settingsVehicleModels")
                    }
                  />
                  <PermissionSwitch
                    label="Settings - Lead Sources"
                    checked={editPermissions.settingsLeadSources}
                    onCheckedChange={() =>
                      togglePermission("settingsLeadSources")
                    }
                  />
                  <PermissionSwitch
                    label="Settings - WhatsApp"
                    checked={editPermissions.settingsWhatsApp}
                    onCheckedChange={() => togglePermission("settingsWhatsApp")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Components
interface PermissionSwitchProps {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}

function PermissionSwitch({
  label,
  checked,
  onCheckedChange,
}: PermissionSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm sm:text-base">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

interface UserListCardProps {
  title: string;
  description: string;
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  getRoleBadge: (role: string) => React.ReactNode;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonText?: string;
}

function UserListCard({
  title,
  description,
  users,
  onEdit,
  onDelete,
  getRoleBadge,
  showCreateButton = false,
  onCreateClick,
  createButtonText = "Create",
}: UserListCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {description}
            </CardDescription>
          </div>
          {showCreateButton && onCreateClick && (
            <Button onClick={onCreateClick} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {createButtonText}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(user)}
                          disabled={user.role === "super_admin"}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(user.id)}
                          disabled={user.role === "super_admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
