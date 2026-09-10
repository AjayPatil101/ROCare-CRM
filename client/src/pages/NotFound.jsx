import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="empty" style={{ padding: "80px 20px" }}>
    <div className="ic">🧭</div>
    <h2>404 — Page not found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>Go to Dashboard</Link>
  </div>
);

export default NotFound;
