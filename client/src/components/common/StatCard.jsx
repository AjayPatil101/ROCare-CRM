/** One dashboard KPI tile: icon, big number, label, and a small sub-line. */
const StatCard = ({ icon, iconBg, iconColor, value, label, sub, subColor }) => (
  <div className="card stat-card">
    <div className="stat-ic" style={{ background: iconBg, color: iconColor }}>
      {icon}
    </div>
    <div>
      <b>{value}</b>
      <span className="label">{label}</span>
      {sub && (
        <div className="sub" style={subColor ? { color: subColor } : undefined}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
