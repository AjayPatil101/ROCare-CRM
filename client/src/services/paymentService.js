import api from "./api.js";

export const paymentService = {
  getAll: (params) => api.get("/payments", { params }),
  create: (data) => api.post("/payments", data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  remove: (id) => api.delete(`/payments/${id}`),
};
