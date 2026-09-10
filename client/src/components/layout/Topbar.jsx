import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const Topbar = ({ onHamburger }) => {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/customers?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="topbar">
      <button className="hamburger" onClick={onHamburger}>☰</button>
      <form className="search-box" onSubmit={submitSearch}>
        <span>🔍</span>
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className="top-actions">
        <button className="icon-btn">🔔<span className="badge">?</span></button>
        {/* <button className="icon-btn">💬</button> */}
        <div className="profile" onClick={() => setMenuOpen((o) => !o)} style={{ cursor: "pointer", position: "relative" }}>
          <div className="avatar">{initials(user?.name)}</div>
          <div>
            <b>{user?.name}</b>
            <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
          </div>
          {menuOpen && (
            <div className="profile-menu">
              <button onClick={() => navigate("/settings")}>Settings</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
