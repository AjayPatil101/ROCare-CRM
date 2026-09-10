import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService.js";
import { getErrorMessage } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import StatCard from "../../components/common/StatCard.jsx";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    adminService.getOverview().then((res) => setData(res.data.data)).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <section>
      <div className="page-head"><div><h1>Admin Dashboard</h1><p>Overview of users, content and messages.</p></div></div>
      <div className="stat-grid">
        <StatCard icon="👤" iconBg="var(--blue-light)" iconColor="var(--blue)" value={data.userCount} label="Users" />
        <StatCard icon="👥" iconBg="var(--green-bg)" iconColor="var(--green)" value={data.customerCount} label="Customers" />
        <StatCard icon="🛠️" iconBg="var(--purple-bg)" iconColor="var(--purple)" value={data.serviceCount} label="Services Logged" />
        <StatCard icon="✉️" iconBg="var(--orange-bg)" iconColor="var(--orange)" value={data.newMessages} label="New Messages" />
      </div>
    </section>
  );
};

export default AdminDashboard;
