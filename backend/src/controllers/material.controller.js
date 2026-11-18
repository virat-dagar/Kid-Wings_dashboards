import { z } from "zod";
import Material, { MATERIAL_TYPES } from "../models/Material.js";
import { CLASSES } from "../config/classes.js";
import { AppError } from "../utils/AppError.js";
import { scopeFor } from "../utils/scope.js";

const createSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().max(500).optional().or(z.literal("")),
  classLevel: z.enum(CLASSES),
  subject: z.string().trim().min(2, "Choose a subject").max(60),
  type: z.enum(MATERIAL_TYPES).default("Worksheet"),
  url: z.string().trim().max(500).optional().or(z.literal("")),
});

// GET /api/materials?classLevel=&subject=
// Teachers always get their own class. Admins can filter by class.
export const listMaterials = async (req, res) => {
  const filter = { ...scopeFor(req.user) };
  if (req.user.role === "admin" && req.query.classLevel) {
    if (!CLASSES.includes(req.query.classLevel)) throw new AppError(400, "Unknown class");
    filter.classLevel = req.query.classLevel;
  }
  if (req.query.subject) filter.subject = String(req.query.subject);

  const materials = await Material.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: materials.length, materials });
};

// POST /api/materials  (admin: any class, teacher: own class only)
export const createMaterial = async (req, res) => {
  const data = createSchema.parse(req.body);

  const scope = scopeFor(req.user);
  if (scope.classLevel && data.classLevel !== scope.classLevel) {
    throw new AppError(403, "You can only add materials for your own class");
  }
  if (data.url && !/^https?:\/\//i.test(data.url)) {
    throw new AppError(400, "Link must start with http:// or https://");
  }

  const material = await Material.create({
    ...data,
    url: data.url || "",
    description: data.description || "",
    uploadedBy: req.user._id,
    uploadedByName: req.user.name,
  });

  res.status(201).json({ success: true, material });
};
