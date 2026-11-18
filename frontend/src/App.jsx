import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardShell from "./components/DashboardShell.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Enquiries from "./pages/Enquiries.jsx";
import Teachers from "./pages/Teachers.jsx";
import Students from "./pages/Students.jsx";
import Attendance from "./pages/Attendance.jsx";
import Assignments from "./pages/Assignments.jsx";
import Syllabus from "./pages/Syllabus.jsx";
import Materials from "./pages/Materials.jsx";
import Profile from "./pages/Profile.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Admin only */}
      <Route
        path="/admin"
        element={<ProtectedRoute role="admin"><DashboardShell /></ProtectedRoute>}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="students" element={<Students />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="syllabus" element={<Syllabus />} />
        <Route path="materials" element={<Materials />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Teacher only */}
      <Route
        path="/teacher"
        element={<ProtectedRoute role="teacher"><DashboardShell /></ProtectedRoute>}
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="syllabus" element={<Syllabus />} />
        <Route path="materials" element={<Materials />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
