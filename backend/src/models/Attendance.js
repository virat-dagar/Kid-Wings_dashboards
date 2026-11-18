import mongoose from "mongoose";
import { CLASSES } from "../config/classes.js";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classLevel: { type: String, enum: CLASSES, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// One mark per student per day. Re-saving updates it.
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classLevel: 1, date: 1 });

export default mongoose.model("Attendance", attendanceSchema);
