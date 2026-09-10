import api from "./api.js";

export const customerService = {
  getAll: (params) => api.get("/customers", { params }),
  getOne: (id) => api.get(`/customers/${id}`),
  create: (formData) =>
    api.post("/customers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/customers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/customers/${id}`),
  getReminders: (range) => api.get(`/customers/reminders/${range}`),
  sendSMS: (customerId) => api.post(`/customers/send-sms/${customerId}`),

  sendBulkSMS: (range) => api.post(`/customers/send-bulk-sms`, { range }),
};
