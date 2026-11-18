import { Router } from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { listStudents, createStudent, importStudents } from "../controllers/student.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/\.(xlsx|xls|csv)$/i.test(file.originalname)) return cb(null, true);
    cb(new AppError(400, "Only .xlsx, .xls or .csv files are allowed"));
  },
});

const router = Router();

router.use(requireAuth);
router.get("/", listStudents);
router.post("/", requireRole("admin"), createStudent);
router.post("/import", requireRole("admin"), upload.single("file"), importStudents);

export default router;
