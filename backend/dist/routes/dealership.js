import { Router } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";
const router = Router();
// Get dealership
router.get("/", authenticate, asyncHandler(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const dealership = await prisma.dealership.findUnique({
        where: { id: req.user.dealershipId },
        select: {
            id: true,
            name: true,
            location: true,
            showroomNumber: true,
        },
    });
    if (!dealership) {
        res.status(404).json({ error: "Dealership not found" });
        return;
    }
    res.json({ dealership });
}));
// Update dealership
router.put("/", authenticate, asyncHandler(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name, location, showroomNumber } = req.body;
    if (!name || !location) {
        res.status(400).json({ error: "Name and location are required" });
        return;
    }
    const dealership = await prisma.dealership.update({
        where: { id: req.user.dealershipId },
        data: {
            name,
            location,
            showroomNumber: showroomNumber || null,
        },
        select: {
            id: true,
            name: true,
            location: true,
            showroomNumber: true,
        },
    });
    res.json({ success: true, dealership });
}));
export default router;
//# sourceMappingURL=dealership.js.map