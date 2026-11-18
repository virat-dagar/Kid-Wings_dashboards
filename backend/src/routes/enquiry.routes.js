import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  createEnquiry,
  listEnquiries,
  updateEnquiry,
} from "../controllers/enquiry.controller.js";

// Public form: limit submissions per IP to slow down spam
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many enquiries from this device. Please try again later.",
  },
});

const router = Router();

router.post("/", submitLimiter, createEnquiry); // public

// Staff only
router.get("/", requireAuth, requireRole("admin"), listEnquiries);
router.patch("/:id", requireAuth, requireRole("admin"), updateEnquiry);

export default router;
