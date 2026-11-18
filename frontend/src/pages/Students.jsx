import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../lib/api.js";
import { CLASSES } from "../content/site.js";
import { plural, Btn } from "../components/ui.jsx";
import AddStudentModal from "../components/AddStudentModal.jsx";
import ImportStudentsModal from "../components/ImportStudentsModal.jsx";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState("All classes");
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    api.get("/students")
      .then((res) => setStudents(res.data.students))
      .catch((err) => setError(errorMessage(err)));

  useEffect(() => { load(); }, []);

  const items = useMemo(
    () =>
      students.filter(
        (s) =>
          (s.name.toLowerCase().includes(q.toLowerCase()) || s.studentCode.toLowerCase().includes(q.toLowerCase())) &&
          (classFilter === "All classes" || s.classLevel === classFilter),
      ),
    [students, q, classFilter],
  );

  const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");

  return (
    <div className="page">
      <div className="toolbar student-toolbar">
        <div className="search">
          🔍
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student by name or ID" />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option>All classes</option>
          {CLASSES.map((c) => <option key={c.key}>{c.name}</option>)}
        </select>
        <Btn plain onClick={() => setImporting(true)}>⬆ Import Excel</Btn>
        <Btn onClick={() => setAdding(true)}>＋ Add Student</Btn>
      </div>
      <p className="result-note">Showing {plural(items.length, "student")}</p>
      {msg && <p className="alert info">{msg}</p>}
      {error && <p className="alert">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th><th>Student ID</th><th>Class</th><th>Parent / Guardian</th>
              <th>Parent phone</th><th>Date of birth</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s._id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.studentCode}</td>
                <td><span className="chip">{s.classLevel}</span></td>
                <td>{s.guardianName || "—"}</td>
                <td>{s.parentPhone || "—"}</td>
                <td>{fmt(s.dateOfBirth)}</td>
                <td><span className={`status ${s.status === "Active" ? "active" : ""}`}>{s.status}</span></td>
              </tr>
            ))}
            {!items.length && (
              <tr className="no-hover"><td colSpan={7} className="empty-cell">No students found. Try a different search or filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {adding && (
        <AddStudentModal
          onClose={() => setAdding(false)}
          onSaved={(s) => { setAdding(false); setMsg(`${s.name} added with ID ${s.studentCode}.`); load(); }}
        />
      )}
      {importing && (
        <ImportStudentsModal onClose={() => setImporting(false)} onDone={load} />
      )}
    </div>
  );
}
