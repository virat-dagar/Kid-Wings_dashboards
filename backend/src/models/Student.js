import mongoose from "mongoose";
import { CLASSES } from "../config/classes.js";

const studentSchema = new mongoose.Schema(
  {
    studentCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    classLevel: { type: String, enum: CLASSES, required: true, index: true },
    guardianName: { type: String, default: "" },
    parentPhone: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    admissionDate: { type: Date, default: null },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true },
);

export default mongoose.model("Student", studentSchema);
