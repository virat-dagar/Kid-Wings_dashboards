import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../lib/api.js";

const STATUSES = ["New", "Contacted", "Visit booked", "Enrolled", "Closed"];

export default function Enquiries() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [notesDraft, setNotesDraft] = useState({}); // id -> text typed but not yet saved
  const [savingId, setSavingId] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [error, setError] = useState("");

  const load = () =>
    api.get("/enquiries", { params: filter ? { status: filter } : {} })
      .then((res) => setItems(res.data.enquiries))
      .catch((err) => setError(errorMessage(err)));

  useEffect(() => { load(); }, [filter]);

  // Warn before leaving the page if a note has been typed but not saved
  const hasUnsaved = useMemo(() => Object.keys(notesDraft).length > 0, [notesDraft]);
  useEffect(() => {
    if (!hasUnsaved) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsaved]);

  const changeStatus = async (id, status) => {
    setMsg({ type: "", text: "" });
    try {
      const { data } = await api.patch(`/enquiries/${id}`, { status });
      setItems((list) => list.map((e) => (e._id === id ? data.enquiry : e)));
    } catch (err) {
      setMsg({ type: "error", text: errorMessage(err) });
    }
  };

  const saveNote = async (id) => {
    setSavingId(id);
    setMsg({ type: "", text: "" });
    try {
      const { data } = await api.patch(`/enquiries/${id}`, { notes: notesDraft[id] ?? "" });
      setItems((list) => list.map((e) => (e._id === id ? data.enquiry : e)));
      setNotesDraft(({ [id]: _saved, ...rest }) => rest);
      setMsg({ type: "ok", text: "Note saved." });
    } catch (err) {
      setMsg({ type: "error", text: errorMessage(err) });
    } finally {
      setSavingId("");
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="page">
      <div className="toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <p className="result-note">{items.length} enquir{items.length === 1 ? "y" : "ies"}</p>
      {error && <p className="alert">{error}</p>}
      {msg.text && <p className={msg.type === "ok" ? "alert info" : "alert"}>{msg.text}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Received</th><th>Parent</th><th>Child</th><th>Class</th>
              <th>Contact</th><th>Message</th><th>Status</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => {
              const draft = notesDraft[e._id];
              const value = draft ?? e.notes ?? "";
              return (
                <tr key={e._id} className="no-hover">
                  <td>{fmt(e.createdAt)}</td>
                  <td>{e.parentName}</td>
                  <td>
                    {e.childName}
                    <br /><small className="muted">DOB {fmt(e.childDob)}</small>
                  </td>
                  <td><span className="chip">{e.classApplying}</span></td>
                  <td>
                    {e.phone}
                    {e.email && <><br /><small className="muted">{e.email}</small></>}
                  </td>
                  <td className="wrap">{e.message || <span className="muted">—</span>}</td>
                  <td>
                    <select value={e.status} onChange={(ev) => changeStatus(e._id, ev.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="notes-cell">
                    <input
                      value={value}
                      placeholder="Add a note"
                      onChange={(ev) => setNotesDraft({ ...notesDraft, [e._id]: ev.target.value })}
                      onKeyDown={(ev) => { if (ev.key === "Enter") saveNote(e._id); }}
                    />
                    {draft !== undefined && draft !== (e.notes ?? "") && (
                      <button className="button" onClick={() => saveNote(e._id)} disabled={savingId === e._id}>
                        {savingId === e._id ? "Saving…" : "Save"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!items.length && (
              <tr className="no-hover"><td colSpan={8} className="empty-cell">No enquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
