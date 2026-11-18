export const SCHOOL = {
  name: "KIDWINGS",
};

// Ages are the usual ranges. The cut-off date is still a ghost item (see ghost.js).
export const CLASSES = [
  { key: "nursery", name: "Nursery", age: "3 to 4 years" },
  { key: "lkg", name: "LKG", age: "4 to 5 years" },
  { key: "ukg", name: "UKG", age: "5 to 6 years" },
  { key: "class1", name: "Class 1", age: "6 to 7 years" },
  { key: "class2", name: "Class 2", age: "7 to 8 years" },
];

export const ADMISSION_STEPS = [
  { title: "Enquire", text: "Send an enquiry online or call the school." },
  {
    title: "Visit",
    text: "Optional, but we encourage parents to visit the school.",
  },
  { title: "Apply", text: "Submit the admission form." },
  {
    title: "Documents and fee",
    text: "Submit the documents and pay the registration fee.",
  },
  {
    title: "Confirmation",
    text: "Receive confirmation and your child's joining date.",
  },
];

// Kept as-is. Tell me any changes once you have the final list.
export const DOCUMENTS = [
  "Birth certificate",
  "Child's passport-size photographs",
  "Parent's ID proof (such as Aadhaar)",
  "Address proof",
  "Previous school report card and transfer certificate (if applicable)",
];
