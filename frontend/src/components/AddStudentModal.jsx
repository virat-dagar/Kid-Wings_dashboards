import { useState } from "react";
import Modal from "./Modal.jsx";
import api, { errorMessage } from "../lib/api.js";
import { CLASSES } from "../content/site.js";

export default function AddStudentModal({ onClose, onSaved }) {
  const [f, setF] = useState({ name: "", classLevel: CLASSES[0].name, guardianName: "", parentPhone: "", dateOfBirth: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/students", f);
      onSaved(data.student);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Add a new student" onClose={onClose}>
      <form onSubmit={submit} className="form-body">
        <div className="form-head">
          <span className="form-icon">🧒</span>
          <div>
            <h2>Add a new student</h2>
            <p className="muted">Welcome a new little learner to the class.</p>
          </div>
        </div>
        <label className="field"><span>Child's name</span>
          <input required value={f.name} onChange={set("name")} placeholder="e.g. Aarav Sharma" />
        </label>
        <label className="field"><span>Class</span>
          <select value={f.classLevel} onChange={set("classLevel")}>
            {CLASSES.map((c) => <option key={c.key} value={c.name}>{c.name}</option>)}
          </select>
        </label>
        <label className="field"><span>Parent / guardian name</span>
          <input value={f.guardianName} onChange={set("guardianName")} placeholder="Parent name" />
        </label>
        <label className="field"><span>Parent phone</span>
          <input value={f.parentPhone} onChange={set("parentPhone")} placeholder="10-digit mobile" />
        </label>
        <label className="field"><span>Date of birth</span>
          <input type="date" value={f.dateOfBirth} onChange={set("dateOfBirth")} />
        </label>
        {error && <p className="alert">{error}</p>}
        <div className="modal-foot">
          <button type="button" className="button plain" onClick={onClose}>Cancel</button>
          <button type="submit" className="button" disabled={busy}>{busy ? "Saving…" : "Save student"}</button>
        </div>
      </form>
    </Modal>
  );
}
