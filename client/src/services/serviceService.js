import api from "./api.js";

export const serviceService = {
  getAll: (params) => api.get("/services", { params }),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  remove: (id) => api.delete(`/services/${id}`),
};
