import { AppError } from "./AppError.js";

// Admin sees everything. A teacher is limited to their own class.
export const scopeFor = (user) => {
  if (user.role === "admin") return {};
  if (!user.teacher) throw new AppError(403, "Your account is not linked to a teacher profile");
  return { classLevel: user.teacher.classLevel };
};

// "2025-11-16" -> Date at midnight UTC, so one day always matches one record
export const dayStart = (isoDate) => new Date(`${isoDate}T00:00:00.000Z`);

export const todayString = () => new Date().toISOString().slice(0, 10);
