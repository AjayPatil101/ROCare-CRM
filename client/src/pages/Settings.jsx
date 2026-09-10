import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";

const settingsItems = [
  ["🧾", "Business Profile"], ["👤", "User Profile"], ["🔑", "Change Password"],
  ["🔔", "Notification Settings"], ["⏰", "Reminder Settings — Every 3 Months"],
  ["💾", "Backup & Restore"], ["🚪", "Logout"],
];

const Settings = () => {
  const { user, logout } = useAuth();
  const [activePanel, setActivePanel] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState({ error: "", success: "", loading: false });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ error: "", success: "", loading: true });
    try {
      await authService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setStatus({ error: "", success: "Password updated successfully.", loading: false });
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: "", loading: false });
    }
  };

  const handleClick = (label) => {
    if (label === "Logout") return logout();
    if (label === "Change Password") return setActivePanel(activePanel === "pw" ? null : "pw");
    setActivePanel(null);
  };

  return (
    <section>
      <div className="page-head"><div><h1>Settings</h1><p>Manage your account and app preferences.</p></div></div>
      <div className="panel" style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 14, fontSize: 13, color: "var(--sub)" }}>
          Logged in as <b style={{ color: "var(--ink)" }}>{user?.name}</b> ({user?.email})
        </div>
        {settingsItems.map(([ic, label]) => (
          <div className="history-item" style={{ cursor: "pointer" }} key={label} onClick={() => handleClick(label)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 17 }}>{ic}</span>
              <span className="t">{label}</span>
            </div>
            <span style={{ color: "var(--sub)" }}>›</span>
          </div>
        ))}
      </div>

      {activePanel === "pw" && (
        <div className="panel" style={{ maxWidth: 520, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Change Password</h3>
          {status.error && <div className="error-banner">{status.error}</div>}
          {status.success && <div className="empty" style={{ padding: 10 }}>{status.success}</div>}
          <form onSubmit={handlePasswordChange}>
            <div className="field">
              <label>Current Password</label>
              <input type="password" required value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>New Password</label>
              <input type="password" required minLength={6} value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={status.loading}>
                {status.loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default Settings;
