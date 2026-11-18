import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";
import "../styles/dashboard.css";
import "../styles/overrides.css";

const ADMIN_NAV = [
  ["", "Dashboard", "🏠"],
  ["enquiries", "Enquiries", "📥"],
  ["teachers", "Teachers", "👩‍🏫"],
  ["students", "Students", "🧒"],
  ["attendance", "Attendance", "✅"],
  ["assignments", "Teacher Assignments", "🧩"],
  ["syllabus", "Syllabus", "📖"],
  ["materials", "Academic Materials", "🗂️"],
];

const TEACHER_NAV = [
  ["", "Dashboard", "🏠"],
  ["attendance", "Attendance", "✅"],
  ["syllabus", "Syllabus", "📖"],
  ["materials", "Academic Materials", "🗂️"],
];

const TITLES = {
  "": ["Dashboard", "Your school at a glance"],
  enquiries: ["Admission enquiries", "Track and follow up with parents"],
  teachers: ["Teachers", "Our educators and their classes"],
  students: ["Students", "Every little learner in the school"],
  attendance: ["Attendance", "Mark and review attendance day by day"],
  assignments: ["Teacher assignments", "Who looks after which students"],
  syllabus: ["Syllabus", "What each class learns"],
  materials: ["Academic materials", "Worksheets and resources for each class"],
  profile: ["My profile", "Your account details"],
};

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);

  const isAdmin = user.role === "admin";
  const base = isAdmin ? "/admin" : "/teacher";
  const items = isAdmin ? ADMIN_NAV : TEACHER_NAV;
  const page = pathname.replace(base, "").replace(/^\//, "").split("/")[0];
  const [title, sub] = TITLES[page] || TITLES[""];
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const signOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dash-app">
      <div className="app-shell">
        <Sidebar
          items={items}
          base={base}
          open={menu}
          close={() => setMenu(false)}
          user={user}
          onSignOut={signOut}
        />
        <main>
          <header>
            <button className="menu-button" onClick={() => setMenu(true)} aria-label="Open navigation">☰</button>
            <div>
              <h1>{title}</h1>
              <p>{sub}</p>
            </div>
            <div className="header-tools">
              <button className="header-avatar" onClick={() => navigate(`${base}/profile`)} title="My profile" aria-label="Open my profile">
                {initials}
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
