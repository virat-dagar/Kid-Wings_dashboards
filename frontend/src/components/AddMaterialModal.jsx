import { useState } from "react";
import Modal from "./Modal.jsx";
import api, { errorMessage } from "../lib/api.js";
import { syllabus } from "../content/syllabus.js";
import { CLASSES } from "../content/site.js";

const TYPES = ["Worksheet", "PDF", "Video", "Image", "Link"];

export default function AddMaterialModal({ user, onClose, onSaved }) {
  const isAdmin = user.role === "admin";
  const ownClass = user.teacher?.classLevel || CLASSES[0].name;
  const [f, setF] = useState({
    title: "", classLevel: isAdmin ? CLASSES[0].name : ownClass,
    subject: "", type: "Worksheet", description: "", url: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const subjects = Object.keys(syllabus[f.classLevel] || {});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/materials", { ...f, subject: f.subject || subjects[0] });
      onSaved(data.material);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Add study material" onClose={onClose}>
      <form onSubmit={submit} className="form-body">
        <div className="form-head">
          <span className="form-icon">🗂️</span>
          <div>
            <h2>Add study material</h2>
            <p className="muted">Share a worksheet, video or notes with a class.</p>
          </div>
        </div>
        <label className="field"><span>Title</span>
          <input required minLength={3} value={f.title} onChange={set("title")} placeholder="e.g. Numbers 1–20 Worksheet" />
        </label>
        <label className="field"><span>Class</span>
          <select value={f.classLevel} onChange={(e) => setF({ ...f, classLevel: e.target.value, subject: "" })} disabled={!isAdmin}>
            {CLASSES.map((c) => <option key={c.key} value={c.name}>{c.name}</option>)}
          </select>
        </label>
        <label className="field"><span>Subject</span>
          <select value={f.subject || subjects[0]} onChange={set("subject")}>
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="field"><span>Type</span>
          <select value={f.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="field"><span>Link (optional)</span>
          <input value={f.url} onChange={set("url")} placeholder="https://…" />
        </label>
        <label className="field"><span>Description (optional)</span>
          <input value={f.description} onChange={set("description")} />
        </label>
        {error && <p className="alert">{error}</p>}
        <div className="modal-foot">
          <button type="button" className="button plain" onClick={onClose}>Cancel</button>
          <button type="submit" className="button" disabled={busy}>{busy ? "Saving…" : "Save material"}</button>
        </div>
      </form>
    </Modal>
  );
}
