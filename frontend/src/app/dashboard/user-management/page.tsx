"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { UserPermissions } from "@/lib/auth";

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

export default function UserManagementPage() {
  const router = useRouter();
  const { isAdmin, refreshPermissions } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState<string>("");

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

        // 1. IMMEDIATE UI UPDATE - Add user to list immediately
        setUsers((prev) => [newUserData, ...prev]);

        // Reset form
        setNewUser({ email: "", password: "", role: "user" });
        setEditPermissions({
          dashboard: false,
          dailyWalkinsVisitors: false,
          dailyWalkinsSessions: false,
          digitalEnquiry: false,
          fieldInquiry: false,
          deliveryUpdate: false,
          settingsProfile: false,
          settingsVehicleModels: false,
          settingsLeadSources: false,
          settingsWhatsApp: false,
        });
        setCreateDialogOpen(false);

        // 2. BACKGROUND REFETCH - Ensure consistency
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

      // Include password only if it's being reset
      if (resetPassword.trim()) {
        updatePayload.password = resetPassword;
      }

      const response = await apiClient.put(
        `/auth/users/${selectedUser.id}`,
        updatePayload,
      );

      if (response.data.success) {
        const updatedUser = response.data.user;

        // 1. IMMEDIATE UI UPDATE - Update user in list immediately
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)),
        );

        setEditDialogOpen(false);
        setSelectedUser(null);

        // Refresh permissions if current user was updated
        refreshPermissions();

        // 2. BACKGROUND REFETCH - Ensure consistency
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

      // 1. IMMEDIATE UI UPDATE - Remove user from list immediately
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));

      setDeleteDialogOpen(false);
      setUserToDelete(null);

      // 2. BACKGROUND REFETCH - Ensure consistency
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

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2">
          Manage users, roles, and permissions
        </p>
      </div>

      <Card className="mx-2 sm:mx-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Users</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage all system users
              </CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    Create New User
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Create a new user account with custom permissions
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Role</Label>
                    <select
                      className="w-full p-2 border rounded text-sm"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-base sm:text-lg font-semibold">
                      Permissions
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Dashboard
                          </Label>
                          <Switch
                            checked={editPermissions.dashboard}
                            onCheckedChange={() =>
                              togglePermission("dashboard")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Daily Walkins - Visitors
                          </Label>
                          <Switch
                            checked={editPermissions.dailyWalkinsVisitors}
                            onCheckedChange={() =>
                              togglePermission("dailyWalkinsVisitors")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Daily Walkins - Sessions
                          </Label>
                          <Switch
                            checked={editPermissions.dailyWalkinsSessions}
                            onCheckedChange={() =>
                              togglePermission("dailyWalkinsSessions")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Digital Enquiry
                          </Label>
                          <Switch
                            checked={editPermissions.digitalEnquiry}
                            onCheckedChange={() =>
                              togglePermission("digitalEnquiry")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Field Inquiry
                          </Label>
                          <Switch
                            checked={editPermissions.fieldInquiry}
                            onCheckedChange={() =>
                              togglePermission("fieldInquiry")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Delivery Update
                          </Label>
                          <Switch
                            checked={editPermissions.deliveryUpdate}
                            onCheckedChange={() =>
                              togglePermission("deliveryUpdate")
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Settings - Profile
                          </Label>
                          <Switch
                            checked={editPermissions.settingsProfile}
                            onCheckedChange={() =>
                              togglePermission("settingsProfile")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Settings - Vehicle Models
                          </Label>
                          <Switch
                            checked={editPermissions.settingsVehicleModels}
                            onCheckedChange={() =>
                              togglePermission("settingsVehicleModels")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Settings - Lead Sources
                          </Label>
                          <Switch
                            checked={editPermissions.settingsLeadSources}
                            onCheckedChange={() =>
                              togglePermission("settingsLeadSources")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">
                            Settings - WhatsApp
                          </Label>
                          <Switch
                            checked={editPermissions.settingsWhatsApp}
                            onCheckedChange={() =>
                              togglePermission("settingsWhatsApp")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      \
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Create User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm">Role</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                    Dealership
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .sort((a, b) => {
                    // Sort admins to the top
                    if (a.role === "admin" && b.role !== "admin") return -1;
                    if (a.role !== "admin" && b.role === "admin") return 1;
                    return 0;
                  })
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-xs sm:text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {user.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                        {user.dealership?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {user.role === "admin" ? (
                          <span className="text-xs text-muted-foreground">
                            Protected
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setUserToDelete(user.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Edit User: {selectedUser?.email}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update user permissions, status, and reset password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm sm:text-base">Active Status</Label>
              <Switch
                checked={selectedUser?.isActive || false}
                onCheckedChange={(checked) => {
                  if (selectedUser) {
                    setSelectedUser({ ...selectedUser, isActive: checked });
                  }
                }}
              />
            </div>

            {/* Password Reset Section */}
            <div className="space-y-2 pt-2 border-t">
              <Label
                htmlFor="resetPassword"
                className="text-sm sm:text-base font-semibold"
              >
                Reset Password (Optional)
              </Label>
              <Input
                id="resetPassword"
                type="password"
                placeholder="Enter new password to reset"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep current password
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base sm:text-lg font-semibold">
                Permissions
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">Dashboard</Label>
                    <Switch
                      checked={editPermissions.dashboard}
                      onCheckedChange={() => togglePermission("dashboard")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Daily Walkins - Visitors
                    </Label>
                    <Switch
                      checked={editPermissions.dailyWalkinsVisitors}
                      onCheckedChange={() =>
                        togglePermission("dailyWalkinsVisitors")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Daily Walkins - Sessions
                    </Label>
                    <Switch
                      checked={editPermissions.dailyWalkinsSessions}
                      onCheckedChange={() =>
                        togglePermission("dailyWalkinsSessions")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Digital Enquiry
                    </Label>
                    <Switch
                      checked={editPermissions.digitalEnquiry}
                      onCheckedChange={() => togglePermission("digitalEnquiry")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Field Inquiry
                    </Label>
                    <Switch
                      checked={editPermissions.fieldInquiry}
                      onCheckedChange={() => togglePermission("fieldInquiry")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Delivery Update
                    </Label>
                    <Switch
                      checked={editPermissions.deliveryUpdate}
                      onCheckedChange={() => togglePermission("deliveryUpdate")}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Settings - Profile
                    </Label>
                    <Switch
                      checked={editPermissions.settingsProfile}
                      onCheckedChange={() =>
                        togglePermission("settingsProfile")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Settings - Vehicle Models
                    </Label>
                    <Switch
                      checked={editPermissions.settingsVehicleModels}
                      onCheckedChange={() =>
                        togglePermission("settingsVehicleModels")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Settings - Lead Sources
                    </Label>
                    <Switch
                      checked={editPermissions.settingsLeadSources}
                      onCheckedChange={() =>
                        togglePermission("settingsLeadSources")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">
                      Settings - WhatsApp
                    </Label>
                    <Switch
                      checked={editPermissions.settingsWhatsApp}
                      onCheckedChange={() =>
                        togglePermission("settingsWhatsApp")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                disabled={saving}
                className="w-full sm:w-auto"
              >
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
        <DialogContent className="p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Delete User
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
