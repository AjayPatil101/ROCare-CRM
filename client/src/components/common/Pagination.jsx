/** Numbered pagination control; keeps behavior identical to the original app. */
const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} className={n === page ? "active" : ""} onClick={() => onChange(n)}>
          {n}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
