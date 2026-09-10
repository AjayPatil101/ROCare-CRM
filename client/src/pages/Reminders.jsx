import { useEffect, useState } from "react";
import { customerService } from "../services/customerService.js";
import { getErrorMessage } from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { fmtDate, initials } from "../utils/format.js";

const tabs = [
  { key: "today", label: "Due Today" },
  { key: "week", label: "Due This Week" },
  { key: "month", label: "Due This Month" },
  { key: "all", label: "All" },
];

const daysUntil = (iso) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(iso);
  return Math.round((d - start) / 86400000);
};

const Reminders = () => {
  const [active, setActive] = useState("today");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const load = (range) => {
    setLoading(true);
    setError("");
    customerService
      .getReminders(range)
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };
  const handleCall = (phone) => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  const handleSMS = async (customer) => {
    try {
      const response = await customerService.sendSMS(customer._id);

      if (response.data.success) {
        alert(`SMS sent successfully to ${customer.name}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send SMS");
    }
  };
  const handleWhatsApp = (customer) => {
    if (!customer.phone) return;
    // Remove spaces, +, -, brackets, etc.
    let phone = customer.phone.replace(/\D/g, "");
    // If your customer numbers are Indian numbers without country code
    if (phone.length === 10) {
      phone = `91${phone}`;
    }
    const message = `Hello ${customer.name}, this is a reminder from Compaq RO Services. Your RO water purifier service is due on ${fmtDate(customer.nextDueDate)}. Please let us know a convenient time for the service. Thank you!`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  useEffect(() => load(active), [active]);

  // const sendAll = async () => {
  //   setSending(true);
  //   // In production this would call a bulk-notify endpoint; simulated here.
  //   await new Promise((r) => setTimeout(r, 600));
  //   setSending(false);
  //   alert("Reminders sent to all customers due in this range ✅");
  // };
  const sendAll = async () => {
    try {
      setSending(true);

      const response = await customerService.sendBulkSMS(active);

      if (response.data.success) {
        alert("SMS reminders sent successfully ✅");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send reminders");
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Reminders</h1>
          <p>Follow up with customers due for service.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={sendAll}
          disabled={sending}
        >
          {sending ? "Sending..." : "📨 Send Reminder to All"}
        </button>
      </div>
      <div className="panel">
        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab ${active === t.key ? "active" : ""}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => load(active)} />
        ) : items.length === 0 ? (
          <EmptyState icon="🔔" message="No reminders in this range." />
        ) : (
          items.map((c) => {
            const diff = daysUntil(c.nextDueDate);
            const label =
              diff <= 0 ? (
                <span className="pill due">
                  {diff === 0 ? "Today" : "Overdue"}
                </span>
              ) : (
                <span className="pill week">{fmtDate(c.nextDueDate)}</span>
              );
            return (
              <div className="history-item" key={c._id}>
                <div className="name-cell">
                  <div className="mini-avatar">{initials(c.name)}</div>
                  <div>
                    <div className="t">{c.name}</div>
                    <div className="d">{c.phone}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {label}
                  <div className="row-actions">
                    {/* <button title="Call">📞</button>
                    <button className="wa" title="WhatsApp">💬</button> */}
                    {/* <div className="row-actions">
                      <button
                        type="button"
                        title={`Call ${c.name}`}
                        onClick={() => handleCall(c.phone)}
                      >
                        📞
                      </button>

                      <button
                        type="button"
                        className="wa"
                        title={`WhatsApp ${c.name}`}
                        onClick={() => handleWhatsApp(c)}
                      >
                        💬
                      </button>
                    </div> */}
                    <div className="row-actions">
                      <button
                        type="button"
                        title={`Call ${c.name}`}
                        onClick={() => handleCall(c.phone)}
                      >
                        📞
                      </button>

                      <button
                        type="button"
                        className="wa"
                        title={`WhatsApp ${c.name}`}
                        onClick={() => handleWhatsApp(c)}
                      >
                        💬
                      </button>

                      <button
                        type="button"
                        className="sms"
                        title={`Send SMS to ${c.name}`}
                        onClick={() => handleSMS(c)}
                      >
                        📩
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Reminders;
