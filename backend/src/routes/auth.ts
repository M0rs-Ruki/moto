import { Router, Request, Response, Express } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import prisma from "../lib/db";
import { UserRole } from "@prisma/client";
import { generateToken, setAuthCookie, clearAuthCookie } from "../lib/auth";
import { authenticate, asyncHandler, requireAdmin } from "../middleware/auth";
import { checkPermission } from "../middleware/permissions";

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Login
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { dealership: true, permissions: true },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ error: "Account is disabled" });
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    let token: string;
    try {
      token = await generateToken({
        userId: user.id,
        email: user.email,
        dealershipId: user.dealershipId || undefined,
        role: user.role, // Include role in JWT for faster admin checks
      });
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error(
        `Failed to generate token: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // Set cookie
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        theme: user.theme,
        profilePicture: user.profilePicture,
        dealership: user.dealership,
        permissions: user.permissions || null,
      },
    });
  })
);

// Register
router.post(
  "/register",
  upload.single("profilePicture"),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, dealershipName, dealershipLocation, theme } =
      req.body;
    const profilePictureFile = req.file;

    // Validation
    if (!email || !password || !dealershipName || !dealershipLocation) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the first user (set as admin)
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    // Create dealership and user
    const dealership = await prisma.dealership.create({
      data: {
        name: dealershipName,
        location: dealershipLocation,
      },
    });

    // Handle profile picture upload if provided
    let profilePicturePath: string | null = null;
    if (profilePictureFile && profilePictureFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(profilePictureFile.mimetype)) {
        res.status(400).json({
          error:
            "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
        });
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (profilePictureFile.size > maxSize) {
        res.status(400).json({
          error: "File size too large. Maximum size is 5MB.",
        });
        return;
      }

      // Check if we're on Vercel
      const isVercel = process.env.VERCEL === "1";
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      const fileExtension =
        profilePictureFile.originalname.split(".").pop()?.toLowerCase() ||
        "jpg";

      // On Vercel, we MUST use Blob Storage (filesystem is read-only)
      if (isVercel) {
        if (!blobToken) {
          res.status(500).json({
            error:
              "BLOB_READ_WRITE_TOKEN environment variable is not configured. Please add it in your Vercel project settings.",
          });
          return;
        }

        // Use Vercel Blob Storage
        const tempId = `temp-${Date.now()}`;
        const filename = `profile-pictures/${tempId}.${fileExtension}`;

        // Upload to Vercel Blob Storage
        const blob = await put(filename, profilePictureFile.buffer, {
          access: "public",
          contentType: profilePictureFile.mimetype,
        });

        profilePicturePath = blob.url;
      } else if (blobToken) {
        // Local development but token is available - use Blob Storage
        const tempId = `temp-${Date.now()}`;
        const filename = `profile-pictures/${tempId}.${fileExtension}`;

        // Upload to Vercel Blob Storage
        const blob = await put(filename, profilePictureFile.buffer, {
          access: "public",
          contentType: profilePictureFile.mimetype,
        });

        profilePicturePath = blob.url;
      } else {
        // Local development without token - use local filesystem
        const tempId = `temp-${Date.now()}`;
        const filename = `${tempId}.${fileExtension}`;
        const filepath = join(
          process.cwd(),
          "public",
          "profile-pictures",
          filename
        );

        // Ensure directory exists
        const dirPath = join(process.cwd(), "public", "profile-pictures");
        if (!existsSync(dirPath)) {
          await mkdir(dirPath, { recursive: true });
        }

        // Save file
        await writeFile(filepath, profilePictureFile.buffer);

        profilePicturePath = `profile-pictures/${filename}`;
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: isFirstUser ? UserRole.admin : UserRole.user,
        dealershipId: dealership.id,
        theme: theme || "light",
        profilePicture: profilePicturePath,
      },
      include: { dealership: true },
    });

    // If profile picture was uploaded, update filename to use user ID
    if (profilePicturePath && user.id) {
      const isVercel = process.env.VERCEL === "1";
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

      if (
        (isVercel || blobToken) &&
        profilePicturePath.startsWith("https://")
      ) {
        // Vercel Blob: Re-upload with new filename
        if (profilePictureFile && profilePictureFile.size > 0) {
          const urlParts = profilePicturePath.split(".");
          const fileExtension =
            urlParts[urlParts.length - 1]?.split("?")[0] || "jpg";
          const newFilename = `profile-pictures/${
            user.id
          }-${Date.now()}.${fileExtension}`;

          const blob = await put(newFilename, profilePictureFile.buffer, {
            access: "public",
            contentType: profilePictureFile.mimetype,
          });

          // Delete old temp file
          try {
            await del(profilePicturePath);
          } catch (error) {
            console.warn("Failed to delete temp profile picture:", error);
          }

          // Update user record
          await prisma.user.update({
            where: { id: user.id },
            data: { profilePicture: blob.url },
          });

          profilePicturePath = blob.url;
        }
      } else if (!blobToken && !profilePicturePath.startsWith("https://")) {
        // Local filesystem: Rename file
        const oldPath = join(process.cwd(), "public", profilePicturePath);
        const fileExtension = profilePicturePath.split(".").pop() || "jpg";
        const newFilename = `${user.id}-${Date.now()}.${fileExtension}`;
        const newPath = join(
          process.cwd(),
          "public",
          "profile-pictures",
          newFilename
        );

        // Rename file
        const { rename } = await import("fs/promises");
        await rename(oldPath, newPath);

        // Update user record
        const correctPath = `profile-pictures/${newFilename}`;
        await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture: correctPath },
        });

        profilePicturePath = correctPath;
      }
    }

    // Create default WhatsApp templates
    await prisma.whatsAppTemplate.createMany({
      data: [
        {
          name: "Welcome Message",
          templateId: "demo_welcome_123",
          templateName: "welcome_msg",
          language: "en_US",
          type: "welcome",
          section: "global",
          dealershipId: dealership.id,
        },
        {
          name: "Test Drive Follow-up",
          templateId: "demo_testdrive_456",
          templateName: "test_drive_msg",
          language: "en_US",
          type: "test_drive",
          section: "global",
          dealershipId: dealership.id,
        },
        {
          name: "Exit Thank You",
          templateId: "demo_exit_789",
          templateName: "exit_msg",
          language: "en_US",
          type: "exit",
          section: "global",
          dealershipId: dealership.id,
        },
        {
          name: "Delivery Reminder",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_reminder",
          section: "delivery_update",
          dealershipId: dealership.id,
        },
        {
          name: "Digital Enquiry Notification",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "digital_enquiry",
          section: "digital_enquiry",
          dealershipId: dealership.id,
        },
        {
          name: "Delivery Completion",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_completion",
          section: "delivery_update",
          dealershipId: dealership.id,
        },
      ],
    });

    // Create user permissions (all false by default, or all true for admin)
    const defaultPermissions = isFirstUser
      ? {
          dashboard: true,
          dailyWalkinsVisitors: true,
          dailyWalkinsSessions: true,
          digitalEnquiry: true,
          fieldInquiry: true,
          deliveryUpdate: true,
          settingsProfile: true,
          settingsVehicleModels: true,
          settingsLeadSources: true,
          settingsWhatsApp: true,
        }
      : {
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
        };

    const userPermission = await prisma.userPermission.create({
      data: {
        userId: user.id,
        ...defaultPermissions,
      },
    });

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      dealershipId: dealership.id,
      role: user.role, // Include role in JWT for faster admin checks
    });

    // Set cookie
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        theme: user.theme,
        profilePicture: profilePicturePath,
        dealership: user.dealership,
        permissions: userPermission,
      },
    });
  })
);

// Get current user
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Get full user details
    const fullUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        theme: true,
        profilePicture: true,
        dealership: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        permissions: true,
      },
    });

    if (!fullUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Auto-create permissions for users who don't have them (backward compatibility)
    // This handles existing users in production who were created before the permissions system
    let userPermissions = fullUser.permissions;
    if (!userPermissions) {
      const isAdmin = fullUser.role === UserRole.admin;
      
      // Create default permissions (all true for admin, all false for regular users)
      const defaultPermissions = isAdmin
        ? {
            dashboard: true,
            dailyWalkinsVisitors: true,
            dailyWalkinsSessions: true,
            digitalEnquiry: true,
            fieldInquiry: true,
            deliveryUpdate: true,
            settingsProfile: true,
            settingsVehicleModels: true,
            settingsLeadSources: true,
            settingsWhatsApp: true,
          }
        : {
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
          };

      userPermissions = await prisma.userPermission.create({
        data: {
          userId: fullUser.id,
          ...defaultPermissions,
        },
      });
    }

    // Explicitly include all fields to ensure they're always present in the response
    // This prevents issues with spread operator or missing fields in production
    // Updated: 2026-01-18 - Force cache invalidation
    res.json({ 
      user: {
        id: fullUser.id,
        email: fullUser.email,
        role: fullUser.role || UserRole.user, // Ensure role is always present
        isActive: fullUser.isActive ?? true, // Ensure isActive is always present
        theme: fullUser.theme,
        profilePicture: fullUser.profilePicture,
        dealership: fullUser.dealership,
        permissions: userPermissions, // Always include permissions (created or existing)
      }
    });
  })
);

// Logout
router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    clearAuthCookie(res);
    res.json({ success: true });
  })
);

// Upload profile picture
router.post(
  "/profile-picture",
  authenticate,
  checkPermission("settingsProfile"),
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      res.status(400).json({
        error:
          "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      res.status(400).json({
        error: "File size too large. Maximum size is 5MB.",
      });
      return;
    }

    // Get file extension
    const fileExtension =
      file.originalname.split(".").pop()?.toLowerCase() || "jpg";

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `profile-pictures/${req.user.userId}-${timestamp}.${fileExtension}`;

    // Get existing user to check for old profile picture
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { profilePicture: true },
    });

    // Check if we're on Vercel
    const isVercel = process.env.VERCEL === "1";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    let profilePictureUrl: string;

    // On Vercel, we MUST use Blob Storage
    if (isVercel) {
      if (!blobToken) {
        res.status(500).json({
          error:
            "BLOB_READ_WRITE_TOKEN environment variable is not configured. Please add it in your Vercel project settings.",
        });
        return;
      }

      // Delete old profile picture from Vercel Blob if it exists
      if (
        existingUser?.profilePicture &&
        existingUser.profilePicture.startsWith("https://")
      ) {
        try {
          await del(existingUser.profilePicture);
        } catch (error) {
          console.warn("Failed to delete old profile picture:", error);
        }
      }

      // Upload to Vercel Blob Storage
      const blob = await put(filename, file.buffer, {
        access: "public",
        contentType: file.mimetype,
      });

      profilePictureUrl = blob.url;
    } else if (blobToken) {
      // Local development but token is available - use Blob Storage
      if (
        existingUser?.profilePicture &&
        existingUser.profilePicture.startsWith("https://")
      ) {
        try {
          await del(existingUser.profilePicture);
        } catch (error) {
          console.warn("Failed to delete old profile picture:", error);
        }
      }

      const blob = await put(filename, file.buffer, {
        access: "public",
        contentType: file.mimetype,
      });

      profilePictureUrl = blob.url;
    } else {
      // Local development without token - use local filesystem
      const filepath = join(process.cwd(), "public", filename);

      // Ensure directory exists
      const dirPath = join(process.cwd(), "public", "profile-pictures");
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }

      // Delete old profile picture if it exists (local filesystem)
      if (
        existingUser?.profilePicture &&
        !existingUser.profilePicture.startsWith("https://")
      ) {
        const oldFilePath = join(
          process.cwd(),
          "public",
          existingUser.profilePicture
        );
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath);
          } catch (error) {
            console.warn("Failed to delete old profile picture:", error);
          }
        }
      }

      // Save file
      await writeFile(filepath, file.buffer);

      profilePictureUrl = filename;
    }

    // Update user record
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { profilePicture: profilePictureUrl },
    });

    res.json({
      success: true,
      profilePicture: profilePictureUrl,
    });
  })
);

// User Management Endpoints (Admin only)

// Get all users (only from admin's dealership)
router.get(
  "/users",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated or no dealership assigned" });
      return;
    }

    // Only return users from the admin's dealership
    const users = await prisma.user.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        dealership: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        permissions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ users });
  })
);

// Create user (automatically assigned to admin's dealership)
router.post(
  "/users",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated or no dealership assigned" });
      return;
    }

    const { email, password, role, permissions } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user - automatically assign to admin's dealership
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: (role as UserRole) || UserRole.user,
        dealershipId: req.user.dealershipId, // Always use admin's dealership
      },
      include: { dealership: true },
    });

    // Create user permissions
    const defaultPermissions = {
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
      ...(permissions || {}),
    };

    const userPermission = await prisma.userPermission.create({
      data: {
        userId: user.id,
        ...defaultPermissions,
      },
    });

    res.json({
      success: true,
      user: {
        ...user,
        permissions: userPermission,
      },
    });
  })
);

// Update user (only users from admin's dealership)
router.put(
  "/users/:id",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated or no dealership assigned" });
      return;
    }

    const { id } = req.params;
    const { email, role, isActive, permissions } = req.body;

    // Check if user exists and belongs to admin's dealership
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Ensure user belongs to admin's dealership
    if (existingUser.dealershipId !== req.user.dealershipId) {
      res.status(403).json({ error: "You can only manage users from your own dealership" });
      return;
    }

    // Update user (don't allow changing dealershipId - users stay in their dealership)
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role as UserRole;
    if (isActive !== undefined) updateData.isActive = isActive;
    // dealershipId is NOT allowed to be changed - users must stay in their dealership

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { dealership: true },
    });

    // Update permissions if provided
    let userPermission = null;
    if (permissions !== undefined) {
      userPermission = await prisma.userPermission.upsert({
        where: { userId: id },
        update: permissions,
        create: {
          userId: id,
          ...permissions,
        },
      });
    } else {
      userPermission = await prisma.userPermission.findUnique({
        where: { userId: id },
      });
    }

    res.json({
      success: true,
      user: {
        ...user,
        permissions: userPermission,
      },
    });
  })
);

// Delete user (only users from admin's dealership)
router.delete(
  "/users/:id",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated or no dealership assigned" });
      return;
    }

    const { id } = req.params;

    // Check if user exists and belongs to admin's dealership
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Ensure user belongs to admin's dealership
    if (existingUser.dealershipId !== req.user.dealershipId) {
      res.status(403).json({ error: "You can only delete users from your own dealership" });
      return;
    }

    // Prevent deleting yourself
    if (id === req.user?.userId) {
      res.status(400).json({ error: "Cannot delete your own account" });
      return;
    }

    // Delete user (permissions will be deleted via cascade)
    await prisma.user.delete({
      where: { id },
    });

    res.json({ success: true });
  })
);

export default router;
