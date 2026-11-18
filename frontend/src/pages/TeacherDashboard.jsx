import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/attendance")
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const marked = data ? data.students.filter((s) => s.status) : [];
  const present = marked.filter((s) => s.status === "Present").length;
  const absent = marked.filter((s) => s.status === "Absent").length;
  const className = user.teacher?.classLevel;

  return (
    <div className="page dashboard">
      <section className="hero">
        <div>
          <p className="eyebrow light">WELCOME BACK</p>
          <h2>Hello, {user.name.split(" ")[0]} 👋</h2>
          <p>{className ? `You look after ${className}.` : "No class assigned yet."}</p>
          <div className="hero-actions">
            <Link className="button light" to="/teacher/attendance">✅ Mark attendance</Link>
            <Link className="button ghost" to="/teacher/materials">🗂️ Study materials</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">🍎</div>
      </section>

      {error && <p className="alert">{error}</p>}
      {!data && !error && <p>Loading…</p>}

      {data && (
        <>
          <div className="stat-grid">
            <article className="stat-card tone-blue"><div className="stat-icon">🧒</div><p>My students</p><h2>{data.students.length}</h2><small>In {className}</small></article>
            <article className="stat-card tone-green"><div className="stat-icon">✅</div><p>Present today</p><h2>{present}</h2><small>{data.date}</small></article>
            <article className="stat-card tone-orange"><div className="stat-icon">❌</div><p>Absent today</p><h2>{absent}</h2><small>{data.date}</small></article>
            <article className="stat-card tone-purple"><div className="stat-icon">📝</div><p>Not marked</p><h2>{data.students.length - marked.length}</h2><small>Still to mark</small></article>
          </div>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>My class today</h3>
                <p>Attendance for {data.date}</p>
              </div>
              <Link className="text-button" to="/teacher/attendance">Open attendance</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Student ID</th><th>Today</th></tr></thead>
                <tbody>
                  {data.students.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.studentCode}</td>
                      <td>
                        <span className={`status ${s.status === "Present" ? "active" : ""}`}>
                          {s.status || "Not marked"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!data.students.length && (
                    <tr className="no-hover"><td colSpan={3} className="empty-cell">No students in your class yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
