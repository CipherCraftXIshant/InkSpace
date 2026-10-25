const BOOKMARKS_KEY = 'inkspace_bookmarks';
const LIKES_KEY = 'inkspace_likes';
const COMMENTS_KEY = 'inkspace_comments';

export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : ['art-1', 'art-2']; // initial sample bookmarks
  } catch {
    return ['art-1', 'art-2'];
  }
};

export const toggleBookmark = (articleId) => {
  try {
    const current = getBookmarks();
    const exists = current.includes(articleId);
    const updated = exists
      ? current.filter((id) => id !== articleId)
      : [...current, articleId];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return { bookmarked: !exists, bookmarks: updated };
  } catch {
    return { bookmarked: false, bookmarks: [] };
  }
};

export const isBookmarked = (articleId) => {
  return getBookmarks().includes(articleId);
};

export const getLikes = () => {
  try {
    const data = localStorage.getItem(LIKES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const toggleLike = (articleId, baseLikes = 0) => {
  try {
    const current = getLikes();
    const isLiked = Boolean(current[articleId]);
    const updated = { ...current };

    if (isLiked) {
      delete updated[articleId];
    } else {
      updated[articleId] = true;
    }

    localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    const newCount = baseLikes + (isLiked ? 0 : 1);
    return { liked: !isLiked, count: newCount };
  } catch {
    return { liked: false, count: baseLikes };
  }
};

export const isLiked = (articleId) => {
  const current = getLikes();
  return Boolean(current[articleId]);
};

export const getArticleComments = (slug, initialComments = []) => {
  try {
    const all = localStorage.getItem(COMMENTS_KEY);
    const parsed = all ? JSON.parse(all) : {};
    return parsed[slug] || initialComments;
  } catch {
    return initialComments;
  }
};

export const addArticleComment = (slug, comment) => {
  try {
    const all = localStorage.getItem(COMMENTS_KEY);
    const parsed = all ? JSON.parse(all) : {};
    const existing = parsed[slug] || [];
    const updated = [comment, ...existing];
    parsed[slug] = updated;
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(parsed));
    return updated;
  } catch {
    return [comment];
  }
};

// ==========================================
// Safe Mock Authentication State (Frontend Only)
// Strictly stores safe profile metadata; NO passwords stored.
// ==========================================
const MOCK_USER_KEY = 'inkspace_mock_auth_user';

export const getMockAuthUser = () => {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setMockAuthUser = ({ name, email, role = 'author', avatar } = {}) => {
  try {
    const safeUser = {
      name: name || 'Alex Morgan',
      email: email || 'alex@inkspace.dev',
      role,
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      loginTimestamp: new Date().toISOString(),
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  } catch {
    return null;
  }
};

export const clearMockAuthUser = () => {
  try {
    localStorage.removeItem(MOCK_USER_KEY);
  } catch {
    // ignore
  }
};

export const isMockAuthenticated = () => {
  return Boolean(getMockAuthUser());
};
