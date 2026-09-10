import api from "./api.js";

export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),
  getEarningsReport: (days) => api.get("/dashboard/earnings-report", { params: { days } }),
};
