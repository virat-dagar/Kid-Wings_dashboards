import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="center-screen">Loading…</div>;

  // Not signed in: go to login, remember where they were going
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  // Signed in with the wrong role: send them to their own dashboard
  if (role && user.role !== role) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/teacher"} replace />
    );
  }

  return children;
}
