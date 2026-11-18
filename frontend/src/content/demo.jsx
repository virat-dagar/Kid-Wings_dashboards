// SAMPLE LANDING CONTENT (for review only).
// Every value below is made-up. Replace with the school's real details.
//
// DEMO_MODE = true  -> landing page shows the sample content below.
// DEMO_MODE = false -> landing page shows the yellow "TO ADD" placeholder boxes again.

export const DEMO_MODE = true;

const list = (items) => (
  <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem", lineHeight: 1.8 }}>
    {items.map((x) => <li key={x}>{x}</li>)}
  </ul>
);

export const DEMO = {
  admissionsOpen: "Admissions open for 2027-28",
  tagline: "A happy first step into learning",
  heroSubtext:
    " KIDWINGS is a caring preschool where children learn through play, songs, stories and hands-on activities in a safe and joyful space.",

  schoolPhotos: (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        ["Classroom", "#dce9ff"],
        ["Play area", "#e6f3df"],
        ["Activity corner", "#fbe2df"],
        ["Reading nook", "#eee5fa"],
      ].map(([label, bg]) => (
        <div key={label} style={{ background: bg, borderRadius: 14, minHeight: 110, display: "grid", placeItems: "center", color: "#2b2250", fontWeight: 700 }}>
          {label}
          <small style={{ display: "block", fontWeight: 400, color: "#6b6880" }}>sample photo</small>
        </div>
      ))}
    </div>
  ),

  aboutText:
    "At KIDWINGS, every child is treated as an individual. Our teachers use play-based learning to build language, numbers, social skills and confidence. Class sizes are kept small, with one teacher for each class, and the school follows strict safety and hygiene routines. (Sample text.)",

  ageCutoff: "Age cut-off: a child must complete the required age by 31 March of the admission year. (Sample)",

  "syllabus-nursery": list(["Colours and shapes", "Rhymes and songs", "Early counting 1 to 10", "Drawing and colouring"]),
  "syllabus-lkg": list(["Letters A to Z", "Numbers 1 to 50", "Stories and picture reading", "Art and craft"]),
  "syllabus-ukg": list(["Phonics and simple words", "Numbers 1 to 100", "Environment (EVS) basics", "Creative writing practice"]),
  "syllabus-class1": list(["English reading and writing", "Mathematics: addition and subtraction", "Hindi basics", "Environment and general knowledge"]),
  "syllabus-class2": list(["English grammar basics", "Mathematics: multiplication and division", "Hindi reading", "Environment and general knowledge"]),

  facilities: list(["Bright, airy classrooms", "Outdoor play area", "Activity and craft room", "Reading corner", "Clean toilets and hand-wash stations", "First-aid kit and trained staff"]),

  dailyRoutine: list(["8:30 AM: Arrival and free play", "9:00 AM: Morning circle and rhymes", "9:30 AM: Learning activity", "10:30 AM: Snack break", "11:00 AM: Outdoor play", "12:00 PM: Story time", "12:30 PM: Pick-up"]),

  feeTable: (
    <div>
      <table className="table" style={{ width: "100%" }}>
        <thead>
          <tr><th>Class</th><th>Admission fee</th><th>Monthly fee</th><th>Annual charges</th></tr>
        </thead>
        <tbody>
          {[
            ["Nursery", "₹5,000", "₹2,500", "₹3,000"],
            ["LKG", "₹5,000", "₹2,700", "₹3,000"],
            ["UKG", "₹5,000", "₹2,900", "₹3,500"],
            ["Class 1", "₹6,000", "₹3,200", "₹4,000"],
            ["Class 2", "₹6,000", "₹3,400", "₹4,000"],
          ].map((row) => (
            <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 8 }}>Sample figures for presentation only.</p>
    </div>
  ),

  phone: "+91 00000 00000 (sample)",
  email: "hello@kidwings.example (sample)",
  address: "Sample address, Sohna, Gurugram, Haryana (sample)",
  officeHours: "Monday to Saturday, 8:30 AM to 1:30 PM (sample)",

  mapEmbed: (
    <div style={{ background: "#eef6ff", borderRadius: 16, minHeight: 240, display: "grid", placeItems: "center", textAlign: "center", padding: 20 }}>
      <div>
        <strong>Map appears here</strong>
        <p className="muted" style={{ margin: "6px 0 0" }}>Google Maps embed (sample)</p>
      </div>
    </div>
  ),
};
