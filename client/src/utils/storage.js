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

export const removeBookmark = (articleId) => {
  try {
    const current = getBookmarks();
    const updated = current.filter((id) => id !== articleId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
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

// ==========================================
// Author Posts Management (Phase 4)
// Stores author stories, drafts, and scheduled posts in localStorage
// ==========================================
const AUTHOR_POSTS_KEY = 'inkspace_author_posts';

const INITIAL_AUTHOR_POSTS = [
  {
    id: 'post-1',
    title: 'The Future of Minimalist Web Design',
    slug: 'the-future-of-minimalist-web-design',
    excerpt:
      'Why modern digital products are shedding heavy decoration in favor of deliberate typography, negative space, and quiet utility.',
    content: `## The Evolution of Calm Digital Spaces\n\nIn an internet dominated by aggressive algorithmic feeds, animated popups, and sensory overload, a quiet counter-revolution has taken root: **editorial minimalism**.\n\nMinimalism in interface design is rarely about absence; rather, it is about intentional presence. Every line of whitespace is an active decision. Every font pairing is a deliberate editorial statement.\n\n> "Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects."\n\n### Key Principles for Modern Interfaces\n\n- **Typography as Structure**: Use typography to define layout, hierarchy, and mood without gratuitous divider lines.\n- **Content First**: Interfaces should withdraw into the background, allowing the text and photography to take center stage.\n- **Deliberate Restraint**: Avoid decorative widgets that serve no purpose to the reader.\n\nWhen we build calmly, readers reward us with their deepest attention.`,
    category: 'Design',
    categorySlug: 'design',
    coverImage:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design Systems', 'Typography', 'Minimalism', 'Web Design'],
    status: 'Published',
    views: 4200,
    likes: 320,
    readingTime: '6 min read',
    publishedAt: 'May 12, 2024',
    updatedAt: 'May 12, 2024',
  },
  {
    id: 'post-2',
    title: 'Architecting Resilient Distributed Systems',
    slug: 'architecting-resilient-distributed-systems',
    excerpt:
      'Practical architectural patterns for surviving network partitions, cascading failures, and downstream dependency outages.',
    content: `## Principles of High-Resilience Systems\n\nDistributed systems fail in unexpected, non-deterministic ways. Building systems that gracefully degrade requires designing for failure from day one.\n\n### 1. Circuit Breakers and Bulkheads\n\nNever allow a slow downstream microservice to saturate your thread pools. Wrap external network I/O in resilient circuit breakers.\n\n\`\`\`javascript\n// Circuit breaker pattern illustration\nconst breaker = new CircuitBreaker(fetchUserData, {\n  timeout: 3000,\n  errorThresholdPercentage: 50,\n  resetTimeout: 30000,\n});\n\`\`\`\n\n### 2. Idempotency Keys\n\nEvery mutating POST/PUT request must accept a client-generated UUID idempotency key to prevent double-charging or duplicate entries during transient connection retries.`,
    category: 'Technology',
    categorySlug: 'technology',
    coverImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'Distributed Systems', 'Backend', 'Microservices'],
    status: 'Published',
    views: 3100,
    likes: 215,
    readingTime: '8 min read',
    publishedAt: 'May 05, 2024',
    updatedAt: 'May 06, 2024',
  },
  {
    id: 'post-3',
    title: 'The Art of Slow Living and Intentional Focus',
    slug: 'the-art-of-slow-living-and-intentional-focus',
    excerpt:
      'How stepping back from constant digital velocity restored creative clarity, deep work habits, and analog joy.',
    content: `## The Tyranny of Constant Connectivity\n\nModern knowledge workers live in a perpetual state of split attention. Notifications, chat badges, and instant replies fracture the deep mental state required for true creative breakthroughs.\n\n### Cultivating Analog Pockets\n\n- Dedicate the first 90 minutes of each morning to offline thinking with paper and ink.\n- Turn off all non-human push notifications on your primary workstation.\n- Treat reading as a sacred, continuous activity rather than fragmented skimming.`,
    category: 'Lifestyle',
    categorySlug: 'lifestyle',
    coverImage:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    tags: ['Slow Living', 'Focus', 'Productivity', 'Mindfulness'],
    status: 'Published',
    views: 2450,
    likes: 180,
    readingTime: '5 min read',
    publishedAt: 'Apr 28, 2024',
    updatedAt: 'Apr 28, 2024',
  },
  {
    id: 'post-4',
    title: 'Rebuilding Edge Runtimes with Rust and WebAssembly',
    slug: 'rebuilding-edge-runtimes-with-rust-and-webassembly',
    excerpt:
      'A hands-on technical breakdown of optimizing cold-start latencies and zero-copy buffers in edge compute nodes.',
    content: `## Why WebAssembly at the Edge?\n\nTraditional container-based serverless functions suffer from 100ms-500ms cold starts. By compiling Rust into lightweight Wasm bytecode modules, initialization drops to sub-millisecond territory.\n\n### Memory Safety Without Garbage Collection\n\nRust's ownership model guarantees compile-time memory safety without runtime pauses, making it the ideal language for high-density edge isolates.`,
    category: 'Technology',
    categorySlug: 'technology',
    coverImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['Rust', 'WebAssembly', 'Performance', 'Edge Computing'],
    status: 'Draft',
    views: 0,
    likes: 0,
    readingTime: '7 min read',
    publishedAt: 'Draft',
    updatedAt: 'Oct 20, 2026',
  },
  {
    id: 'post-5',
    title: 'Typography Rules for High-Density Reading Interfaces',
    slug: 'typography-rules-for-high-density-reading-interfaces',
    excerpt:
      'Examining font scales, baseline grids, and line heights in editorial digital publishing.',
    content: `## Typography is the User Interface\n\nOver 90% of the information on the web is written word. Tuning line height (leading), column width (measure), and optical sizing transforms a tiring screen into a restorative reading experience.`,
    category: 'Design',
    categorySlug: 'design',
    coverImage:
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    tags: ['Typography', 'Editorial', 'CSS', 'Design Systems'],
    status: 'Draft',
    views: 0,
    likes: 0,
    readingTime: '4 min read',
    publishedAt: 'Draft',
    updatedAt: 'Oct 18, 2026',
  },
  {
    id: 'post-6',
    title: 'The Economics of Bootstrapped Content Publishing',
    slug: 'the-economics-of-bootstrapped-content-publishing',
    excerpt:
      'Why independent editorial networks are outperforming ad-supported media models in long-term revenue.',
    content: `## The Death of the Ad-Supported Media Model\n\nChasing programmatic page views created clickbait. Direct subscriber relationships and curated sponsorships create high-margin, sustainable creative businesses.`,
    category: 'Business',
    categorySlug: 'business',
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tags: ['Publishing', 'Business', 'Economics', 'Monetization'],
    status: 'Scheduled',
    scheduledDate: 'Nov 12, 2026',
    views: 0,
    likes: 0,
    readingTime: '5 min read',
    publishedAt: 'Nov 12, 2026 (Scheduled)',
    updatedAt: 'Oct 22, 2026',
  },
];

export const getAuthorPosts = () => {
  try {
    const raw = localStorage.getItem(AUTHOR_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(AUTHOR_POSTS_KEY, JSON.stringify(INITIAL_AUTHOR_POSTS));
      return INITIAL_AUTHOR_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUTHOR_POSTS;
  }
};

export const getAuthorPostById = (idOrSlug) => {
  const posts = getAuthorPosts();
  return posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
};

export const saveAuthorPost = (postData) => {
  try {
    const posts = getAuthorPosts();
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const isExisting = Boolean(postData.id && posts.some((p) => p.id === postData.id));

    let updatedList;
    let savedRecord;

    if (isExisting) {
      updatedList = posts.map((item) => {
        if (item.id === postData.id) {
          savedRecord = {
            ...item,
            ...postData,
            updatedAt: nowFormatted,
          };
          return savedRecord;
        }
        return item;
      });
    } else {
      savedRecord = {
        id: `post-${Date.now()}`,
        views: 0,
        likes: 0,
        createdAt: nowFormatted,
        updatedAt: nowFormatted,
        publishedAt: postData.status === 'Published' ? nowFormatted : postData.status,
        ...postData,
      };
      updatedList = [savedRecord, ...posts];
    }

    localStorage.setItem(AUTHOR_POSTS_KEY, JSON.stringify(updatedList));
    return savedRecord;
  } catch {
    return postData;
  }
};

export const deleteAuthorPost = (id) => {
  try {
    const posts = getAuthorPosts();
    const updated = posts.filter((p) => p.id !== id);
    localStorage.setItem(AUTHOR_POSTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const getAuthorStats = () => {
  const posts = getAuthorPosts();
  const published = posts.filter((p) => p.status === 'Published');
  const drafts = posts.filter((p) => p.status === 'Draft');
  const scheduled = posts.filter((p) => p.status === 'Scheduled');

  const totalViewsRaw = published.reduce((acc, p) => acc + (Number(p.views) || 0), 0);
  const totalLikesRaw = published.reduce((acc, p) => acc + (Number(p.likes) || 0), 0);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return String(num);
  };

  return {
    totalPosts: posts.length,
    publishedPosts: published.length,
    draftsCount: drafts.length,
    scheduledCount: scheduled.length,
    totalViews: formatNumber(totalViewsRaw),
    totalLikes: formatNumber(totalLikesRaw),
  };
};

// ==========================================
// Admin Panel Management (Phase 5)
// Stores mock user accounts, post moderation, and comment moderation
// ==========================================
const ADMIN_USERS_KEY = 'inkspace_admin_users';
const ADMIN_POSTS_KEY = 'inkspace_admin_posts';
const ADMIN_COMMENTS_KEY = 'inkspace_admin_comments';

const INITIAL_ADMIN_USERS = [
  {
    id: 'u-1',
    name: 'Alex Morgan',
    email: 'alex@inkspace.dev',
    role: 'Author',
    status: 'Active',
    joinedDate: 'Jan 15, 2024',
    postsCount: 14,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'u-2',
    name: 'Sarah Johnson',
    email: 'sarah@inkspace.dev',
    role: 'Author',
    status: 'Active',
    joinedDate: 'Feb 02, 2024',
    postsCount: 22,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'u-3',
    name: 'Elena Rostova',
    email: 'elena@inkspace.dev',
    role: 'Admin',
    status: 'Active',
    joinedDate: 'Nov 12, 2023',
    postsCount: 31,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'u-4',
    name: 'Marcus Chen',
    email: 'marcus@inkspace.dev',
    role: 'Author',
    status: 'Active',
    joinedDate: 'Apr 05, 2024',
    postsCount: 8,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'u-5',
    name: 'Clara Oswald',
    email: 'clara.reader@inkspace.dev',
    role: 'Reader',
    status: 'Active',
    joinedDate: 'Mar 10, 2024',
    postsCount: 0,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'u-6',
    name: 'James Carter',
    email: 'james.carter@inkspace.dev',
    role: 'Reader',
    status: 'Suspended',
    joinedDate: 'May 01, 2024',
    postsCount: 0,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'u-7',
    name: 'Maya Lin',
    email: 'maya.lin@inkspace.dev',
    role: 'Reader',
    status: 'Active',
    joinedDate: 'May 18, 2024',
    postsCount: 0,
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
  },
];

export const getAdminUsers = () => {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMIN_USERS;
  }
};

export const updateAdminUser = (id, updates) => {
  try {
    const users = getAdminUsers();
    const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const deleteAdminUser = (id) => {
  try {
    const users = getAdminUsers();
    const updated = users.filter((u) => u.id !== id);
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// Initial admin posts derived from initial stories
const INITIAL_ADMIN_POSTS = [
  {
    id: 'adm-art-1',
    title: 'The Future of Minimalist Web Design',
    slug: 'the-future-of-minimalist-web-design',
    author: 'Alex Morgan',
    category: 'Design',
    status: 'Published',
    isFeatured: true,
    views: 4200,
    likes: 320,
    publishedAt: 'May 12, 2024',
    moderationStatus: 'Approved',
  },
  {
    id: 'adm-art-2',
    title: 'Architecting Resilient Distributed Systems',
    slug: 'architecting-resilient-distributed-systems',
    author: 'Alex Morgan',
    category: 'Technology',
    status: 'Published',
    isFeatured: true,
    views: 3100,
    likes: 215,
    publishedAt: 'May 05, 2024',
    moderationStatus: 'Approved',
  },
  {
    id: 'adm-art-3',
    title: 'The Art of Slow Living and Intentional Focus',
    slug: 'the-art-of-slow-living-and-intentional-focus',
    author: 'Elena Rostova',
    category: 'Lifestyle',
    status: 'Published',
    isFeatured: false,
    views: 2450,
    likes: 180,
    publishedAt: 'Apr 28, 2024',
    moderationStatus: 'Approved',
  },
  {
    id: 'adm-art-4',
    title: 'Rebuilding Edge Runtimes with Rust and WebAssembly',
    slug: 'rebuilding-edge-runtimes-with-rust-and-webassembly',
    author: 'Alex Morgan',
    category: 'Technology',
    status: 'Draft',
    isFeatured: false,
    views: 0,
    likes: 0,
    publishedAt: 'Draft',
    moderationStatus: 'Pending',
  },
  {
    id: 'adm-art-5',
    title: 'The Economics of Bootstrapped Content Publishing',
    slug: 'the-economics-of-bootstrapped-content-publishing',
    author: 'Marcus Chen',
    category: 'Business',
    status: 'Scheduled',
    isFeatured: false,
    views: 0,
    likes: 0,
    publishedAt: 'Nov 12, 2026',
    moderationStatus: 'Approved',
  },
  {
    id: 'adm-art-6',
    title: 'The Renaissance of Mechanical Keyboards in the Digital Age',
    slug: 'the-renaissance-of-mechanical-keyboards-in-the-digital-age',
    author: 'David Vance',
    category: 'Lifestyle',
    status: 'Published',
    isFeatured: false,
    views: 1890,
    likes: 142,
    publishedAt: 'May 01, 2024',
    moderationStatus: 'Approved',
  },
];

export const getAdminPosts = () => {
  try {
    const raw = localStorage.getItem(ADMIN_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_POSTS_KEY, JSON.stringify(INITIAL_ADMIN_POSTS));
      return INITIAL_ADMIN_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMIN_POSTS;
  }
};

export const toggleFeaturePost = (id) => {
  try {
    const posts = getAdminPosts();
    const updated = posts.map((p) =>
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    localStorage.setItem(ADMIN_POSTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const updateAdminPost = (id, updates) => {
  try {
    const posts = getAdminPosts();
    const updated = posts.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(ADMIN_POSTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const deleteAdminPost = (id) => {
  try {
    const posts = getAdminPosts();
    const updated = posts.filter((p) => p.id !== id);
    localStorage.setItem(ADMIN_POSTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// Initial admin comments
const INITIAL_ADMIN_COMMENTS = [
  {
    id: 'comm-1',
    author: 'Marcus Chen',
    authorEmail: 'marcus@inkspace.dev',
    articleTitle: 'The Future of Minimalist Web Design',
    articleSlug: 'the-future-of-minimalist-web-design',
    content:
      'Remarkable breakdown of modern compilers and calm design. Really insightful perspective on edge computing!',
    status: 'Approved',
    submittedAt: 'May 13, 2024',
  },
  {
    id: 'comm-2',
    author: 'Unknown Guest',
    authorEmail: 'promo99@spam-example.net',
    articleTitle: 'Architecting Resilient Distributed Systems',
    articleSlug: 'architecting-resilient-distributed-systems',
    content:
      'Check out this free automated backlink service at spam-rank-booster.click to rank your site in 24 hours!',
    status: 'Flagged',
    flagReason: 'Spam link and automated advertisement',
    submittedAt: 'May 11, 2024',
  },
  {
    id: 'comm-3',
    author: 'Elena Rostova',
    authorEmail: 'elena@inkspace.dev',
    articleTitle: 'The Art of Slow Living and Intentional Focus',
    articleSlug: 'the-art-of-slow-living-and-intentional-focus',
    content:
      'The section on silent mornings resonated deeply with our entire editorial guild. We are adopting this protocol.',
    status: 'Approved',
    submittedAt: 'May 08, 2024',
  },
  {
    id: 'comm-4',
    author: 'David Vance',
    authorEmail: 'david.vance@example.com',
    articleTitle: 'The Renaissance of Mechanical Keyboards',
    articleSlug: 'the-renaissance-of-mechanical-keyboards-in-the-digital-age',
    content:
      'Is there a companion guide on lubrication techniques and gasket mount plates coming up in future editions?',
    status: 'Pending',
    submittedAt: 'May 19, 2024',
  },
  {
    id: 'comm-5',
    author: 'Anonymous User',
    authorEmail: 'bot772@shady-network.org',
    articleTitle: 'The Economics of Bootstrapped Content Publishing',
    articleSlug: 'the-economics-of-bootstrapped-content-publishing',
    content:
      'Crypto investment returns guaranteed 500% weekly! Click the profile link to claim bonus tokens immediately.',
    status: 'Flagged',
    flagReason: 'Cryptocurrency scam / deceptive solicitation',
    submittedAt: 'May 20, 2024',
  },
];

export const getAdminComments = () => {
  try {
    const raw = localStorage.getItem(ADMIN_COMMENTS_KEY);
    if (!raw) {
      localStorage.setItem(
        ADMIN_COMMENTS_KEY,
        JSON.stringify(INITIAL_ADMIN_COMMENTS)
      );
      return INITIAL_ADMIN_COMMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMIN_COMMENTS;
  }
};

export const approveAdminComment = (id) => {
  try {
    const comments = getAdminComments();
    const updated = comments.map((c) =>
      c.id === id ? { ...c, status: 'Approved' } : c
    );
    localStorage.setItem(ADMIN_COMMENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const flagAdminComment = (id, reason = 'Flagged by Administrator') => {
  try {
    const comments = getAdminComments();
    const updated = comments.map((c) =>
      c.id === id ? { ...c, status: 'Flagged', flagReason: reason } : c
    );
    localStorage.setItem(ADMIN_COMMENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const deleteAdminComment = (id) => {
  try {
    const comments = getAdminComments();
    const updated = comments.filter((c) => c.id !== id);
    localStorage.setItem(ADMIN_COMMENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const getAdminOverviewStats = () => {
  const users = getAdminUsers();
  const posts = getAdminPosts();
  const comments = getAdminComments();

  const flaggedComments = comments.filter((c) => c.status === 'Flagged').length;
  const pendingComments = comments.filter((c) => c.status === 'Pending').length;
  const pendingPosts = posts.filter((p) => p.moderationStatus === 'Pending').length;

  return {
    totalUsers: users.length,
    totalPosts: posts.length,
    featuredPosts: posts.filter((p) => p.isFeatured).length,
    totalComments: comments.length,
    pendingReports: flaggedComments + pendingComments + pendingPosts,
    authorsCount: users.filter((u) => u.role === 'Author').length,
    readersCount: users.filter((u) => u.role === 'Reader').length,
    adminsCount: users.filter((u) => u.role === 'Admin').length,
  };
};
