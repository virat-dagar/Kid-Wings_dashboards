import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { syllabus, subjectMeta } from "../content/syllabus.js";
import { plural } from "../components/ui.jsx";
import ClassTabs from "../components/ClassTabs.jsx";

export default function Syllabus() {
  const { user } = useAuth();
  const allowed = user.role === "admin" ? Object.keys(syllabus) : [user.teacher?.classLevel].filter(Boolean);
  const [g, setG] = useState(allowed[0] || "Nursery");
  const subs = syllabus[g] || {};
  const [open, setOpen] = useState(Object.keys(subs)[0]);

  return (
    <div className="page">
      <div className="page-intro">
        <p className="eyebrow">ACADEMIC FRAMEWORK</p>
        <h2>Class syllabus</h2>
        <p>Choose a class to explore its subject plan and learning topics.</p>
      </div>
      <ClassTabs classes={allowed} value={g} onChange={(x) => { setG(x); setOpen(Object.keys(syllabus[x])[0]); }} />
      <section className="syllabus-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">CLASS {g.toUpperCase()}</p>
            <h3>{g} curriculum</h3>
          </div>
          <span className="chip">{plural(Object.keys(subs).length, "subject")}</span>
        </div>
        {Object.entries(subs).map(([s, topics]) => (
          <div className={`accordion tone-${subjectMeta[s]?.tone ?? "purple"} ${open === s ? "is-open" : ""}`} key={s}>
            <button onClick={() => setOpen(open === s ? "" : s)}>
              <em className="subject-emoji">{subjectMeta[s]?.emoji ?? "⭐"}</em>
              <span><b>{s}</b><small>{plural(topics.length, "learning topic")}</small></span>
              <b className="acc-toggle">{open === s ? "−" : "+"}</b>
            </button>
            {open === s && (
              <ul>
                {topics.map((x) => <li key={x}><span>✓</span>{x}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
