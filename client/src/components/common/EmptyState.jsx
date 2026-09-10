const EmptyState = ({ icon = "🔍", message = "Nothing found here yet." }) => (
  <div className="empty">
    <div className="ic">{icon}</div>
    {message}
  </div>
);

export default EmptyState;
