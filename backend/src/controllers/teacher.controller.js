import mongoose from "mongoose";
import { z } from "zod";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import { CLASSES } from "../config/classes.js";
import { AppError } from "../utils/AppError.js";

// GET /api/teachers  (admin only)
export const listTeachers = async (req, res) => {
  const [teachers, users, counts] = await Promise.all([
    Teacher.find().lean(),
    User.find({ role: "teacher" }).select("email teacher isActive").lean(),
    Student.aggregate([{ $group: { _id: "$classLevel", count: { $sum: 1 } } }]),
  ]);

  const emailByTeacher = new Map(
    users.map((u) => [String(u.teacher), u.email]),
  );
  const countByClass = new Map(counts.map((c) => [c._id, c.count]));

  const list = teachers
    .map((t) => ({
      id: t._id,
      name: t.name,
      initials: t.initials,
      classLevel: t.classLevel,
      title: t.title,
      status: t.status,
      color: t.color,
      email: emailByTeacher.get(String(t._id)) || null,
      studentCount: countByClass.get(t.classLevel) || 0,
    }))
    .sort(
      (a, b) => CLASSES.indexOf(a.classLevel) - CLASSES.indexOf(b.classLevel),
    );

  res.json({ success: true, count: list.length, teachers: list });
};

const statusSchema = z.object({
  status: z.enum(["Active", "Inactive"], {
    error: "Status must be Active or Inactive",
  }),
});

// PATCH /api/teachers/:id/status  { status: "Active" | "Inactive" }  (admin only)
// Also turns the teacher's login on or off, so an inactive teacher cannot sign in.
export const updateTeacherStatus = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    throw new AppError(400, "Invalid teacher id");
  const { status } = statusSchema.parse(req.body);

  const teacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  ).lean();
  if (!teacher) throw new AppError(404, "Teacher not found");

  await User.updateMany(
    { teacher: teacher._id },
    { isActive: status === "Active" },
  );

  res.json({
    success: true,
    teacher: { id: teacher._id, status: teacher.status },
  });
};
