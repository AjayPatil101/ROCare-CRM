import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService.js";
import { getErrorMessage } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { initials } from "../../utils/format.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    adminService.getUsers({ limit: 50 }).then((res) => setUsers(res.data.data)).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleActive = async (u) => {
    await adminService.updateUser(u._id, { isActive: !u.isActive });
    load();
  };

  const changeRole = async (u, role) => {
    await adminService.updateUser(u._id, { role });
    load();
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Delete user ${u.name}?`)) return;
    await adminService.deleteUser(u._id);
    load();
  };

  return (
    <section>
      <div className="page-head"><div><h1>Manage Users</h1><p>Control access and roles for your team.</p></div></div>
      <div className="panel">
        {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={load} /> : users.length === 0 ? (
          <EmptyState icon="👤" message="No users yet." />
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><div className="name-cell"><div className="mini-avatar">{initials(u.name)}</div>{u.name}</div></td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => changeRole(u, e.target.value)}>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td><span className={`pill ${u.isActive ? "paid" : "due"}`}>{u.isActive ? "Active" : "Disabled"}</span></td>
                  <td className="row-actions">
                    <button onClick={() => toggleActive(u)} title={u.isActive ? "Disable" : "Enable"}>{u.isActive ? "🚫" : "✅"}</button>
                    <button onClick={() => removeUser(u)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
