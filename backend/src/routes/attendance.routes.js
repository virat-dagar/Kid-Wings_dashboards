import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getAttendance,
  getAttendanceDays,
  markAttendance,
} from "../controllers/attendance.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getAttendance);
router.get("/days", getAttendanceDays);
router.post("/", markAttendance);

export default router;
