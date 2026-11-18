import { z } from "zod";
import Student from "../models/Student.js";
import { CLASSES } from "../config/classes.js";
import { AppError } from "../utils/AppError.js";
import { scopeFor } from "../utils/scope.js";
import { parseStudentWorkbook } from "../utils/excelParser.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createSchema = z.object({
  name: z.string().trim().min(2, "Enter the child's name").max(100),
  classLevel: z.enum(CLASSES),
  guardianName: z.string().trim().max(100).optional().or(z.literal("")),
  parentPhone: z.string().trim().max(20).optional().or(z.literal("")),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be a valid date").optional().or(z.literal("")),
});

const normalizePhone = (v) => {
  const digits = String(v || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `+91${digits}` : digits;
};

// KW-<year>-<number>, never reusing an existing code
const nextStudentCode = async () => {
  const year = new Date().getFullYear();
  let n = (await Student.countDocuments()) + 1;
  let code;
  do {
    code = `KW-${year}-${String(n).padStart(3, "0")}`;
    n++;
  } while (await Student.exists({ studentCode: code }));
  return code;
};

// GET /api/students?classLevel=&search=
export const listStudents = async (req, res) => {
  const filter = { ...scopeFor(req.user) };

  if (req.user.role === "admin" && req.query.classLevel) {
    if (!CLASSES.includes(req.query.classLevel)) throw new AppError(400, "Unknown class");
    filter.classLevel = req.query.classLevel;
  }
  if (req.query.search) {
    filter.name = { $regex: escapeRegex(String(req.query.search)), $options: "i" };
  }

  const students = await Student.find(filter).sort({ name: 1 }).lean();
  res.json({ success: true, count: students.length, students });
};

// POST /api/students  (admin only)
export const createStudent = async (req, res) => {
  const data = createSchema.parse(req.body);

  const student = await Student.create({
    studentCode: await nextStudentCode(),
    name: data.name,
    classLevel: data.classLevel,
    guardianName: data.guardianName || "",
    parentPhone: normalizePhone(data.parentPhone),
    dateOfBirth: data.dateOfBirth ? new Date(`${data.dateOfBirth}T00:00:00.000Z`) : null,
    status: "Active",
  });

  res.status(201).json({ success: true, student });
};

// POST /api/students/import  (admin only, multipart field "file")
// Re-importing the same sheet updates existing students instead of duplicating them.
export const importStudents = async (req, res) => {
  if (!req.file) throw new AppError(400, "Attach the Excel file in the 'file' field");

  const { students, problems } = parseStudentWorkbook(req.file.buffer);
  if (!students.length) throw new AppError(400, "No valid student rows were found in this file");

  const ops = students.map((s) => ({
    updateOne: { filter: { studentCode: s.studentCode }, update: { $set: s }, upsert: true },
  }));

  const result = await Student.bulkWrite(ops);

  res.json({
    success: true,
    inserted: result.upsertedCount,
    updated: result.modifiedCount,
    skipped: problems.length,
    problems: problems.slice(0, 20),
  });
};
