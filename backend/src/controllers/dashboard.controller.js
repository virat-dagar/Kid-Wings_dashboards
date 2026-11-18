import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { CLASSES } from "../config/classes.js";
import { scopeFor, dayStart, todayString } from "../utils/scope.js";

const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : null);

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const today = todayString();
  const todayDate = dayStart(today);
  const since = new Date(todayDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const students = await Student.find({
    ...scopeFor(req.user),
    status: "Active",
  })
    .select("_id classLevel")
    .lean();
  const ids = students.map((s) => s._id);

  const todayMarks = await Attendance.find({
    date: todayDate,
    student: { $in: ids },
  })
    .select("classLevel status")
    .lean();

  // Attendance over the last 30 days, grouped by class
  const recent = await Attendance.aggregate([
    {
      $match: { student: { $in: ids }, date: { $gte: since, $lte: todayDate } },
    },
    {
      $group: {
        _id: "$classLevel",
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
      },
    },
  ]);

  // Build one row per class
  const rows = Object.fromEntries(
    CLASSES.map((c) => [
      c,
      {
        classLevel: c,
        students: 0,
        present: 0,
        absent: 0,
        total30: 0,
        present30: 0,
      },
    ]),
  );
  students.forEach((s) => rows[s.classLevel] && rows[s.classLevel].students++);
  todayMarks.forEach((m) => {
    if (!rows[m.classLevel]) return;
    if (m.status === "Present") rows[m.classLevel].present++;
    else rows[m.classLevel].absent++;
  });
  recent.forEach((r) => {
    if (!rows[r._id]) return;
    rows[r._id].total30 = r.total;
    rows[r._id].present30 = r.present;
  });

  // Teachers see only their own class
  const visible = Object.values(rows).filter(
    (c) => isAdmin || c.classLevel === req.user.teacher?.classLevel,
  );

  const classes = visible.map((c) => ({
    classLevel: c.classLevel,
    students: c.students,
    present: c.present,
    absent: c.absent,
    unmarked: c.students - c.present - c.absent,
    rate30: pct(c.present30, c.total30),
  }));

  const totals = classes.reduce(
    (t, c) => ({
      students: t.students + c.students,
      present: t.present + c.present,
      absent: t.absent + c.absent,
      unmarked: t.unmarked + c.unmarked,
    }),
    { students: 0, present: 0, absent: 0, unmarked: 0 },
  );
  const allRecent = visible.reduce(
    (t, c) => ({
      total: t.total + c.total30,
      present: t.present + c.present30,
    }),
    { total: 0, present: 0 },
  );
  totals.rate30 = pct(allRecent.present, allRecent.total);

  const payload = {
    success: true,
    date: today,
    role: req.user.role,
    totals,
    classes,
  };

  if (isAdmin) {
    payload.teachers = await Teacher.countDocuments({ status: "Active" });
  } else {
    payload.teacher = {
      name: req.user.teacher.name,
      classLevel: req.user.teacher.classLevel,
    };
  }

  res.json(payload);
};
