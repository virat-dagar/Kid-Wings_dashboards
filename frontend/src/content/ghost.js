import { CLASSES } from "./site.js";

const syllabusGhosts = Object.fromEntries(
  CLASSES.map((c) => [
    `syllabus-${c.key}`,
    {
      label: `Syllabus for ${c.name}: subjects and key themes`,
      where: `Classes section, ${c.name} card`,
    },
  ]),
);

export const GHOST = {
  admissionsOpen: {
    label:
      "Admissions status and academic year (e.g. 'Admissions open for 2027-28')",
    where: "Top of the hero, above the school name",
  },
  tagline: {
    label: "School tagline (one line)",
    where: "Hero section, under the school name",
  },
  heroSubtext: {
    label: "One or two sentences about the school's approach",
    where: "Hero section, under the tagline",
  },
  schoolPhotos: {
    label: "3 to 4 photos (classroom, play area, activity corner)",
    where: "Hero section, right side",
  },
  aboutText: {
    label: "Paragraph on teaching philosophy, class size and safety",
    where: "About section",
  },
  ageCutoff: {
    label: "Age cut-off date for admission (e.g. 31 March)",
    where: "Classes section, under the heading",
  },
  ...syllabusGhosts,
  facilities: {
    label: "List of facilities (classrooms, play area, activity room, etc.)",
    where: "Facilities section, left column",
  },
  dailyRoutine: {
    label: "Sample daily schedule with timings",
    where: "Facilities section, right column",
  },
  feeTable: {
    label: "Fee amounts per class: admission, registration, monthly and annual",
    where: "Fees section, replaces this box with a table",
  },
  phone: {
    label: "School phone number",
    where: "Contact section and footer",
  },
  email: {
    label: "School email address",
    where: "Contact section and footer",
  },
  address: {
    label: "Full school address",
    where: "Contact section and footer",
  },
  officeHours: {
    label: "Office hours (e.g. Mon to Sat, 8:30 AM to 1:30 PM)",
    where: "Contact section",
  },
  mapEmbed: {
    label: "Google Maps embed link for the school",
    where: "Contact section, right side",
  },
};
