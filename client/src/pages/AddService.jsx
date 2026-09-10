import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { serviceService } from "../services/serviceService.js";
import { customerService } from "../services/customerService.js";
import { getErrorMessage } from "../services/api.js";

const filterOptions = ["Sediment Filter", "Pre Carbon Filter", "RO Membrane", "Post Carbon Filter", "UV Filter", "Other"];

const AddService = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer: params.get("customer") || "",
    type: "", date: "", amount: "", notes: "",
  });
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    customerService.getAll({ limit: 100 }).then((res) => setCustomers(res.data.data)).catch(() => {});
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleFilter = (val) => {
    setFilters((prev) => (prev.includes(val) ? prev.filter((f) => f !== val) : [...prev, val]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await serviceService.create({ ...form, filtersChanged: filters, amount: Number(form.amount) || 0 });
      navigate("/services");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-head"><div><h1>Add Service</h1><p>Log a new service visit.</p></div></div>
      {error && <div className="error-banner">{error}</div>}
      <div className="panel" style={{ maxWidth: 820 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Customer</label>
              <select required value={form.customer} onChange={update("customer")}>
                <option value="">Select Customer</option>
                {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Service Type</label>
              <select required value={form.type} onChange={update("type")}>
                <option value="">Select Service Type</option>
                <option>General Service</option><option>Filter Change</option><option>RO Membrane</option><option>Installation</option>
              </select>
            </div>
            <div className="field"><label>Service Date</label><input required type="date" value={form.date} onChange={update("date")} /></div>
            <div className="field"><label>Amount (₹)</label><input type="number" value={form.amount} onChange={update("amount")} placeholder="Enter amount" /></div>
            <div className="field full">
              <label>Filters Changed</label>
              <div className="checks">
                {filterOptions.map((f) => (
                  <label className="check" key={f}>
                    <input type="checkbox" checked={filters.includes(f)} onChange={() => toggleFilter(f)} /> {f}
                  </label>
                ))}
              </div>
            </div>
            <div className="field full"><label>Work Details / Notes</label><textarea value={form.notes} onChange={update("notes")} placeholder="Enter work details..." /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/services")}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Service"}</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddService;
