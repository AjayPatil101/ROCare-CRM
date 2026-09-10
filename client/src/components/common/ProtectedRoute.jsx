import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Loader from "./Loader.jsx";

/**
 * Guards nested routes behind authentication (and optionally a role).
 * Usage: <Route element={<ProtectedRoute roles={["admin"]} />}>...</Route>
 */
const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
