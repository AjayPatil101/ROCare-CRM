import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../services/dashboardService.js";
import { getErrorMessage } from "../services/api.js";
import StatCard from "../components/common/StatCard.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { fmtDate, money, initials } from "../utils/format.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    dashboardService
      .getStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!stats) return null;

  const { reminderOverview: ro } = stats;
  const total = Math.max(ro.dueToday + ro.dueThisWeek + ro.dueThisMonth + ro.notDue, 1);

  return (
    <section>
      <div className="page-head">
        <div><h1>Dashboard</h1><p>Welcome back, here's what's happening today.</p></div>
      </div>

      <div className="stat-grid">
        <StatCard icon="👥" iconBg="var(--blue-light)" iconColor="var(--blue)" value={stats.totalCustomers} label="Total Customers" sub={`+${stats.newThisMonth} this month`} />
        <StatCard icon="📅" iconBg="var(--green-bg)" iconColor="var(--green)" value={stats.upcomingServices} label="Upcoming Services" sub="Next 7 days" />
        <StatCard icon="₹" iconBg="var(--orange-bg)" iconColor="var(--orange)" value={money(stats.pendingPayments)} label="Pending Payments" sub={`${stats.pendingCount} Pending`} subColor="var(--orange)" />
        <StatCard icon="📈" iconBg="var(--purple-bg)" iconColor="var(--purple)" value={money(stats.totalEarningsThisMonth)} label="Total Earnings" sub="This Month" />
      </div>

      <div className="two-col">
        <div>
          <div className="panel">
            <div className="panel-head"><h3>Upcoming Services</h3><Link to="/services">View All</Link></div>
            {stats.upcomingCustomers.length === 0 ? (
              <EmptyState icon="📅" message="No upcoming services." />
            ) : (
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Next Due</th><th>Brand</th></tr></thead>
                <tbody>
                  {stats.upcomingCustomers.map((c) => (
                    <tr key={c._id}>
                      <td><div className="name-cell"><div className="mini-avatar">{initials(c.name)}</div>{c.name}</div></td>
                      <td>{c.phone}</td>
                      <td>{fmtDate(c.nextDueDate)}</td>
                      <td>{c.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div>
          <div className="panel">
            <div className="panel-head"><h3>Reminder Overview</h3></div>
            <div className="donut-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e9f0" strokeWidth="16" />
                {(() => {
                  const c = 2 * Math.PI * 45;
                  const segs = [
                    { v: ro.dueToday, color: "#ef4444" },
                    { v: ro.dueThisWeek, color: "#f59e0b" },
                    { v: ro.dueThisMonth, color: "#2563eb" },
                    { v: ro.notDue, color: "#16a34a" },
                  ];
                  let offset = 0;
                  return segs.map((s, i) => {
                    const len = (s.v / total) * c;
                    const el = (
                      <circle key={i} cx="60" cy="60" r="45" fill="none" stroke={s.color} strokeWidth="16"
                        strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
                        transform="rotate(-90 60 60)" />
                    );
                    offset += len;
                    return el;
                  });
                })()}
              </svg>
              <ul className="legend">
                <li><span className="dot" style={{ background: "#ef4444" }} />Due Today <span className="num">{ro.dueToday}</span></li>
                <li><span className="dot" style={{ background: "#f59e0b" }} />Due This Week <span className="num">{ro.dueThisWeek}</span></li>
                <li><span className="dot" style={{ background: "#2563eb" }} />Due This Month <span className="num">{ro.dueThisMonth}</span></li>
                <li><span className="dot" style={{ background: "#16a34a" }} />Not Due <span className="num">{ro.notDue}</span></li>
              </ul>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><h3>Quick Actions</h3></div>
            <div className="quick-actions">
              <Link to="/customers/add" className="btn btn-primary">+ Add Customer</Link>
              <Link to="/services/add" className="btn btn-green">+ Add Service</Link>
              <Link to="/reminders" className="btn btn-purple">📨 Send Reminder</Link>
              <Link to="/reports" className="btn btn-orange">📄 View Reports</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
