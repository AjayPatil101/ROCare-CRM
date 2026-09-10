import { useEffect, useState } from "react";
import { contactService } from "../../services/contactService.js";
import { getErrorMessage } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { fmtDate } from "../../utils/format.js";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    contactService.getAll({ limit: 50 }).then((res) => setMessages(res.data.data)).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markResolved = async (m) => {
    await contactService.update(m._id, { status: "Resolved" });
    load();
  };

  const remove = async (m) => {
    if (!window.confirm("Delete this message?")) return;
    await contactService.remove(m._id);
    load();
  };

  return (
    <section>
      <div className="page-head"><div><h1>Contact Messages</h1><p>Manage submissions from the contact form.</p></div></div>
      <div className="panel">
        {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={load} /> : messages.length === 0 ? (
          <EmptyState icon="✉️" message="No messages yet." />
        ) : (
          messages.map((m) => (
            <div className="history-item" key={m._id} style={{ alignItems: "flex-start" }}>
              <div>
                <div className="t">{m.name} — {m.subject}</div>
                <div className="d">{m.email} · {fmtDate(m.createdAt)}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{m.message}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className={`pill ${m.status === "Resolved" ? "paid" : m.status === "Read" ? "week" : "due"}`}>{m.status}</span>
                <div className="row-actions">
                  {m.status !== "Resolved" && <button onClick={() => markResolved(m)} title="Mark resolved">✅</button>}
                  <button onClick={() => remove(m)} title="Delete">🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AdminMessages;
