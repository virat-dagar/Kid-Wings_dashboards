import mongoose from "mongoose";
import { CLASSES } from "../config/classes.js";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    initials: { type: String, required: true },
    classLevel: { type: String, enum: CLASSES, required: true, unique: true },
    title: { type: String, default: "" },
    subjects: { type: [String], default: [] },
    color: { type: String, default: "#dce9ff" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true },
);

export default mongoose.model("Teacher", teacherSchema);
