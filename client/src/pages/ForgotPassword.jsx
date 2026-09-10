import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, sent: false, error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, sent: false, error: "" });
    try {
      await authService.forgotPassword(email);
      setStatus({ loading: false, sent: true, error: "" });
    } catch (err) {
      setStatus({ loading: false, sent: false, error: getErrorMessage(err) });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot password</h2>
        <p className="auth-sub">Enter your account email and we'll send you a reset link.</p>
        {status.error && <div className="error-banner">{status.error}</div>}
        {status.sent ? (
          <div className="empty"><div className="ic">📧</div>If that email exists, a reset link has been sent.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} disabled={status.loading}>
              {status.loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        <p className="auth-sub" style={{ marginTop: 16 }}>
          <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
