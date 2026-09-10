import api from "./api.js";

export const contactService = {
  submit: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  update: (id, data) => api.put(`/contact/${id}`, data),
  remove: (id) => api.delete(`/contact/${id}`),
};
