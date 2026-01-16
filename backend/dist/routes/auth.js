"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = __importDefault(require("multer"));
const blob_1 = require("@vercel/blob");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_1 = require("fs");
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("../lib/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Login
router.post("/login", (0, auth_2.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }
    // Find user
    const user = await db_1.default.user.findUnique({
        where: { email },
        include: { dealership: true },
    });
    if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }
    // Verify password
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }
    // Generate token
    let token;
    try {
        token = await (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            dealershipId: user.dealershipId || undefined,
        });
    }
    catch (error) {
        console.error("Token generation error:", error);
        throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : String(error)}`);
    }
    // Set cookie
    (0, auth_1.setAuthCookie)(res, token);
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            theme: user.theme,
            profilePicture: user.profilePicture,
            dealership: user.dealership,
        },
    });
}));
// Register
router.post("/register", upload.single("profilePicture"), (0, auth_2.asyncHandler)(async (req, res) => {
    const { email, password, dealershipName, dealershipLocation, theme } = req.body;
    const profilePictureFile = req.file;
    // Validation
    if (!email || !password || !dealershipName || !dealershipLocation) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    // Check if user already exists
    const existingUser = await db_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create dealership and user
    const dealership = await db_1.default.dealership.create({
        data: {
            name: dealershipName,
            location: dealershipLocation,
        },
    });
    // Handle profile picture upload if provided
    let profilePicturePath = null;
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
                error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
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
        const fileExtension = profilePictureFile.originalname.split(".").pop()?.toLowerCase() ||
            "jpg";
        // On Vercel, we MUST use Blob Storage (filesystem is read-only)
        if (isVercel) {
            if (!blobToken) {
                res.status(500).json({
                    error: "BLOB_READ_WRITE_TOKEN environment variable is not configured. Please add it in your Vercel project settings.",
                });
                return;
            }
            // Use Vercel Blob Storage
            const tempId = `temp-${Date.now()}`;
            const filename = `profile-pictures/${tempId}.${fileExtension}`;
            // Upload to Vercel Blob Storage
            const blob = await (0, blob_1.put)(filename, profilePictureFile.buffer, {
                access: "public",
                contentType: profilePictureFile.mimetype,
            });
            profilePicturePath = blob.url;
        }
        else if (blobToken) {
            // Local development but token is available - use Blob Storage
            const tempId = `temp-${Date.now()}`;
            const filename = `profile-pictures/${tempId}.${fileExtension}`;
            // Upload to Vercel Blob Storage
            const blob = await (0, blob_1.put)(filename, profilePictureFile.buffer, {
                access: "public",
                contentType: profilePictureFile.mimetype,
            });
            profilePicturePath = blob.url;
        }
        else {
            // Local development without token - use local filesystem
            const tempId = `temp-${Date.now()}`;
            const filename = `${tempId}.${fileExtension}`;
            const filepath = (0, path_1.join)(process.cwd(), "public", "profile-pictures", filename);
            // Ensure directory exists
            const dirPath = (0, path_1.join)(process.cwd(), "public", "profile-pictures");
            if (!(0, fs_1.existsSync)(dirPath)) {
                await (0, promises_1.mkdir)(dirPath, { recursive: true });
            }
            // Save file
            await (0, promises_1.writeFile)(filepath, profilePictureFile.buffer);
            profilePicturePath = `profile-pictures/${filename}`;
        }
    }
    const user = await db_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
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
        if ((isVercel || blobToken) &&
            profilePicturePath.startsWith("https://")) {
            // Vercel Blob: Re-upload with new filename
            if (profilePictureFile && profilePictureFile.size > 0) {
                const urlParts = profilePicturePath.split(".");
                const fileExtension = urlParts[urlParts.length - 1]?.split("?")[0] || "jpg";
                const newFilename = `profile-pictures/${user.id}-${Date.now()}.${fileExtension}`;
                const blob = await (0, blob_1.put)(newFilename, profilePictureFile.buffer, {
                    access: "public",
                    contentType: profilePictureFile.mimetype,
                });
                // Delete old temp file
                try {
                    await (0, blob_1.del)(profilePicturePath);
                }
                catch (error) {
                    console.warn("Failed to delete temp profile picture:", error);
                }
                // Update user record
                await db_1.default.user.update({
                    where: { id: user.id },
                    data: { profilePicture: blob.url },
                });
                profilePicturePath = blob.url;
            }
        }
        else if (!blobToken && !profilePicturePath.startsWith("https://")) {
            // Local filesystem: Rename file
            const oldPath = (0, path_1.join)(process.cwd(), "public", profilePicturePath);
            const fileExtension = profilePicturePath.split(".").pop() || "jpg";
            const newFilename = `${user.id}-${Date.now()}.${fileExtension}`;
            const newPath = (0, path_1.join)(process.cwd(), "public", "profile-pictures", newFilename);
            // Rename file
            const { rename } = await Promise.resolve().then(() => __importStar(require("fs/promises")));
            await rename(oldPath, newPath);
            // Update user record
            const correctPath = `profile-pictures/${newFilename}`;
            await db_1.default.user.update({
                where: { id: user.id },
                data: { profilePicture: correctPath },
            });
            profilePicturePath = correctPath;
        }
    }
    // Create default WhatsApp templates
    await db_1.default.whatsAppTemplate.createMany({
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
    // Generate token
    const token = await (0, auth_1.generateToken)({
        userId: user.id,
        email: user.email,
        dealershipId: dealership.id,
    });
    // Set cookie
    (0, auth_1.setAuthCookie)(res, token);
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            theme: user.theme,
            profilePicture: profilePicturePath,
            dealership: user.dealership,
        },
    });
}));
// Get current user
router.get("/me", auth_2.authenticate, (0, auth_2.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    // Get full user details
    const fullUser = await db_1.default.user.findUnique({
        where: { id: req.user.userId },
        select: {
            id: true,
            email: true,
            theme: true,
            profilePicture: true,
            dealership: {
                select: {
                    id: true,
                    name: true,
                    location: true,
                },
            },
        },
    });
    if (!fullUser) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json({ user: fullUser });
}));
// Logout
router.post("/logout", (0, auth_2.asyncHandler)(async (req, res) => {
    (0, auth_1.clearAuthCookie)(res);
    res.json({ success: true });
}));
// Upload profile picture
router.post("/profile-picture", auth_2.authenticate, upload.single("file"), (0, auth_2.asyncHandler)(async (req, res) => {
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
            error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
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
    const fileExtension = file.originalname.split(".").pop()?.toLowerCase() || "jpg";
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `profile-pictures/${req.user.userId}-${timestamp}.${fileExtension}`;
    // Get existing user to check for old profile picture
    const existingUser = await db_1.default.user.findUnique({
        where: { id: req.user.userId },
        select: { profilePicture: true },
    });
    // Check if we're on Vercel
    const isVercel = process.env.VERCEL === "1";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    let profilePictureUrl;
    // On Vercel, we MUST use Blob Storage
    if (isVercel) {
        if (!blobToken) {
            res.status(500).json({
                error: "BLOB_READ_WRITE_TOKEN environment variable is not configured. Please add it in your Vercel project settings.",
            });
            return;
        }
        // Delete old profile picture from Vercel Blob if it exists
        if (existingUser?.profilePicture &&
            existingUser.profilePicture.startsWith("https://")) {
            try {
                await (0, blob_1.del)(existingUser.profilePicture);
            }
            catch (error) {
                console.warn("Failed to delete old profile picture:", error);
            }
        }
        // Upload to Vercel Blob Storage
        const blob = await (0, blob_1.put)(filename, file.buffer, {
            access: "public",
            contentType: file.mimetype,
        });
        profilePictureUrl = blob.url;
    }
    else if (blobToken) {
        // Local development but token is available - use Blob Storage
        if (existingUser?.profilePicture &&
            existingUser.profilePicture.startsWith("https://")) {
            try {
                await (0, blob_1.del)(existingUser.profilePicture);
            }
            catch (error) {
                console.warn("Failed to delete old profile picture:", error);
            }
        }
        const blob = await (0, blob_1.put)(filename, file.buffer, {
            access: "public",
            contentType: file.mimetype,
        });
        profilePictureUrl = blob.url;
    }
    else {
        // Local development without token - use local filesystem
        const filepath = (0, path_1.join)(process.cwd(), "public", filename);
        // Ensure directory exists
        const dirPath = (0, path_1.join)(process.cwd(), "public", "profile-pictures");
        if (!(0, fs_1.existsSync)(dirPath)) {
            await (0, promises_1.mkdir)(dirPath, { recursive: true });
        }
        // Delete old profile picture if it exists (local filesystem)
        if (existingUser?.profilePicture &&
            !existingUser.profilePicture.startsWith("https://")) {
            const oldFilePath = (0, path_1.join)(process.cwd(), "public", existingUser.profilePicture);
            if ((0, fs_1.existsSync)(oldFilePath)) {
                try {
                    await (0, promises_1.unlink)(oldFilePath);
                }
                catch (error) {
                    console.warn("Failed to delete old profile picture:", error);
                }
            }
        }
        // Save file
        await (0, promises_1.writeFile)(filepath, file.buffer);
        profilePictureUrl = filename;
    }
    // Update user record
    await db_1.default.user.update({
        where: { id: req.user.userId },
        data: { profilePicture: profilePictureUrl },
    });
    res.json({
        success: true,
        profilePicture: profilePictureUrl,
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map