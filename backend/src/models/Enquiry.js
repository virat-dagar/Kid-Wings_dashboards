import mongoose from "mongoose";
import { CLASSES } from "../config/classes.js";

export const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "Visit booked",
  "Enrolled",
  "Closed",
];

const enquirySchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    childName: { type: String, required: true, trim: true },
    childDob: { type: Date, required: true },
    classApplying: { type: String, enum: CLASSES, required: true },
    message: { type: String, default: "", maxlength: 1000 },
    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: "New",
      index: true,
    },
    notes: { type: String, default: "", maxlength: 1000 },
    source: { type: String, default: "website" },
  },
  { timestamps: true },
);

export default mongoose.model("Enquiry", enquirySchema);
