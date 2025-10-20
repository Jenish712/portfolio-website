// Optional API bridge: if REACT_APP_API_URL is set, Admin.jsx should use these
const API_URL = process.env.REACT_APP_API_URL;

export const api = {
  async login(id, key) {
    if (!API_URL) throw new Error('API not configured');
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, key }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { token }
  },
  async list(params = {}) {
    if (!API_URL) throw new Error('API not configured');
    const url = new URL('/projects', API_URL);
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async get(slug) {
    const res = await fetch(`${API_URL}/projects/${slug}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async create(body, token) {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async update(id, body, token) {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async reorder(id, body, token) {
    const res = await fetch(`${API_URL}/projects/${id}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async remove(id, token) {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
};
