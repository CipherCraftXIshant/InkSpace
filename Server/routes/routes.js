import { getPosts, savePosts } from '../utils/fileHandler.js';
import {
  sendJSON,
  parseRequestBody,
  slugify,
  generateUniqueSlug,
} from '../utils/httpHelpers.js';

/**
 * GET /api/health
 * Simple diagnostic endpoint to confirm the server is responsive.
 */
async function handleHealth(req, res) {
  sendJSON(res, 200, {
    success: true,
    status: 'ok',
    message: 'InkSpace backend is running',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
}

/**
 * GET /api/posts
 * Returns a paginated list of published articles.
 * Supports:
 *   - ?search=keyword (matches title and excerpt)
 *   - ?category=tech (matches categorySlug or category)
 *   - ?page=1 (defaults to 1)
 *   - ?limit=6 (defaults to 6, max 50)
 */
async function handleGetPosts(req, res, queryParams) {
  const allPosts = await getPosts();

  // 1. Filter: published posts only
  let filtered = allPosts.filter(
    (post) =>
      post.status &&
      (post.status.toLowerCase() === 'published' || post.status === 'Published')
  );

  // 2. Filter: search query (title and excerpt)
  const searchQuery = queryParams.get('search') || queryParams.get('q');
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((post) => {
      const inTitle = post.title && post.title.toLowerCase().includes(q);
      const inExcerpt = post.excerpt && post.excerpt.toLowerCase().includes(q);
      const inTags = Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(q));
      return inTitle || inExcerpt || inTags;
    });
  }

  // 3. Filter: category
  const categoryQuery = queryParams.get('category');
  if (categoryQuery && categoryQuery !== 'all') {
    const cat = categoryQuery.toLowerCase().trim();
    filtered = filtered.filter((post) => {
      const matchSlug = post.categorySlug && post.categorySlug.toLowerCase() === cat;
      const matchName = post.category && post.category.toLowerCase() === cat;
      return matchSlug || matchName;
    });
  }

  // 4. Sort: newest first by default
  filtered.sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || a.dateTimestamp || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || b.dateTimestamp || 0).getTime();
    return timeB - timeA;
  });

  // 5. Pagination calculation
  const total = filtered.length;
  const rawPage = parseInt(queryParams.get('page'), 10);
  const rawLimit = parseInt(queryParams.get('limit'), 10);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 6;
  const totalPages = Math.ceil(total / limit) || 1;

  const startIndex = (page - 1) * limit;
  const paginatedPosts = filtered.slice(startIndex, startIndex + limit);

  sendJSON(res, 200, {
    success: true,
    data: paginatedPosts,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
}

/**
 * GET /api/posts/:slug
 * Retrieves a single published article by its unique slug.
 * Returns 404 if the post does not exist or is not published.
 */
async function handleGetPostBySlug(req, res, slug) {
  const allPosts = await getPosts();
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();

  const post = allPosts.find(
    (p) => p.slug && p.slug.toLowerCase() === normalizedSlug
  );

  // Must exist and be published
  const isPublished =
    post &&
    post.status &&
    (post.status.toLowerCase() === 'published' || post.status === 'Published');

  if (!post || !isPublished) {
    sendJSON(res, 404, {
      success: false,
      error: 'Post not found or is unpublished',
      slug,
    });
    return;
  }

  sendJSON(res, 200, {
    success: true,
    data: post,
  });
}

/**
 * POST /api/posts
 * Development-only endpoint to create a new article in JSON storage.
 * - Validates required fields: title and content.
 * - Generates unique URL-safe slug.
 * - Defaults status to "Draft" unless explicitly set to "Published".
 */
async function handleCreatePost(req, res) {
  const body = await parseRequestBody(req);

  // Validate required fields
  const errors = {};
  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    errors.title = 'Title is required and must be a non-empty string.';
  }
  if (!body.content || typeof body.content !== 'string' || !body.content.trim()) {
    errors.content = 'Content is required and must be a non-empty string.';
  }

  if (Object.keys(errors).length > 0) {
    sendJSON(res, 400, {
      success: false,
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  const allPosts = await getPosts();

  // Generate unique slug
  const title = body.title.trim();
  const uniqueSlug = generateUniqueSlug(title, allPosts);

  // Post status defaults to 'Draft' unless 'Published' is explicitly requested
  const isPublishRequested =
    typeof body.status === 'string' &&
    body.status.toLowerCase() === 'published';
  const postStatus = isPublishRequested ? 'Published' : 'Draft';

  // Calculate estimated reading time
  const wordCount = body.content.trim().split(/\s+/).length;
  const estimatedReadingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const category = body.category?.trim() || 'General';
  const now = new Date().toISOString();

  const newPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    slug: uniqueSlug,
    subtitle: body.subtitle?.trim() || '',
    excerpt:
      body.excerpt?.trim() ||
      (body.content.trim().slice(0, 160) + (body.content.trim().length > 160 ? '...' : '')),
    content: body.content.trim(),
    category,
    categorySlug: slugify(category),
    tags: Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    coverImage:
      body.coverImage?.trim() ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    author:
      typeof body.author === 'object' && body.author?.name
        ? body.author
        : {
            name: typeof body.author === 'string' && body.author.trim() ? body.author.trim() : 'InkSpace Author',
            role: 'Author',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          },
    status: postStatus,
    readingTime: body.readingTime || estimatedReadingTime,
    views: 0,
    likes: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: postStatus === 'Published' ? now : null,
  };

  // Prepend to posts list (newest first)
  const updatedPosts = [newPost, ...allPosts];
  await savePosts(updatedPosts);

  sendJSON(res, 201, {
    success: true,
    message: 'Post created successfully',
    data: newPost,
    notice: 'Development API: Post stored in local JSON file (no database)',
  });
}

/**
 * Main HTTP request dispatcher / router.
 * Inspects HTTP method and pathname to execute the corresponding controller.
 *
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export async function router(req, res) {
  // Construct URL object using host header
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // 1. GET /api/health
  if (method === 'GET' && pathname === '/api/health') {
    return handleHealth(req, res);
  }

  // 2. GET /api/posts
  if (method === 'GET' && pathname === '/api/posts') {
    return handleGetPosts(req, res, parsedUrl.searchParams);
  }

  // 3. GET /api/posts/:slug
  const postSlugMatch = pathname.match(/^\/api\/posts\/([a-zA-Z0-9_-]+)$/);
  if (method === 'GET' && postSlugMatch) {
    const slug = postSlugMatch[1];
    return handleGetPostBySlug(req, res, slug);
  }

  // 4. POST /api/posts
  if (method === 'POST' && pathname === '/api/posts') {
    return handleCreatePost(req, res);
  }

  // 5. Unknown Route -> 404
  sendJSON(res, 404, {
    success: false,
    error: 'Route not found',
    method,
    path: pathname,
  });
}
