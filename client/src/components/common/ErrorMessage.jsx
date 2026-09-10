/** Inline error banner with an optional retry action. */
const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-banner">
    <span className="ic">⚠️</span>
    <span>{message || "Something went wrong."}</span>
    {onRetry && (
      <button className="btn btn-ghost" style={{ marginLeft: "auto", padding: "6px 12px" }} onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
