import { useEffect, useState } from "react";
import { paymentService } from "../services/paymentService.js";
import { getErrorMessage } from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { fmtDate, money, initials } from "../utils/format.js";

const tabs = [
  { key: "all", label: "All" },
  { key: "Paid", label: "Paid" },
  { key: "Pending", label: "Pending" },
];

const Payments = () => {
  const [active, setActive] = useState("all");
  const [data, setData] = useState({ data: [], pendingTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    paymentService
      .getAll(active === "all" ? {} : { status: active })
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [active]);

  const markPaid = async (id) => {
    try {
      await paymentService.update(id, { status: "Paid" });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section>
      <div className="page-head">
        <div><h1>Payments</h1><p>Track paid and pending payments.</p></div>
      </div>
      <div className="panel">
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t.key} className={`tab ${active === t.key ? "active" : ""}`} onClick={() => setActive(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : data.data.length === 0 ? (
          <EmptyState icon="💳" message="No payments found." />
        ) : (
          <table>
            <thead><tr><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {data.data.map((p) => (
                <tr key={p._id}>
                  <td><div className="name-cell"><div className="mini-avatar">{initials(p.customer?.name || "")}</div>{p.customer?.name || "Unknown"}</div></td>
                  <td>{fmtDate(p.date)}</td>
                  <td>{money(p.amount)}</td>
                  <td>
                    <span className={`pill ${p.status === "Paid" ? "paid" : "pending"}`} style={{ cursor: p.status === "Pending" ? "pointer" : "default" }}
                      onClick={() => p.status === "Pending" && markPaid(p._id)} title={p.status === "Pending" ? "Click to mark as paid" : ""}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ textAlign: "right", marginTop: 14, fontSize: 13.5 }}>
          Total Pending Amount: <b style={{ color: "var(--orange)" }}>{money(data.pendingTotal)}</b>
        </div>
      </div>
    </section>
  );
};

export default Payments;
