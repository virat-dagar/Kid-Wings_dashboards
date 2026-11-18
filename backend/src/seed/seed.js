import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";

// Your existing 5 teachers, unchanged
const TEACHERS = [
  {
    name: "Rhea Kapoor",
    classLevel: "Nursery",
    title: "Nursery Educator",
    color: "#dce9ff",
    status: "Active",
  },
  {
    name: "Priya Sharma",
    classLevel: "LKG",
    title: "Early Years Educator",
    color: "#fbe2df",
    status: "Active",
  },
  {
    name: "Meera Iyer",
    classLevel: "UKG",
    title: "Lead Educator",
    color: "#e6f3df",
    status: "Active",
  },
  {
    name: "Kavita Verma",
    classLevel: "Class 1",
    title: "Primary Teacher",
    color: "#eee5fa",
    status: "Active",
  },
  {
    name: "Anita Das",
    classLevel: "Class 2",
    title: "Primary Teacher",
    color: "#fff0d8",
    status: "Inactive",
  },
];

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const emailOf = (name) =>
  `${name.toLowerCase().replace(/\s+/g, ".")}@eduwings.school`;

const run = async () => {
  await connectDB();

  // Admin account
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await User.findOneAndUpdate(
    { email: process.env.ADMIN_EMAIL.toLowerCase() },
    {
      name: process.env.ADMIN_NAME || "School Admin",
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      passwordHash: adminHash,
      role: "admin",
      isActive: true,
    },
    { upsert: true, new: true },
  );
  console.log("Admin ready:", process.env.ADMIN_EMAIL);

  // Teachers + their login accounts
  const teacherHash = await bcrypt.hash(process.env.SEED_TEACHER_PASSWORD, 12);
  for (const t of TEACHERS) {
    const teacher = await Teacher.findOneAndUpdate(
      { classLevel: t.classLevel },
      { ...t, initials: initialsOf(t.name) },
      { upsert: true, new: true },
    );

    await User.findOneAndUpdate(
      { email: emailOf(t.name) },
      {
        name: t.name,
        email: emailOf(t.name),
        passwordHash: teacherHash,
        role: "teacher",
        teacher: teacher._id,
        isActive: t.status === "Active",
      },
      { upsert: true, new: true },
    );
    console.log(
      `Teacher ready: ${t.name} (${t.classLevel}) -> ${emailOf(t.name)}`,
    );
  }

  await mongoose.disconnect();
  console.log("Seed complete");
};

run().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
