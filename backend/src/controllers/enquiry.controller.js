import mongoose from "mongoose";
import { z } from "zod";
import Enquiry, { ENQUIRY_STATUSES } from "../models/Enquiry.js";
import { CLASSES } from "../config/classes.js";
import { AppError } from "../utils/AppError.js";

const enquiryInput = z.object({
  parentName: z.string().trim().min(2, "Enter the parent's name").max(100),
  phone: z.string().trim().max(20),
  email: z.string().trim().max(120).optional().or(z.literal("")),
  childName: z.string().trim().min(2, "Enter the child's name").max(100),
  childDob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be a valid date"),
  classApplying: z.enum(CLASSES, { message: "Choose a class" }),
  message: z.string().max(1000).optional().or(z.literal("")),
  // Honeypot: real users leave this empty, bots usually fill it in
  website: z.string().optional(),
});

// POST /api/enquiries  (public)
export const createEnquiry = async (req, res) => {
  const data = enquiryInput.parse(req.body);

  // Silently accept spam so bots get no feedback
  if (data.website) return res.status(201).json({ success: true });

  const phone = data.phone.replace(/[\s()-]/g, "");
  if (!/^\+?\d{10,13}$/.test(phone)) {
    throw new AppError(400, "Enter a valid phone number (10 digits)");
  }

  const dob = new Date(`${data.childDob}T00:00:00.000Z`);
  if (isNaN(dob) || dob > new Date()) {
    throw new AppError(400, "Enter a valid date of birth");
  }

  await Enquiry.create({
    parentName: data.parentName,
    phone,
    email: data.email || "",
    childName: data.childName,
    childDob: dob,
    classApplying: data.classApplying,
    message: data.message || "",
  });

  res
    .status(201)
    .json({ success: true, message: "Thank you! We will contact you soon." });
};

// GET /api/enquiries?status=New  (admin only)
export const listEnquiries = async (req, res) => {
  const filter = {};
  if (req.query.status && ENQUIRY_STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }
  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: enquiries.length, enquiries });
};

const updateSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  notes: z.string().max(1000).optional(),
});

// PATCH /api/enquiries/:id  (admin only)
export const updateEnquiry = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    throw new AppError(400, "Invalid enquiry id");

  const updates = updateSchema.parse(req.body);
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).lean();
  if (!enquiry) throw new AppError(404, "Enquiry not found");

  res.json({ success: true, enquiry });
};
