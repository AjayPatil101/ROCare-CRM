import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService.js";
import { getErrorMessage } from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import StatCard from "../components/common/StatCard.jsx";
import { money } from "../utils/format.js";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([dashboardService.getStats(), dashboardService.getEarningsReport(30)])
      .then(([statsRes, seriesRes]) => {
        setStats(statsRes.data.data);
        setSeries(seriesRes.data.data);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader label="Loading reports..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!stats) return null;

  const max = Math.max(...series.map((s) => s.total), 1);
  const points = series
    .map((s, i) => {
      const x = (i / Math.max(series.length - 1, 1)) * 600;
      const y = 180 - (s.total / max) * 160 - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <section>
      <div className="page-head">
        <div><h1>Reports</h1><p>Business performance at a glance.</p></div>
      </div>
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <StatCard icon="👥" iconBg="var(--blue-light)" iconColor="var(--blue)" value={stats.totalCustomers} label="Total Customers" />
        <StatCard icon="🛠️" iconBg="var(--green-bg)" iconColor="var(--green)" value={stats.totalServices} label="Total Services" />
        <StatCard icon="₹" iconBg="var(--purple-bg)" iconColor="var(--purple)" value={money(stats.totalEarningsThisMonth)} label="Total Earnings" />
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Earnings Overview (last 30 days)</h3></div>
        {series.length === 0 ? (
          <div className="empty"><div className="ic">📊</div>No earnings recorded in this period yet.</div>
        ) : (
          <svg viewBox="0 0 600 180" width="100%" height="180" preserveAspectRatio="none">
            <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" points={points} />
            <polyline fill="rgba(37,99,235,0.08)" stroke="none" points={`${points} 600,180 0,180`} />
          </svg>
        )}
      </div>
    </section>
  );
};

export default Reports;
