import { NavLink } from "react-router-dom";

export default function Sidebar({ items, base, open, close, user, onSignOut }) {
  const isAdmin = user.role === "admin";
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>KIDWINGS</span>
        </div>
        <p className="nav-label">MAIN MENU</p>
        <nav>
          {items.map(([path, label, icon]) => (
            <NavLink
              key={path || "home"}
              to={path ? `${base}/${path}` : base}
              end={path === ""}
              onClick={close}
              className={({ isActive }) => (isActive ? "selected" : "")}
            >
              <i>{icon}</i>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-help">
          <span>🌈</span>
          <div>
            <strong>Learning is fun!</strong>
            <small>Little steps, big wings</small>
          </div>
        </div>
        <NavLink to={`${base}/profile`} onClick={close} className="side-user">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user.name}</strong>
            <small>{isAdmin ? "Administrator" : user.teacher?.classLevel ? `Teacher · ${user.teacher.classLevel}` : "Teacher"}</small>
          </div>
        </NavLink>
        <button className="text-button side-signout" onClick={onSignOut}>Sign out</button>
      </aside>
      {open && <button className="sidebar-scrim" onClick={close} aria-label="Close navigation" />}
    </>
  );
}
