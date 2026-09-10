import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/services", label: "Services", icon: "🛠️" },
  { to: "/reminders", label: "Reminders", icon: "🔔" },
  { to: "/settings", label: "More", icon: "⋯" },
];

const MobileNav = () => (
  <nav className="mobile-nav">
    {items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <span className="ic">{item.icon}</span>
        {item.label}
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;
