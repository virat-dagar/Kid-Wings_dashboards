import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { listMaterials, createMaterial } from "../controllers/material.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", listMaterials);
router.post("/", requireRole("admin", "teacher"), createMaterial);

export default router;
