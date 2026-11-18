import { useState } from "react";
import Modal from "./Modal.jsx";
import api, { errorMessage } from "../lib/api.js";

export default function ImportStudentsModal({ onClose, onDone }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await api.post("/students/import", body);
      setResult(data);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Import students from Excel" onClose={onClose}>
      <form onSubmit={upload} className="form-body">
        <div className="form-head">
          <span className="form-icon">📥</span>
          <div>
            <h2>Import students from Excel</h2>
            <p className="muted">Upload the admissions sheet. Existing students are updated, not duplicated.</p>
          </div>
        </div>
        <label className="field"><span>Excel file (.xlsx)</span>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        {error && <p className="alert">{error}</p>}
        {result && (
          <p className="alert info">
            Added {result.inserted}, updated {result.updated}, skipped {result.skipped}.
            {result.problems?.length > 0 && <><br /><small>{result.problems.slice(0, 3).join(" · ")}</small></>}
          </p>
        )}
        <div className="modal-foot">
          <button type="button" className="button plain" onClick={onClose}>Close</button>
          <button type="submit" className="button" disabled={!file || busy}>{busy ? "Importing…" : "Upload"}</button>
        </div>
      </form>
    </Modal>
  );
}
