import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { customerService } from "../services/customerService.js";
import { getErrorMessage } from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { useDebounce } from "../hooks/useDebounce.js";
import { fmtDate, initials } from "../utils/format.js";

const Customers = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const debouncedSearch = useDebounce(search, 400);
  const page = Number(params.get("page")) || 1;

  const [data, setData] = useState({ data: [], pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError("");
    customerService
      .getAll({ search: debouncedSearch, page, limit: 6 })
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [debouncedSearch, page]);

  const onSearchChange = (val) => {
    setSearch(val);
    setParams({ search: val, page: "1" });
  };

  return (
    <section>
      <div className="page-head">
        <div><h1>Customers</h1><p>Manage all your RO service customers.</p></div>
        <Link to="/customers/add" className="btn btn-primary">+ Add Customer</Link>
      </div>
      <div className="panel">
        <div className="search-mini" style={{ marginBottom: 14 }}>
          <span>🔍</span>
          <input placeholder="Search customers..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : data.data.length === 0 ? (
          <EmptyState icon="🔍" message="No customers found." />
        ) : (
          <>
            <table>
              <thead><tr><th>Name</th><th>Phone</th><th>Address</th><th>RO Brand</th><th>Last Service</th></tr></thead>
              <tbody>
                {data.data.map((c) => (
                  <tr key={c._id} onClick={() => navigate(`/customers/${c._id}`)}>
                    <td><div className="name-cell"><div className="mini-avatar">{initials(c.name)}</div>{c.name}</div></td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                    <td>{c.brand}</td>
                    <td>{fmtDate(c.lastServiceDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} pages={data.pages} onChange={(p) => setParams({ search, page: String(p) })} />
          </>
        )}
      </div>
    </section>
  );
};

export default Customers;
