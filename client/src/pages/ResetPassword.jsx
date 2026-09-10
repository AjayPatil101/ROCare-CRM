import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", done: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", done: false });
    try {
      await authService.resetPassword(token, password);
      setStatus({ loading: false, error: "", done: true });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus({ loading: false, error: getErrorMessage(err), done: false });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset password</h2>
        {status.error && <div className="error-banner">{status.error}</div>}
        {status.done ? (
          <div className="empty"><div className="ic">✅</div>Password reset! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>New Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} disabled={status.loading}>
              {status.loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
