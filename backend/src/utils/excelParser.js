import * as XLSX from "xlsx";
import { CLASSES } from "../config/classes.js";

// Excel class names -> our class names
const CLASS_ALIASES = {
  nursery: "Nursery",
  lkg: "LKG",
  ukg: "UKG",
  "1st class": "Class 1",
  "class 1": "Class 1",
  "1st": "Class 1",
  "2nd class": "Class 2",
  "class 2": "Class 2",
  "2nd": "Class 2",
};

const toClass = (raw) => {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (CLASS_ALIASES[key]) return CLASS_ALIASES[key];
  return CLASSES.find((c) => c.toLowerCase() === key) || null;
};

// Handles "02-10-2018" (text), Excel date serials, and normal dates
const toDate = (v) => {
  if (v === "" || v == null) return null;
  if (typeof v === "number") {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? new Date(Date.UTC(d.y, d.m - 1, d.d)) : null;
  }
  const m = String(v)
    .trim()
    .match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (m)
    return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
  const t = new Date(v);
  return isNaN(t) ? null : t;
};

// Keeps digits only and adds +91 for 10-digit Indian numbers
const toPhone = (v) => {
  if (v == null || v === "") return "";
  const digits = (
    typeof v === "number" ? String(Math.round(v)) : String(v)
  ).replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  return digits;
};

export const parseStudentWorkbook = (buffer) => {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    defval: "",
  });

  const students = [];
  const problems = [];

  rows.forEach((raw, i) => {
    const row = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k.trim(), v]),
    );
    const pick = (...keys) => {
      for (const k of keys) {
        const v = row[k];
        if (v !== "" && v != null) return String(v).trim();
      }
      return "";
    };

    const name = pick("Student's Name");
    if (!name) return; // blank row

    const rowNo = i + 2; // +2 = header row + 1-based index
    const studentCode = pick("ID No.");
    const classLevel = toClass(pick("Class"));

    if (!studentCode)
      return problems.push(`Row ${rowNo} (${name}): missing ID No.`);
    if (!classLevel)
      return problems.push(
        `Row ${rowNo} (${name}): unknown class "${pick("Class")}"`,
      );

    students.push({
      studentCode,
      name,
      classLevel,
      guardianName: pick("Guardian's Name", "Father's Name", "Mother's Name"),
      parentPhone:
        toPhone(row["Contact No. (Father)"]) ||
        toPhone(row["Contact No. (Mother)"]) ||
        toPhone(row["Contact No. (Guardian)"]),
      dateOfBirth: toDate(row["Date of Birth"]),
      admissionDate: toDate(row["Date of Admission"]),
      status: "Active",
    });
  });

  return { students, problems };
};
