// API Service for Telegram Channel Finder

const API_BASE = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`;

export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const api = {
  // Public
  async getPublicSettings() {
    const res = await fetch(`${API_BASE}/settings/public`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/channels/categories`);
    return res.json();
  },

  async searchChannels(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.language && params.language !== 'all') query.set('language', params.language);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.sort) query.set('sort', params.sort);

    const res = await fetch(`${API_BASE}/channels/search?${query.toString()}`);
    return res.json();
  },

  async submitChannel(formData) {
    const res = await fetch(`${API_BASE}/channels/submit`, {
      method: 'POST',
      body: formData // multipart/form-data for logo upload
    });
    return res.json();
  },

  async getTop100Sponsored() {
    const res = await fetch(`${API_BASE}/sponsored/top100`);
    return res.json();
  },

  async getTop10Featured() {
    const res = await fetch(`${API_BASE}/sponsored/featured`);
    return res.json();
  },

  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  async checkAuth() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });
    return res.json();
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },

  // Admin Protected
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, { credentials: 'include' });
    return res.json();
  },

  async getPendingSubmissions(page = 1, limit = 10) {
    const res = await fetch(`${API_BASE}/admin/submissions/pending?page=${page}&limit=${limit}`, { credentials: 'include' });
    return res.json();
  },

  async approveSubmission(id) {
    const res = await fetch(`${API_BASE}/admin/submissions/${id}/approve`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  async rejectSubmission(id, reason) {
    const res = await fetch(`${API_BASE}/admin/submissions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  async getAllChannels(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/channels?${query}`, { credentials: 'include' });
    return res.json();
  },

  async updateChannel(id, formDataOrJson, isFormData = false) {
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    const body = isFormData ? formDataOrJson : JSON.stringify(formDataOrJson);

    const res = await fetch(`${API_BASE}/admin/channels/${id}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body
    });
    return res.json();
  },

  async deleteChannel(id) {
    const res = await fetch(`${API_BASE}/admin/channels/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return res.json();
  },

  async getSponsoredList() {
    const res = await fetch(`${API_BASE}/admin/sponsored`, { credentials: 'include' });
    return res.json();
  },

  async addSponsored(channelId, badgeText, notes) {
    const res = await fetch(`${API_BASE}/admin/sponsored`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ channel_id: channelId, badge_text: badgeText, notes })
    });
    return res.json();
  },

  async updateSponsored(id, displayOrder, badgeText, notes) {
    const res = await fetch(`${API_BASE}/admin/sponsored/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ display_order: displayOrder, badge_text: badgeText, notes })
    });
    return res.json();
  },

  async removeSponsored(id) {
    const res = await fetch(`${API_BASE}/admin/sponsored/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return res.json();
  },

  async reorderSponsored(orderedIds) {
    const res = await fetch(`${API_BASE}/admin/sponsored/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderedIds })
    });
    return res.json();
  },

  async getFeaturedList() {
    const res = await fetch(`${API_BASE}/admin/featured`, { credentials: 'include' });
    return res.json();
  },

  async setFeatured(sponsoredId) {
    const res = await fetch(`${API_BASE}/admin/featured/${sponsoredId}`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  async removeFeatured(sponsoredId) {
    const res = await fetch(`${API_BASE}/admin/featured/${sponsoredId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return res.json();
  },

  async reorderFeatured(orderedIds) {
    const res = await fetch(`${API_BASE}/admin/featured/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderedIds })
    });
    return res.json();
  },

  async getAdminSettings() {
    const res = await fetch(`${API_BASE}/admin/settings`, { credentials: 'include' });
    return res.json();
  },

  async updateAdminSettings(settings) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};

