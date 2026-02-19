"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";
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
import { Loader2, Save } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { usePermissions } from "@/contexts/permissions";

export default function ProfileSettings() {
  const { hasPermission } = usePermissions();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{
    id: string;
    email: string;
    profilePicture: string | null;
    dealership: {
      id: string;
      name: string;
      location: string;
      showroomNumber: string | null;
    } | null;
  } | null>(null);
  const [dealershipForm, setDealershipForm] = useState({
    name: "",
    location: "",
    showroomNumber: "",
  });
  const [savingDealership, setSavingDealership] = useState(false);
  const [themeSettings, setThemeSettings] = useState({
    theme: theme,
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setThemeSettings({ theme });
  }, [theme]);

  const fetchData = async () => {
    try {
      const [userRes, dealershipRes] = await Promise.all([
        apiClient.get("/auth/me"),
        apiClient.get("/dealership"),
      ]);

      if (userRes.data?.user) {
        setUser({
          id: userRes.data.user.id,
          email: userRes.data.user.email,
          profilePicture: userRes.data.user.profilePicture || null,
          dealership: userRes.data.user.dealership,
        });
      }
      if (dealershipRes.data?.dealership) {
        setDealershipForm({
          name: dealershipRes.data.dealership.name,
          location: dealershipRes.data.dealership.location,
          showroomNumber: dealershipRes.data.dealership.showroomNumber || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleUpdateDealership = async () => {
    if (!hasPermission("settingsProfile")) {
      toast.error("You don't have permission to update dealership information");
      return;
    }
    setSavingDealership(true);
    try {
      await apiClient.put("/dealership", dealershipForm);
      await fetchData();
    } catch (error) {
      console.error("Failed to update dealership:", error);
      toast.error("Failed to update dealership information");
    } finally {
      setSavingDealership(false);
    }
  };

  const handleApplyTheme = () => {
    setTheme(themeSettings.theme as "light" | "dark");
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePictureFile || !hasPermission("settingsProfile")) {
      return;
    }

    setUploadingPicture(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", profilePictureFile);

      const response = await apiClient.post("/auth/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        if (user) {
          setUser({
            ...user,
            profilePicture: response.data.profilePicture,
          });
        }
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to upload profile picture");
    } finally {
      setUploadingPicture(false);
    }
  };

  if (!hasPermission("settingsProfile")) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm sm:text-base">
              You don't have permission to access this section.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Account Information
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            View and update your account and dealership details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <Input value={user.email} disabled className="text-sm" />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Dealership Name *</Label>
                <Input
                  value={dealershipForm.name}
                  onChange={(e) =>
                    setDealershipForm({
                      ...dealershipForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter dealership name"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Location *</Label>
                <Input
                  value={dealershipForm.location}
                  onChange={(e) =>
                    setDealershipForm({
                      ...dealershipForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter location"
                  className="text-sm"
                />
              </div>

              <Button
                onClick={handleUpdateDealership}
                disabled={
                  savingDealership ||
                  !dealershipForm.name ||
                  !dealershipForm.location
                }
                className="w-full sm:w-auto"
              >
                {savingDealership ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Appearance</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Theme</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="sm"
                variant={
                  themeSettings.theme === "light" ? "default" : "outline"
                }
                onClick={() =>
                  setThemeSettings({ ...themeSettings, theme: "light" })
                }
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Light
              </Button>
              <Button
                size="sm"
                variant={themeSettings.theme === "dark" ? "default" : "outline"}
                onClick={() =>
                  setThemeSettings({ ...themeSettings, theme: "dark" })
                }
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Dark
              </Button>
            </div>
          </div>

          <Button
            onClick={handleApplyTheme}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Apply Theme
          </Button>

          <div className="space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Profile Picture</Label>
              <p className="text-xs text-muted-foreground">
                Upload a profile picture to display in the sidebar
              </p>

              {user?.profilePicture ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary">
                    <img
                      src={
                        user.profilePicture.startsWith("http")
                          ? user.profilePicture
                          : `/${user.profilePicture}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed">
                  <span className="text-xs text-muted-foreground">
                    No picture
                  </span>
                </div>
              )}

              {profilePicturePreview && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    New picture preview:
                  </p>
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary">
                    <img
                      src={profilePicturePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  id="profile-picture-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        setError("Profile picture must be less than 5MB");
                        return;
                      }
                      const allowedTypes = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/webp",
                        "image/gif",
                      ];
                      if (!allowedTypes.includes(file.type)) {
                        setError(
                          "Please upload a valid image file (JPEG, PNG, WebP, or GIF)",
                        );
                        return;
                      }
                      setProfilePictureFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfilePicturePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs sm:text-sm"
                />
                {profilePictureFile && (
                  <Button
                    onClick={handleUploadProfilePicture}
                    disabled={uploadingPicture}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {uploadingPicture ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Upload Picture
                      </>
                    )}
                  </Button>
                )}
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
