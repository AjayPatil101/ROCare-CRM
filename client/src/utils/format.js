/** Shared formatting helpers, ported from the original vanilla-JS app. */
export const fmtDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const toInputDate = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

export const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
