import mongoose from "mongoose";
import { CLASSES } from "../config/classes.js";

export const MATERIAL_TYPES = ["Worksheet", "PDF", "Video", "Image", "Link"];

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: "", maxlength: 500 },
    classLevel: { type: String, enum: CLASSES, required: true, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 60 },
    type: { type: String, enum: MATERIAL_TYPES, default: "Worksheet" },
    url: { type: String, default: "", maxlength: 500 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    uploadedByName: { type: String, default: "" },
  },
  { timestamps: true },
);

materialSchema.index({ classLevel: 1, subject: 1 });

export default mongoose.model("Material", materialSchema);
