import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerService } from "../services/customerService.js";
import { getErrorMessage } from "../services/api.js";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", installDate: "", phone: "", lastServiceDate: "",
    address: "", brand: "", notes: "",
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
      if (photo) formData.append("photo", photo);
      await customerService.create(formData);
      navigate("/customers");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-head"><div><h1>Add Customer</h1><p>Create a new customer record.</p></div></div>
      {error && <div className="error-banner">{error}</div>}
      <div className="panel" style={{ maxWidth: 820 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field"><label>Full Name</label><input required value={form.name} onChange={update("name")} placeholder="Enter full name" /></div>
            <div className="field"><label>Installation Date</label><input required type="date" value={form.installDate} onChange={update("installDate")} /></div>
            <div className="field"><label>Mobile Number</label><input required value={form.phone} onChange={update("phone")} placeholder="Enter mobile number" /></div>
            <div className="field"><label>Last Service Date</label><input type="date" value={form.lastServiceDate} onChange={update("lastServiceDate")} /></div>
            <div className="field full"><label>Address</label><input value={form.address} onChange={update("address")} placeholder="Enter address" /></div>
            <div className="field">
              <label>RO Brand / Model</label>
              <select value={form.brand} onChange={update("brand")}>
                <option value="">Select brand / model</option>
                <option>Kent Grand Plus</option><option>Aquaguard</option><option>Pureit</option><option>Livpure</option>
              </select>
            </div>
            <div className="field"><label>Notes (Optional)</label><input value={form.notes} onChange={update("notes")} placeholder="Enter notes" /></div>
            <div className="field"><label>Customer Photo (Optional)</label><input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/customers")}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Customer"}</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCustomer;
