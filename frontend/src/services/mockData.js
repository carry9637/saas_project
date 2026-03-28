// Mock data — sync, no async delay needed for frontend-only mode

// ── Clients ──
let clients = [
  {
    id: 1,
    name: "Acme Corp",
    email: "contact@acme.com",
    company: "Acme Corp",
    plan: "Enterprise",
    status: "Active",
  },
  {
    id: 2,
    name: "Globex Inc",
    email: "info@globex.com",
    company: "Globex Inc",
    plan: "Pro",
    status: "Active",
  },
  {
    id: 3,
    name: "Soylent Corp",
    email: "hello@soylent.com",
    company: "Soylent Corp",
    plan: "Starter",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Initech",
    email: "admin@initech.com",
    company: "Initech",
    plan: "Pro",
    status: "Active",
  },
  {
    id: 5,
    name: "Umbrella LLC",
    email: "info@umbrella.com",
    company: "Umbrella LLC",
    plan: "Enterprise",
    status: "Active",
  },
  {
    id: 6,
    name: "Wayne Enterprises",
    email: "bruce@wayne.com",
    company: "Wayne Enterprises",
    plan: "Enterprise",
    status: "Active",
  },
  {
    id: 7,
    name: "Stark Industries",
    email: "tony@stark.com",
    company: "Stark Industries",
    plan: "Pro",
    status: "Inactive",
  },
];

// ── Services ──
let services = [
  {
    id: 1,
    name: "Cloud Hosting",
    description: "Scalable cloud infrastructure with 99.9% uptime guarantee",
    price: 299,
    status: "Active",
  },
  {
    id: 2,
    name: "Email Marketing",
    description: "Automated email campaigns with analytics dashboard",
    price: 149,
    status: "Active",
  },
  {
    id: 3,
    name: "CRM Platform",
    description: "Complete customer relationship management solution",
    price: 499,
    status: "Active",
  },
  {
    id: 4,
    name: "Analytics Suite",
    description: "Real-time business intelligence and reporting tools",
    price: 199,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Security Audit",
    description: "Comprehensive security assessment and penetration testing",
    price: 999,
    status: "Active",
  },
  {
    id: 6,
    name: "API Gateway",
    description: "High-performance API management and rate limiting",
    price: 349,
    status: "Active",
  },
];

// ── Subscriptions ──
let subscriptions = [
  {
    id: 1,
    clientName: "Acme Corp",
    plan: "Enterprise",
    startDate: "2025-01-15",
    expiryDate: "2026-01-15",
  },
  {
    id: 2,
    clientName: "Globex Inc",
    plan: "Pro",
    startDate: "2025-03-01",
    expiryDate: "2026-03-01",
  },
  {
    id: 3,
    clientName: "Soylent Corp",
    plan: "Starter",
    startDate: "2025-06-10",
    expiryDate: "2025-12-10",
  },
  {
    id: 4,
    clientName: "Initech",
    plan: "Pro",
    startDate: "2025-02-20",
    expiryDate: "2026-02-20",
  },
  {
    id: 5,
    clientName: "Umbrella LLC",
    plan: "Enterprise",
    startDate: "2025-04-01",
    expiryDate: "2026-04-01",
  },
  {
    id: 6,
    clientName: "Wayne Enterprises",
    plan: "Enterprise",
    startDate: "2025-05-15",
    expiryDate: "2026-05-15",
  },
];

// ── Tickets ──
let tickets = [
  {
    id: 1,
    title: "Cannot access dashboard",
    client: "Acme Corp",
    status: "Open",
    createdAt: "2026-03-20",
  },
  {
    id: 2,
    title: "Billing discrepancy",
    client: "Globex Inc",
    status: "In Progress",
    createdAt: "2026-03-18",
  },
  {
    id: 3,
    title: "Feature request: Export CSV",
    client: "Initech",
    status: "Open",
    createdAt: "2026-03-22",
  },
  {
    id: 4,
    title: "SSL certificate expired",
    client: "Umbrella LLC",
    status: "Resolved",
    createdAt: "2026-03-15",
  },
  {
    id: 5,
    title: "API rate limit issue",
    client: "Wayne Enterprises",
    status: "In Progress",
    createdAt: "2026-03-24",
  },
  {
    id: 6,
    title: "Login page not loading",
    client: "Stark Industries",
    status: "Open",
    createdAt: "2026-03-25",
  },
];

let nextId = 100;

// ── Client service ──
export const clientService = {
  getAll: () => [...clients],
  create: (data) => {
    const c = { ...data, id: ++nextId };
    clients.push(c);
    return c;
  },
  update: (id, data) => {
    clients = clients.map((c) =>
      c.id === id || c.id === Number(id) ? { ...c, ...data } : c,
    );
  },
  delete: (id) => {
    clients = clients.filter((c) => c.id !== id && c.id !== Number(id));
  },
};

// ── Service service ──
export const serviceService = {
  getAll: () => [...services],
  create: (data) => {
    const s = { ...data, id: ++nextId };
    services.push(s);
    return s;
  },
  update: (id, data) => {
    services = services.map((s) =>
      s.id === id || s.id === Number(id) ? { ...s, ...data } : s,
    );
  },
  delete: (id) => {
    services = services.filter((s) => s.id !== id && s.id !== Number(id));
  },
};

// ── Subscription service ──
export const subscriptionService = {
  getAll: () => [...subscriptions],
  create: (data) => {
    const s = { ...data, id: ++nextId };
    subscriptions.push(s);
    return s;
  },
  update: (id, data) => {
    subscriptions = subscriptions.map((s) =>
      s.id === id || s.id === Number(id) ? { ...s, ...data } : s,
    );
  },
  delete: (id) => {
    subscriptions = subscriptions.filter(
      (s) => s.id !== id && s.id !== Number(id),
    );
  },
};

// ── Ticket service ──
export const ticketService = {
  getAll: () => [...tickets],
  create: (data) => {
    const t = {
      ...data,
      id: ++nextId,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    tickets.push(t);
    return t;
  },
  update: (id, data) => {
    tickets = tickets.map((t) =>
      t.id === id || t.id === Number(id) ? { ...t, ...data } : t,
    );
  },
  delete: (id) => {
    tickets = tickets.filter((t) => t.id !== id && t.id !== Number(id));
  },
};

// ── Dashboard service ──
export const dashboardService = {
  getStats: () => ({
    totalClients: clients.length,
    activeSubscriptions: subscriptions.length,
    revenue: 28450,
    openTickets: tickets.filter((t) => t.status === "Open").length,
    revenueGrowth: 12.5,
    clientGrowth: 8.2,
    ticketResolution: 94,
  }),
};
