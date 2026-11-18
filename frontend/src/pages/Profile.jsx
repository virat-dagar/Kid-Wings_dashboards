import { useAuth } from "../context/AuthContext.jsx";
import { Avatar } from "../components/ui.jsx";

export default function Profile() {
  const { user } = useAuth();
  const t = user.teacher;
  return (
    <div className="page">
      <section className="panel">
        <div className="pm-head">
          <Avatar name={user.name} color={t?.color || "#dce9ff"} xl />
          <div className="pm-title">
            <p className="eyebrow">
              {user.role === "admin" ? "Administrator" : "Educator"}
            </p>
            <h2>{user.name}</h2>
            <p className="muted">{user.email}</p>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-tile">
            <span className="info-icon">🔐</span>
            <div>
              <small>Role</small>
              <strong>{user.role === "admin" ? "Admin" : "Teacher"}</strong>
            </div>
          </div>
          {t && (
            <>
              <div className="info-tile">
                <span className="info-icon">🏫</span>
                <div>
                  <small>Class</small>
                  <strong>{t.classLevel}</strong>
                </div>
              </div>
              <div className="info-tile">
                <span className="info-icon">🎓</span>
                <div>
                  <small>Title</small>
                  <strong>{t.title || "—"}</strong>
                </div>
              </div>
              <div className="info-tile">
                <span className="info-icon">🔘</span>
                <div>
                  <small>Status</small>
                  <strong>{t.status}</strong>
                </div>
              </div>
            </>
          )}
        </div>
        <p className="form-note">
          {user.role === "admin"
            ? "Password changes are not available in the app yet. The admin password is set in the server's .env file."
            : "To change your password or details, contact the school administrator."}
        </p>
      </section>
    </div>
  );
}
