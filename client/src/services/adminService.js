import api from "./api.js";

export const adminService = {
  getOverview: () => api.get("/admin/overview"),
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
