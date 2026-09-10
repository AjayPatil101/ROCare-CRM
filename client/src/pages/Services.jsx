import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { serviceService } from "../services/serviceService.js";
import { getErrorMessage } from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { fmtDate, money, initials } from "../utils/format.js";

const Services = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const [data, setData] = useState({ data: [], pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    serviceService
      .getAll({ page, limit: 8 })
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  return (
    <section>
      <div className="page-head">
        <div><h1>Services</h1><p>Track every service visit across customers.</p></div>
        <Link to="/services/add" className="btn btn-primary">+ Add Service</Link>
      </div>
      <div className="panel">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : data.data.length === 0 ? (
          <EmptyState icon="🛠️" message="No services logged yet." />
        ) : (
          <>
            <table>
              <thead><tr><th>Customer</th><th>Service Type</th><th>Date</th><th>Amount</th><th>Next Due</th></tr></thead>
              <tbody>
                {data.data.map((s) => (
                  <tr key={s._id}>
                    <td><div className="name-cell"><div className="mini-avatar">{initials(s.customer?.name || "")}</div>{s.customer?.name || "Unknown"}</div></td>
                    <td>{s.type}</td>
                    <td>{fmtDate(s.date)}</td>
                    <td>{money(s.amount)}</td>
                    <td>{fmtDate(s.nextDue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} pages={data.pages} onChange={(p) => setParams({ page: String(p) })} />
          </>
        )}
      </div>
    </section>
  );
};

export default Services;
