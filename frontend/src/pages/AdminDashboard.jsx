import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../lib/api.js";
import { Avatar } from "../components/ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/dashboard"), api.get("/enquiries")])
      .then(([d, e]) => {
        setData(d.data);
        setEnquiries(e.data.enquiries);
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const newCount = enquiries.filter((e) => e.status === "New").length;
  const firstName = user.name.split(" ")[0];
  const stats = data && [
    [String(data.totals.students), "Total students", "Little learners enrolled", "🧒", "blue"],
    [String(data.teachers), "Active teachers", "Caring educators", "👩‍🏫", "orange"],
    [String(data.classes.length), "Classes", "Nursery to Class 2", "🏫", "green"],
    [String(newCount), "New enquiries", "Waiting for a reply", "📥", "purple"],
    [
      data.totals.students ? `${Math.round((data.totals.present / data.totals.students) * 100)}%` : "—",
      "Today's attendance",
      `${data.totals.present} of ${data.totals.students} present`,
      "✅",
      "teal",
    ],
  ];

  return (
    <div className="page dashboard">
      <section className="hero">
        <div>
          <p className="eyebrow light">WELCOME BACK</p>
          <h2>Hello, {firstName} 👋</h2>
          <p>Here's a quick look at what's happening at KIDWINGS today.</p>
          <div className="hero-actions">
            <Link className="button light" to="/admin/attendance">✅ Attendance</Link>
            <Link className="button ghost" to="/admin/enquiries">📥 Enquiries</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">🎒</div>
      </section>

      {error && <p className="alert">{error}</p>}
      {!data && !error && <p>Loading…</p>}

      {stats && (
        <div className="stat-grid">
          {stats.map((s) => (
            <article className={`stat-card tone-${s[4]}`} key={s[1]}>
              <div className="stat-icon">{s[3]}</div>
              <p>{s[1]}</p>
              <h2>{s[0]}</h2>
              <small>{s[2]}</small>
            </article>
          ))}
        </div>
      )}

      {data && (
        <div className="content-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Class overview</h3>
                <p>Attendance for {data.date}</p>
              </div>
              <Link className="text-button" to="/admin/attendance">Open attendance</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Class</th><th>Students</th><th>Present</th><th>Absent</th><th>Not marked</th><th>30-day rate</th></tr>
                </thead>
                <tbody>
                  {data.classes.map((c) => (
                    <tr key={c.classLevel}>
                      <td><span className="chip">{c.classLevel}</span></td>
                      <td>{c.students}</td>
                      <td>{c.present}</td>
                      <td>{c.absent}</td>
                      <td>{c.unmarked}</td>
                      <td>{c.rate30 != null ? `${c.rate30}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Latest enquiries</h3>
                <p>From the website form</p>
              </div>
              <Link className="text-button" to="/admin/enquiries">View all</Link>
            </div>
            {enquiries.slice(0, 5).map((e) => (
              <div className="activity-row" key={e._id}>
                <Avatar name={e.parentName} small />
                <div>
                  <strong>{e.parentName}</strong>
                  <p>{e.childName} · {e.classApplying}</p>
                </div>
                <time>{e.status}</time>
              </div>
            ))}
            {!enquiries.length && <p className="muted">No enquiries yet.</p>}
          </section>
        </div>
      )}
    </div>
  );
}
