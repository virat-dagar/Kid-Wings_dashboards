import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errorMessage } from "../lib/api.js";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="center-screen">Loading…</div>;
  if (user)
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/teacher"} replace />
    );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const signedIn = await login(email.trim(), password);
      navigate(signedIn.role === "admin" ? "/admin" : "/teacher", {
        replace: true,
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <Link to="/" className="brand">
          KIDWINGS
        </Link>
        <h1>Staff sign in</h1>
        <p className="muted">For admins and teachers only.</p>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="alert">{error}</p>}

        <button type="submit" className="btn btn-primary full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/" className="back-link">
          ← Back to website
        </Link>
      </form>
    </div>
  );
}
