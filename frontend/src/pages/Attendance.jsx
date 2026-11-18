import { useEffect, useState } from "react";
import api, { errorMessage } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { CLASSES } from "../content/site.js";
import { Btn } from "../components/ui.jsx";
import ClassTabs from "../components/ClassTabs.jsx";

const todayStr = () => new Date().toISOString().slice(0, 10);
const fmt = (d) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const lockedClass = user.teacher?.classLevel;
  const classNames = CLASSES.map((c) => c.name);

  const [classLevel, setClassLevel] = useState(isAdmin ? classNames[0] : lockedClass);
  const [date, setDate] = useState(todayStr());
  const [month, setMonth] = useState(todayStr().slice(0, 7));
  const [students, setStudents] = useState([]);
  const [saved, setSaved] = useState({});
  const [marks, setMarks] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [error, setError] = useState("");

  const dirty = students.some((s) => (marks[s.id] ?? null) !== (saved[s.id] ?? null));

  const loadDay = (d, c) => {
    if (!c) return;
    setLoading(true);
    setError("");
    api
      .get("/attendance", { params: { date: d, classLevel: c } })
      .then(({ data }) => {
        const map = Object.fromEntries(data.students.map((s) => [s.id, s.status]));
        setStudents(data.students);
        setSaved(map);
        setMarks(map);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  const loadHistory = (m, c) => {
    if (!c) return;
    api
      .get("/attendance/days", { params: { month: m, classLevel: c } })
      .then(({ data }) => setHistory(data.days))
      .catch((err) => setError(errorMessage(err)));
  };

  useEffect(() => { loadDay(date, classLevel); }, [date, classLevel]);
  useEffect(() => { loadHistory(month, classLevel); }, [month, classLevel]);

  const confirmLeave = () => !dirty || window.confirm("You have unsaved changes. Discard them?");

  const changeDate = (d) => {
    if (d && confirmLeave()) {
      setMsg({ type: "", text: "" });
      setDate(d);
    }
  };

  const changeClass = (c) => {
    if (c === classLevel) return;
    if (!confirmLeave()) return;
    setMsg({ type: "", text: "" });
    setClassLevel(c);
  };

  const setMark = (id, status) => setMarks((m) => ({ ...m, [id]: status }));
  const markAll = (status) => setMarks(Object.fromEntries(students.map((s) => [s.id, status])));

  const save = async () => {
    const records = students
      .filter((s) => marks[s.id])
      .map((s) => ({ studentId: s.id, status: marks[s.id] }));
    if (!records.length) return setMsg({ type: "error", text: "Mark at least one student first." });

    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await api.post("/attendance", { date, records });
      setSaved(marks);
      setMsg({ type: "ok", text: `Saved ${records.length} record(s) for ${fmt(date)}.` });
      loadHistory(month, classLevel);
    } catch (err) {
      setMsg({ type: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const present = students.filter((s) => marks[s.id] === "Present").length;
  const absent = students.filter((s) => marks[s.id] === "Absent").length;

  return (
    <div className="page">
      {isAdmin ? (
        <div style={{ marginBottom: 14 }}>
          <p className="eyebrow" style={{ margin: "0 0 8px" }}>SELECT A CLASS</p>
          <ClassTabs classes={classNames} value={classLevel} onChange={changeClass} />
        </div>
      ) : (
        <div style={{ marginBottom: 14 }}>
          <span className="chip">Your class: {lockedClass}</span>
        </div>
      )}

      <div className="toolbar">
        <input
          type="date"
          value={date}
          onChange={(e) => changeDate(e.target.value)}
          aria-label="Attendance date"
        />
        <Btn plain onClick={() => changeDate(todayStr())}>Today</Btn>
        <Btn plain onClick={() => markAll("Present")}>All present</Btn>
        <Btn plain onClick={() => markAll("Absent")}>All absent</Btn>
        <Btn onClick={save} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save attendance"}
        </Btn>
      </div>

      <p className="result-note">
        {classLevel} · {fmt(date)} · {present} present · {absent} absent ·{" "}
        {students.length - present - absent} not marked
        {dirty && <strong> · unsaved changes</strong>}
      </p>
      {msg.text && <p className={msg.type === "ok" ? "alert info" : "alert"}>{msg.text}</p>}
      {error && <p className="alert">{error}</p>}
      {loading && <p className="muted">Loading…</p>}

      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Student</th><th>Student ID</th><th>Mark</th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="no-hover">
                  <td><strong>{s.name}</strong></td>
                  <td>{s.studentCode}</td>
                  <td>
                    <Btn plain={marks[s.id] !== "Present"} onClick={() => setMark(s.id, "Present")}>Present</Btn>{" "}
                    <Btn plain={marks[s.id] !== "Absent"} onClick={() => setMark(s.id, "Absent")}>Absent</Btn>
                  </td>
                </tr>
              ))}
              {!students.length && (
                <tr className="no-hover">
                  <td colSpan={3} className="empty-cell">No students in this class yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <section className="panel" style={{ marginTop: 24 }}>
        <div className="panel-head">
          <div>
            <h3>History · {classLevel}</h3>
            <p>Days with saved attendance. Open any day to view or correct it.</p>
          </div>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Present</th><th>Absent</th><th>Total marked</th><th></th></tr>
            </thead>
            <tbody>
              {history.map((d) => (
                <tr key={d.date}>
                  <td>{fmt(d.date)}</td>
                  <td>{d.present}</td>
                  <td>{d.absent}</td>
                  <td>{d.total}</td>
                  <td><Btn plain onClick={() => changeDate(d.date)}>Open</Btn></td>
                </tr>
              ))}
              {!history.length && (
                <tr className="no-hover">
                  <td colSpan={5} className="empty-cell">No attendance saved for {classLevel} this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
