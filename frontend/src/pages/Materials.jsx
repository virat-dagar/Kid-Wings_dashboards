import { useEffect, useState } from "react";
import api, { errorMessage } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { syllabus, subjectMeta, typeMeta } from "../content/syllabus.js";
import { Btn } from "../components/ui.jsx";
import ClassTabs from "../components/ClassTabs.jsx";
import AddMaterialModal from "../components/AddMaterialModal.jsx";

export default function Materials() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const allowed = isAdmin ? Object.keys(syllabus) : [user.teacher?.classLevel].filter(Boolean);
  const [g, setG] = useState(allowed[0] || "Nursery");
  const [s, setS] = useState(Object.keys(syllabus[g] || {})[0]);
  const [list, setList] = useState([]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = () =>
    api.get("/materials", { params: { classLevel: g } })
      .then((res) => setList(res.data.materials))
      .catch((err) => setError(errorMessage(err)));

  useEffect(() => { load(); }, [g]);

  const subjects = Object.keys(syllabus[g] || {});
  const countFor = (sub) => list.filter((x) => x.subject === sub).length;
  const found = list.filter((x) => x.subject === s);

  const open = (m) => {
    if (m.url) window.open(m.url, "_blank", "noopener");
    else setMsg("This material has no link yet.");
  };

  return (
    <div className="page">
      <div className="materials-header">
        <div>
          <p className="eyebrow">RESOURCE LIBRARY</p>
          <h2>Academic materials</h2>
          <p>Organised teaching resources for every classroom.</p>
        </div>
        <Btn onClick={() => setAdding(true)}>＋ Add Material</Btn>
      </div>
      <ClassTabs classes={allowed} value={g} onChange={(x) => { setG(x); setS(Object.keys(syllabus[x])[0]); }} />
      <div className="subject-tabs">
        {subjects.map((sub) => (
          <button
            key={sub}
            className={`subject-tab tone-${subjectMeta[sub]?.tone ?? "purple"} ${sub === s ? "current" : ""}`}
            onClick={() => setS(sub)}
          >
            {subjectMeta[sub]?.emoji} {sub}
            <i>{countFor(sub)}</i>
          </button>
        ))}
      </div>
      {error && <p className="alert">{error}</p>}
      {msg && <p className="alert info">{msg}</p>}

      <div className="material-grid">
        {found.map((m) => (
          <article className={`material-card tone-${typeMeta[m.type]?.tone ?? "purple"}`} key={m._id}>
            <div className="material-icon">{typeMeta[m.type]?.emoji ?? "📄"}</div>
            <div className="material-type">{m.type}</div>
            <h3>{m.title}</h3>
            <p>{m.subject} · {m.classLevel}</p>
            {m.description && <p className="muted">{m.description}</p>}
            <div className="material-footer">
              <small>
                Added {new Date(m.createdAt).toLocaleDateString("en-IN")}
                <br />by {m.uploadedByName || "Staff"}
              </small>
              <Btn plain onClick={() => open(m)}>View →</Btn>
            </div>
          </article>
        ))}
        {!found.length && (
          <div className="empty-state">
            <span>📭</span>
            <h3>No materials yet</h3>
            <p>Resources for this class and subject will appear here.</p>
          </div>
        )}
      </div>

      {adding && (
        <AddMaterialModal
          user={user}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); setMsg("Material added."); load(); }}
        />
      )}
    </div>
  );
}
