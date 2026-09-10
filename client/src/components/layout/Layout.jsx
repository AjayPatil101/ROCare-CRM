import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import MobileNav from "./MobileNav.jsx";

/** Shared shell (sidebar + topbar + mobile nav) wrapping every private page. */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="overlay show" onClick={() => setSidebarOpen(false)} />}
      <div className="main">
        <Topbar onHamburger={() => setSidebarOpen(true)} />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Layout;
