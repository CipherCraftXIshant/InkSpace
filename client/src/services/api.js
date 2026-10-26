/**
 * InkSpace API Client
 * Facilitates communication between the React frontend and the native Node.js backend.
 * Falls back gracefully if the backend is unreachable.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Checks backend server connectivity.
 * @returns {Promise<{ online: boolean, data?: any }>}
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000), // 3-second timeout
    });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, data };
  } catch {
    return { online: false };
  }
}

/**
 * Fetches published articles with search, category filtering, and pagination.
 *
 * @param {Object} options
 * @param {string} [options.search]
 * @param {string} [options.category]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=6]
 * @returns {Promise<{ success: boolean, data: Array<any>, pagination: any }>}
 */
export async function fetchPublishedPosts({ search = '', category = 'all', page = 1, limit = 6 } = {}) {
  const query = new URLSearchParams();
  if (search && search.trim()) query.set('search', search.trim());
  if (category && category !== 'all') query.set('category', category);
  if (page) query.set('page', String(page));
  if (limit) query.set('limit', String(limit));

  const res = await fetch(`${API_BASE_URL}/api/posts?${query.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch articles from backend`);
  }

  return await res.json();
}

/**
 * Fetches a single published post by slug from the backend.
 *
 * @param {string} slug
 * @returns {Promise<{ success: boolean, data: any }>}
 */
export async function fetchPostBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Article not found on server`);
  }

  return await res.json();
}

async function postAuthRequest(endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Authentication request failed.');
  }

  return result;
}

export function registerAccount({ fullName, email, password }) {
  return postAuthRequest('/api/auth/register', {
    fullName,
    email,
    password,
  });
}

export function loginAccount({ email, password }) {
  return postAuthRequest('/api/auth/login', {
    email,
    password,
  });
}
