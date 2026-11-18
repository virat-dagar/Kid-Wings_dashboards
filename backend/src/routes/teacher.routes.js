import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  listTeachers,
  updateTeacherStatus,
} from "../controllers/teacher.controller.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));
router.get("/", listTeachers);
router.patch("/:id/status", updateTeacherStatus);

export default router;
