// API Service for Telegram Channel Finder

const API_BASE = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`;

export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

async function safeFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        success: false,
        message: text?.trim() || `Server returned error (${res.status})`
      };
    }
    if (!res.ok && data && data.success === undefined) {
      data.success = false;
    }
    return data;
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Network request failed'
    };
  }
}

export const api = {
  // Public
  async getPublicSettings() {
    return safeFetchJson(`${API_BASE}/settings/public`);
  },

  async getCategories() {
    return safeFetchJson(`${API_BASE}/channels/categories`);
  },

  async searchChannels(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.language && params.language !== 'all') query.set('language', params.language);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.sort) query.set('sort', params.sort);

    return safeFetchJson(`${API_BASE}/channels/search?${query.toString()}`);
  },

  async submitChannel(formData) {
    return safeFetchJson(`${API_BASE}/channels/submit`, {
      method: 'POST',
      body: formData // multipart/form-data for logo upload
    });
  },

  async getTop100Sponsored() {
    return safeFetchJson(`${API_BASE}/sponsored/top100`);
  },

  async getTop10Featured() {
    return safeFetchJson(`${API_BASE}/sponsored/featured`);
  },

  // Auth
  async login(username, password) {
    return safeFetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
  },

  async logout() {
    return safeFetchJson(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  async checkAuth() {
    return safeFetchJson(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });
  },

  async changePassword(currentPassword, newPassword) {
    return safeFetchJson(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Admin Protected
  async getDashboardStats() {
    return safeFetchJson(`${API_BASE}/admin/stats`, { credentials: 'include' });
  },

  async getPendingSubmissions(page = 1, limit = 10) {
    return safeFetchJson(`${API_BASE}/admin/submissions/pending?page=${page}&limit=${limit}`, { credentials: 'include' });
  },

  async approveSubmission(id) {
    return safeFetchJson(`${API_BASE}/admin/submissions/${id}/approve`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  async rejectSubmission(id, reason) {
    return safeFetchJson(`${API_BASE}/admin/submissions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reason })
    });
  },

  async getAllChannels(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/admin/channels?${query}`, { credentials: 'include' });
  },

  async updateChannel(id, formDataOrJson, isFormData = false) {
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    const body = isFormData ? formDataOrJson : JSON.stringify(formDataOrJson);

    return safeFetchJson(`${API_BASE}/admin/channels/${id}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body
    });
  },

  async deleteChannel(id) {
    return safeFetchJson(`${API_BASE}/admin/channels/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  },

  async getSponsoredList() {
    return safeFetchJson(`${API_BASE}/admin/sponsored`, { credentials: 'include' });
  },

  async addSponsored(channelId, badgeText, notes) {
    return safeFetchJson(`${API_BASE}/admin/sponsored`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ channel_id: channelId, badge_text: badgeText, notes })
    });
  },

  async updateSponsored(id, displayOrder, badgeText, notes) {
    return safeFetchJson(`${API_BASE}/admin/sponsored/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ display_order: displayOrder, badge_text: badgeText, notes })
    });
  },

  async removeSponsored(id) {
    return safeFetchJson(`${API_BASE}/admin/sponsored/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  },

  async reorderSponsored(orderedIds) {
    return safeFetchJson(`${API_BASE}/admin/sponsored/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderedIds })
    });
  },

  async getFeaturedList() {
    return safeFetchJson(`${API_BASE}/admin/featured`, { credentials: 'include' });
  },

  async setFeatured(sponsoredId) {
    return safeFetchJson(`${API_BASE}/admin/featured/${sponsoredId}`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  async removeFeatured(sponsoredId) {
    return safeFetchJson(`${API_BASE}/admin/featured/${sponsoredId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  },

  async reorderFeatured(orderedIds) {
    return safeFetchJson(`${API_BASE}/admin/featured/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderedIds })
    });
  },

  async getAdminSettings() {
    return safeFetchJson(`${API_BASE}/admin/settings`, { credentials: 'include' });
  },

  async updateAdminSettings(settings) {
    return safeFetchJson(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settings)
    });
  }
};
