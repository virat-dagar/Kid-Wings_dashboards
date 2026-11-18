import { subjectMeta } from "../content/syllabus.js";

export const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const initialsOf = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export const Avatar = ({ name, color = "#dce9ff", small = false, xl = false }) => (
  <div
    className={`avatar ${small ? "avatar-sm" : ""} ${xl ? "avatar-xl" : ""}`}
    style={{ background: color }}
  >
    {initialsOf(name)}
  </div>
);

export const SubjectChip = ({ s }) => (
  <span className={`subject-chip tone-${subjectMeta[s]?.tone ?? "purple"}`}>
    {subjectMeta[s]?.emoji ?? "⭐"} {s}
  </span>
);

export const Btn = ({ children, onClick, plain = false, type = "button", disabled = false }) => (
  <button type={type} onClick={onClick} disabled={disabled} className={`button ${plain ? "plain" : ""}`}>
    {children}
  </button>
);
