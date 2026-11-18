import { z } from "zod";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import { CLASSES } from "../config/classes.js";
import { AppError } from "../utils/AppError.js";
import { scopeFor, dayStart, todayString } from "../utils/scope.js";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");
const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format");

const markSchema = z.object({
  date: dateSchema,
  records: z
    .array(
      z.object({
        studentId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid student id"),
        status: z.enum(["Present", "Absent"]),
      }),
    )
    .min(1, "Send at least one record"),
});

// Admin may narrow to one class. Teachers are always limited to their own class.
const classFromQuery = (req) => {
  if (req.user.role !== "admin" || !req.query.classLevel) return null;
  if (!CLASSES.includes(req.query.classLevel)) throw new AppError(400, "Unknown class");
  return req.query.classLevel;
};

// GET /api/attendance?date=YYYY-MM-DD&classLevel=
// Returns the students in scope and their mark for that day (null = not marked yet)
export const getAttendance = async (req, res) => {
  const date = dateSchema.parse(req.query.date || todayString());

  const filter = { ...scopeFor(req.user), status: "Active" };
  const cls = classFromQuery(req);
  if (cls) filter.classLevel = cls;

  const students = await Student.find(filter).sort({ name: 1 }).lean();

  const marks = await Attendance.find({
    date: dayStart(date),
    student: { $in: students.map((s) => s._id) },
  }).lean();

  const statusById = new Map(marks.map((m) => [String(m.student), m.status]));

  res.json({
    success: true,
    date,
    students: students.map((s) => ({
      id: s._id,
      name: s.name,
      studentCode: s.studentCode,
      classLevel: s.classLevel,
      status: statusById.get(String(s._id)) ?? null,
    })),
  });
};

// GET /api/attendance/days?month=YYYY-MM&classLevel=
// One row per day that has saved attendance, with present / absent counts.
export const getAttendanceDays = async (req, res) => {
  const month = monthSchema.parse(req.query.month || todayString().slice(0, 7));
  const [year, mon] = month.split("-").map(Number);

  const match = {
    ...scopeFor(req.user),
    date: {
      $gte: new Date(Date.UTC(year, mon - 1, 1)),
      $lt: new Date(Date.UTC(year, mon, 1)),
    },
  };
  const cls = classFromQuery(req);
  if (cls) match.classLevel = cls;

  const rows = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "UTC" } },
        present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.json({
    success: true,
    month,
    days: rows.map((r) => ({
      date: r._id,
      present: r.present,
      absent: r.absent,
      total: r.present + r.absent,
    })),
  });
};

// POST /api/attendance  { date, records: [{ studentId, status }] }
// Saving the same student and day again updates that record (one record per student per day).
export const markAttendance = async (req, res) => {
  const { date, records } = markSchema.parse(req.body);

  const uniqueIds = [...new Set(records.map((r) => r.studentId))];
  const students = await Student.find({
    ...scopeFor(req.user),
    _id: { $in: uniqueIds },
  })
    .select("_id classLevel")
    .lean();

  // If any id is missing from the result, it's outside this user's scope
  if (students.length !== uniqueIds.length) {
    throw new AppError(403, "You can only mark attendance for students in your own class");
  }

  const classById = new Map(students.map((s) => [String(s._id), s.classLevel]));
  const day = dayStart(date);

  const ops = records.map((r) => ({
    updateOne: {
      filter: { student: r.studentId, date: day },
      update: {
        $set: {
          status: r.status,
          classLevel: classById.get(r.studentId),
          markedBy: req.user._id,
        },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(ops);

  res.json({ success: true, date, saved: records.length });
};
