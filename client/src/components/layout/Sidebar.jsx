import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/services", label: "Services", icon: "🛠️" },
  { to: "/reminders", label: "Reminders", icon: "🔔" },
  { to: "/payments", label: "Payments", icon: "💳" },
  { to: "/reports", label: "Reports", icon: "📊" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

const Sidebar = ({ open, onClose }) => (
  <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand">
      {/* <div className="brand-icon">💧</div> */}
      {/* <div className="brand-icon"><img src="https://compaqservices.com/wp-content/uploads/2026/02/cropped-Compaq-banner-logo-removebg-preview-300x117.png.webp" alt="" srcset="" /></div> */}
      
      <img src="logo.png" alt="" srcset="" height="50" width="50" />
      <div className="brand-text">
        <b>RO Service</b>
        <span>Management</span>
      </div>
    </div>
    <ul className="nav">
      {navItems.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <span className="ic">{item.icon}</span> {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
    <div className="help-card">
      <div className="ic">🎧</div>
      <div>
        <b>Need Help?</b>
        <span>Contact Support</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
