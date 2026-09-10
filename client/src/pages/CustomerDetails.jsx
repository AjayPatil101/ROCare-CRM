import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { customerService } from "../services/customerService.js";
import { getErrorMessage } from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { fmtDate, money, initials } from "../utils/format.js";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    customerService
      .getOne(id)
      .then((res) => setPayload(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleDelete = async () => {
    try {
      await customerService.remove(id);
      navigate("/customers");
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirmOpen(false);
    }
  };

  if (loading) return <Loader label="Loading customer..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!payload) return null;

  const { customer: c, services, summary } = payload;

  return (
    <section>
      <div className="page-head">
        <div><h1>Customer Details</h1><p>Full profile, service and payment history.</p></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/customers")}>← Back to Customers</button>
          <button className="btn" style={{ background: "var(--red)", color: "#fff" }} onClick={() => setConfirmOpen(true)}>
            Delete
          </button>
        </div>
      </div>
      <div className="two-col">
        <div>
          <div className="panel">
            <div className="profile-card">
              <div className="profile-avatar">{initials(c.name)}</div>
              <div>
                <h3 style={{ margin: "0 0 4px" }}>{c.name}</h3>
                <div style={{ color: "var(--sub)", fontSize: 13 }}>{c.phone}</div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="kv"><span>Address</span><span>{c.address || "-"}</span></div>
              <div className="kv"><span>RO Brand / Model</span><span>{c.brand}</span></div>
              <div className="kv"><span>Installation Date</span><span>{fmtDate(c.installDate)}</span></div>
              <div className="kv"><span>Last Service Date</span><span>{fmtDate(c.lastServiceDate)}</span></div>
              <div className="kv"><span>Next Service Due</span><span style={{ color: "var(--orange)" }}>{fmtDate(c.nextDueDate)}</span></div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><h3>Payment History</h3></div>
            <div className="stat-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 0 }}>
              <div><div style={{ fontSize: 12, color: "var(--sub)" }}>Total Paid</div><b>{money(summary.totalPaid)}</b></div>
              <div><div style={{ fontSize: 12, color: "var(--sub)" }}>Total Due</div><b>{money(summary.totalDue)}</b></div>
              <div><div style={{ fontSize: 12, color: "var(--sub)" }}>Total Services</div><b>{summary.totalServices}</b></div>
            </div>
          </div>
        </div>
        <div>
          <div className="panel">
            <div className="panel-head">
              <h3>Service History</h3>
              <Link to={`/services/add?customer=${c._id}`} className="btn btn-primary" style={{ padding: "7px 12px", fontSize: 12 }}>+ Add Service</Link>
            </div>
            {services.length === 0 ? (
              <EmptyState icon="🛠️" message="No service history yet." />
            ) : (
              services.map((s) => (
                <div className="history-item" key={s._id}>
                  <div><div className="t">{s.type}</div><div className="d">{fmtDate(s.date)}</div></div>
                  <div className="amt">{money(s.amount)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        message={`Delete ${c.name}? This will also remove their service and payment history.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default CustomerDetails;
