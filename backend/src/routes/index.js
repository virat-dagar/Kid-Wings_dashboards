import { Router } from "express";
import authRoutes from "./auth.routes.js";
import studentRoutes from "./student.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import teacherRoutes from "./teacher.routes.js";
import enquiryRoutes from "./enquiry.routes.js";
import materialRoutes from "./material.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ success: true, status: "ok" }));
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/teachers", teacherRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/materials", materialRoutes);

export default router;
