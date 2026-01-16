import { Router } from "express";
import prisma from "../lib/db";
import { authenticate, asyncHandler } from "../middleware/auth";
const router = Router();
// Create model
router.post("/", authenticate, asyncHandler(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { name, year, categoryId } = req.body;
    if (!name || !categoryId) {
        res.status(400).json({ error: "Model name and category are required" });
        return;
    }
    // Verify category belongs to user's dealership
    const category = await prisma.vehicleCategory.findFirst({
        where: {
            id: categoryId,
            dealershipId: req.user.dealershipId,
        },
    });
    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }
    const model = await prisma.vehicleModel.create({
        data: {
            name,
            year: year ? parseInt(year) : null,
            categoryId,
        },
    });
    res.json({ success: true, model });
}));
// Delete model
router.delete("/", authenticate, asyncHandler(async (req, res) => {
    if (!req.user || !req.user.dealershipId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: "Model ID is required" });
        return;
    }
    // Verify model belongs to user's dealership through category
    const model = await prisma.vehicleModel.findFirst({
        where: {
            id,
            category: {
                dealershipId: req.user.dealershipId,
            },
        },
    });
    if (!model) {
        res.status(404).json({ error: "Model not found" });
        return;
    }
    // Delete model
    await prisma.vehicleModel.delete({
        where: { id },
    });
    res.json({ success: true, message: "Model deleted" });
}));
export default router;
//# sourceMappingURL=models.js.map