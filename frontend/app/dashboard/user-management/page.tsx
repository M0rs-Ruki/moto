"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
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
        setUsers(prev => [newUserData, ...prev]);

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
      alert("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditPermissions(user.permissions || {
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
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const response = await apiClient.put(`/auth/users/${selectedUser.id}`, {
        isActive: selectedUser.isActive,
        permissions: editPermissions,
      });
      
      if (response.data.success) {
        const updatedUser = response.data.user;

        // 1. IMMEDIATE UI UPDATE - Update user in list immediately
        setUsers(prev =>
          prev.map(u => u.id === selectedUser.id ? updatedUser : u)
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
      alert("Failed to update user");
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
      setUsers(prev => prev.filter(u => u.id !== userToDelete));

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // 2. BACKGROUND REFETCH - Ensure consistency
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
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
    <div className="space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Manage users, roles, and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all system users</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with custom permissions
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                      className="w-full p-2 border rounded"
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
                    <Label className="text-lg font-semibold">Permissions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Dashboard</Label>
                          <Switch
                            checked={editPermissions.dashboard}
                            onCheckedChange={() => togglePermission("dashboard")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Daily Walkins - Visitors</Label>
                          <Switch
                            checked={editPermissions.dailyWalkinsVisitors}
                            onCheckedChange={() =>
                              togglePermission("dailyWalkinsVisitors")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Daily Walkins - Sessions</Label>
                          <Switch
                            checked={editPermissions.dailyWalkinsSessions}
                            onCheckedChange={() =>
                              togglePermission("dailyWalkinsSessions")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Digital Enquiry</Label>
                          <Switch
                            checked={editPermissions.digitalEnquiry}
                            onCheckedChange={() =>
                              togglePermission("digitalEnquiry")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Field Inquiry</Label>
                          <Switch
                            checked={editPermissions.fieldInquiry}
                            onCheckedChange={() =>
                              togglePermission("fieldInquiry")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Delivery Update</Label>
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
                          <Label>Settings - Profile</Label>
                          <Switch
                            checked={editPermissions.settingsProfile}
                            onCheckedChange={() =>
                              togglePermission("settingsProfile")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Settings - Vehicle Models</Label>
                          <Switch
                            checked={editPermissions.settingsVehicleModels}
                            onCheckedChange={() =>
                              togglePermission("settingsVehicleModels")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Settings - Lead Sources</Label>
                          <Switch
                            checked={editPermissions.settingsLeadSources}
                            onCheckedChange={() =>
                              togglePermission("settingsLeadSources")
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Settings - WhatsApp</Label>
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
                  <div className="flex justify-end gap-2 pt-4">
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dealership</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.dealership?.name || "N/A"}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.email}</DialogTitle>
            <DialogDescription>
              Update user permissions and status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Active Status</Label>
              <Switch
                checked={selectedUser?.isActive || false}
                onCheckedChange={(checked) => {
                  if (selectedUser) {
                    setSelectedUser({ ...selectedUser, isActive: checked });
                  }
                }}
              />
            </div>
            <div className="space-y-4 pt-4 border-t">
              <Label className="text-lg font-semibold">Permissions</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Dashboard</Label>
                    <Switch
                      checked={editPermissions.dashboard}
                      onCheckedChange={() => togglePermission("dashboard")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Daily Walkins - Visitors</Label>
                    <Switch
                      checked={editPermissions.dailyWalkinsVisitors}
                      onCheckedChange={() =>
                        togglePermission("dailyWalkinsVisitors")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Daily Walkins - Sessions</Label>
                    <Switch
                      checked={editPermissions.dailyWalkinsSessions}
                      onCheckedChange={() =>
                        togglePermission("dailyWalkinsSessions")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Digital Enquiry</Label>
                    <Switch
                      checked={editPermissions.digitalEnquiry}
                      onCheckedChange={() => togglePermission("digitalEnquiry")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Field Inquiry</Label>
                    <Switch
                      checked={editPermissions.fieldInquiry}
                      onCheckedChange={() => togglePermission("fieldInquiry")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Delivery Update</Label>
                    <Switch
                      checked={editPermissions.deliveryUpdate}
                      onCheckedChange={() => togglePermission("deliveryUpdate")}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Settings - Profile</Label>
                    <Switch
                      checked={editPermissions.settingsProfile}
                      onCheckedChange={() =>
                        togglePermission("settingsProfile")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Settings - Vehicle Models</Label>
                    <Switch
                      checked={editPermissions.settingsVehicleModels}
                      onCheckedChange={() =>
                        togglePermission("settingsVehicleModels")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Settings - Lead Sources</Label>
                    <Switch
                      checked={editPermissions.settingsLeadSources}
                      onCheckedChange={() =>
                        togglePermission("settingsLeadSources")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Settings - WhatsApp</Label>
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
            <div className="flex justify-end gap-2 pt-4">
              <Button
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
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={saving}>
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
