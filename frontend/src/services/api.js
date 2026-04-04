import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getProfile = () => API.get("/auth/profile");

// ── Clients ──
export const fetchClients = () => API.get("/clients");
export const createClient = (data) => API.post("/clients", data);
export const updateClient = (id, data) => API.put(`/clients/${id}`, data);
export const deleteClient = (id) => API.delete(`/clients/${id}`);

// ── Services ──
export const fetchServices = () => API.get("/services");
export const createService = (data) => API.post("/services", data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

// ── Tickets ──
export const fetchTickets = () => API.get("/tickets");
export const createTicket = (data) => API.post("/tickets", data);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);

export default API;
