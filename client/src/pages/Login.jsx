import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../services/api.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand" style={{ justifyContent: "center", padding: "0 0 18px" }}>
          <div className="brand-icon">💧</div>
          <div className="brand-text" style={{ textAlign: "left" }}>
            <b style={{ color: "var(--ink)" }}>RO Service</b>
            <span>Management</span>
          </div>
        </div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to manage your customers and services.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>
          <div style={{ textAlign: "right", margin: "10px 0" }}>
            <Link to="/forgot-password" style={{ fontSize: 12.5, color: "var(--blue)", fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-sub" style={{ marginTop: 16 }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
