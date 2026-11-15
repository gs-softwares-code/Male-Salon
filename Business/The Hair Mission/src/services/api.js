const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('vanguard_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },
  getServices: async (category = 'all') => {
    const res = await fetch(`${API_BASE}/services?category=${category}`);
    return res.json();
  },
  getBarbers: async () => {
    const res = await fetch(`${API_BASE}/barbers`);
    return res.json();
  },
  getGallery: async (category = 'all') => {
    const res = await fetch(`${API_BASE}/gallery?category=${category}`);
    return res.json();
  },
  getTransformations: async () => {
    const res = await fetch(`${API_BASE}/transformations`);
    return res.json();
  },
  getPackages: async () => {
    const res = await fetch(`${API_BASE}/packages`);
    return res.json();
  },
  getReviews: async () => {
    const res = await fetch(`${API_BASE}/reviews`);
    return res.json();
  },
  getOffers: async () => {
    const res = await fetch(`${API_BASE}/offers`);
    return res.json();
  },
  getAvailableSlots: async (barberId, date) => {
    const res = await fetch(`${API_BASE}/booking/slots?barberId=${barberId || 'any'}&date=${date}`);
    return res.json();
  },
  trackAppointment: async (code) => {
    const res = await fetch(`${API_BASE}/appointments/track/${code}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to track appointment');
    }
    return res.json();
  },
  createAppointment: async (bookingData) => {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create appointment');
    }
    return data;
  },

  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  // Admin
  getAdminAppointments: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/admin/appointments?${query}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },
  updateAppointment: async (id, updates) => {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    return res.json();
  },
  deleteAppointment: async (id) => {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Admin Services
  getAllServicesAdmin: async () => {
    const res = await fetch(`${API_BASE}/services?includeInactive=true`);
    return res.json();
  },
  createService: async (service) => {
    const res = await fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },
  updateService: async (id, updates) => {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },
  deleteService: async (id) => {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Admin Barbers
  createBarber: async (barber) => {
    const res = await fetch(`${API_BASE}/admin/barbers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(barber)
    });
    if (!res.ok) throw new Error('Failed to create barber');
    return res.json();
  },
  updateBarber: async (id, updates) => {
    const res = await fetch(`${API_BASE}/admin/barbers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update barber');
    return res.json();
  },
  deleteBarber: async (id) => {
    const res = await fetch(`${API_BASE}/admin/barbers/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Admin Gallery
  createGalleryItem: async (item) => {
    const res = await fetch(`${API_BASE}/admin/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item)
    });
    return res.json();
  },
  deleteGalleryItem: async (id) => {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Admin Customers & Analytics & Settings
  getCustomers: async () => {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },
  createOffer: async (offer) => {
    const res = await fetch(`${API_BASE}/admin/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(offer)
    });
    return res.json();
  },
  deleteOffer: async (id) => {
    const res = await fetch(`${API_BASE}/admin/offers/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },
  updateSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};

