import { useEffect, useState } from "react";
import api, { errorMessage } from "../lib/api.js";
import { Avatar, plural } from "../components/ui.jsx";

export default function Assignments() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/teachers"), api.get("/students")])
      .then(([t, s]) => {
        setTeachers(t.data.teachers);
        setStudents(s.data.students);
        setId(t.data.teachers[0]?.id || "");
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const t = teachers.find((x) => x.id === id);
  const group = students.filter((s) => s.classLevel === t?.classLevel);

  return (
    <div className="page assignment-page">
      {error && <p className="alert">{error}</p>}
      <section className="assignment-select">
        <p className="eyebrow">SELECT AN EDUCATOR</p>
        <div className="teacher-picker">
          {teachers.map((x) => (
            <button className={id === x.id ? "picked" : ""} onClick={() => setId(x.id)} key={x.id}>
              <Avatar name={x.name} color={x.color} small />
              <span>
                {x.name}
                <small>{x.classLevel} · {plural(x.studentCount, "student")}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {t && (
        <section className="assignment-detail">
          <div className="assignment-head">
            <Avatar name={t.name} color={t.color} />
            <div>
              <h3>{t.name}</h3>
              <p className="muted">{t.title} · {t.classLevel} · {t.status}</p>
            </div>
          </div>
          <p className="result-note">{plural(group.length, "student")} in {t.classLevel}</p>
          <div className="student-mini-grid">
            {group.map((s) => (
              <div className="student-mini" key={s._id}>
                <strong>{s.name}</strong>
                <small>{s.studentCode}</small>
              </div>
            ))}
            {!group.length && <p className="muted">No students in this class yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
