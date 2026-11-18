import { useEffect, useState } from "react";
import api, { errorMessage } from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import { Avatar, plural } from "../components/ui.jsx";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/teachers")
      .then((res) => setTeachers(res.data.teachers))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const items = teachers.filter(
    (t) =>
      (t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.classLevel.toLowerCase().includes(q.toLowerCase())) &&
      (status === "All" || t.status === status),
  );

  const openTeacher = (t) => {
    setMsg({ type: "", text: "" });
    setSelected(t);
  };

  const toggleStatus = async (t) => {
    const next = t.status === "Active" ? "Inactive" : "Active";
    if (
      next === "Inactive" &&
      !window.confirm(`${t.name} will no longer be able to sign in. Continue?`)
    )
      return;

    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      await api.patch(`/teachers/${t.id}/status`, { status: next });
      setTeachers((list) =>
        list.map((x) => (x.id === t.id ? { ...x, status: next } : x)),
      );
      setSelected((s) => (s && s.id === t.id ? { ...s, status: next } : s));
      setMsg({ type: "ok", text: `${t.name} is now ${next.toLowerCase()}.` });
    } catch (err) {
      setMsg({ type: "error", text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="toolbar">
        <div className="search">
          🔍
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or class"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <p className="result-note">Showing {plural(items.length, "educator")}</p>
      {error && <p className="alert">{error}</p>}

      <div className="teacher-grid">
        {items.map((t) => (
          <button
            className="teacher-card"
            key={t.id}
            onClick={() => openTeacher(t)}
          >
            <div className="teacher-card-top" style={{ background: t.color }}>
              <span
                className={`status ${t.status === "Active" ? "active" : ""}`}
              >
                {t.status}
              </span>
            </div>
            <div className="teacher-card-body">
              <Avatar name={t.name} color={t.color} />
              <h3>{t.name}</h3>
              <p className="id-label">{t.title}</p>
              <div className="teacher-meta">
                <span>🏫 {t.classLevel}</span>
                <span>🧒 {plural(t.studentCount, "student")}</span>
                {t.email && <span>✉️ {t.email}</span>}
              </div>
              <span className="view-profile">
                View profile <b>→</b>
              </span>
            </div>
          </button>
        ))}
        {!items.length && (
          <div className="empty-state">
            <span>🔍</span>
            <h3>No teachers found</h3>
            <p>Try a different name or filter.</p>
          </div>
        )}
      </div>

      {selected && (
        <Modal
          title={`${selected.name} profile`}
          onClose={() => setSelected(null)}
        >
          <div className="pm-head">
            <Avatar name={selected.name} color={selected.color} xl />
            <div className="pm-title">
              <p className="eyebrow">Educator profile</p>
              <h2>{selected.name}</h2>
              <p className="muted">{selected.title}</p>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-tile">
              <span className="info-icon">🏫</span>
              <div>
                <small>Class</small>
                <strong>{selected.classLevel}</strong>
              </div>
            </div>
            <div className="info-tile">
              <span className="info-icon">🧒</span>
              <div>
                <small>Students</small>
                <strong>{selected.studentCount}</strong>
              </div>
            </div>
            <div className="info-tile">
              <span className="info-icon">🔘</span>
              <div>
                <small>Status</small>
                <strong>{selected.status}</strong>
              </div>
            </div>
            <div className="info-tile wide">
              <span className="info-icon">✉️</span>
              <div>
                <small>Login email</small>
                <strong>{selected.email || "Not set"}</strong>
              </div>
            </div>
          </div>

          {msg.text && (
            <p
              className={`alert ${msg.type === "ok" ? "info" : ""}`}
              style={{ margin: "12px 28px 0" }}
            >
              {msg.text}
            </p>
          )}

          <div className="modal-foot" style={{ gap: 10 }}>
            <button
              type="button"
              className={
                selected.status === "Active" ? "button plain" : "button"
              }
              onClick={() => toggleStatus(selected)}
              disabled={busy}
            >
              {busy
                ? "Saving…"
                : selected.status === "Active"
                  ? "Make inactive"
                  : "Make active"}
            </button>
            <button
              type="button"
              className="button plain"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
