import { Readable } from 'node:stream';
import { router } from '../routes/routes.js';
import { getPosts, savePosts } from '../utils/fileHandler.js';

/**
 * Creates a mock HTTP response object to capture status, headers, and body.
 */
function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(key, val) {
      this.headers[key.toLowerCase()] = val;
    },
    end(chunk) {
      if (chunk) this.body += chunk;
      if (this._onEnd) this._onEnd();
    },
  };
}

/**
 * Dispatches a simulated HTTP request through the router.
 */
async function dispatch(method, url, body = null, headers = {}) {
  const req = new Readable({
    read() {
      if (body) {
        this.push(typeof body === 'string' ? body : JSON.stringify(body));
      }
      this.push(null);
    },
  });

  req.method = method;
  req.url = url;
  req.headers = {
    host: 'localhost:4000',
    'content-type': 'application/json',
    ...headers,
  };

  const res = createMockResponse();

  await new Promise((resolve, reject) => {
    res._onEnd = resolve;
    router(req, res).catch((err) => {
      res.statusCode = err.statusCode || 500;
      res.body = JSON.stringify({ success: false, error: err.message });
      resolve();
    });
  });

  let parsedBody = null;
  try {
    parsedBody = JSON.parse(res.body);
  } catch {
    parsedBody = res.body;
  }

  return {
    status: res.statusCode,
    headers: res.headers,
    data: parsedBody,
  };
}

async function runTests() {
  console.log('🧪 Starting InkSpace Backend Verification Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. Health check
  console.log('--- Test 1: Health Check (GET /api/health) ---');
  const healthRes = await dispatch('GET', '/api/health');
  assert(healthRes.status === 200, 'Health check returns status 200');
  assert(healthRes.data.success === true, 'Health check returns success: true');
  assert(healthRes.data.status === 'ok', 'Health check returns status: ok');

  // 2. List published posts
  console.log('\n--- Test 2: List Published Posts (GET /api/posts) ---');
  const listRes = await dispatch('GET', '/api/posts');
  assert(listRes.status === 200, 'GET /api/posts returns status 200');
  assert(Array.isArray(listRes.data.data), 'GET /api/posts returns array of posts');
  assert(listRes.data.pagination.total > 0, 'Pagination metadata reports total count');
  assert(listRes.data.pagination.page === 1, 'Default page is 1');
  assert(listRes.data.pagination.limit === 6, 'Default limit is 6');

  // 3. Search query filter
  console.log('\n--- Test 3: Search Posts (GET /api/posts?search=future) ---');
  const searchRes = await dispatch('GET', '/api/posts?search=future');
  assert(searchRes.status === 200, 'Search returns status 200');
  assert(searchRes.data.data.length > 0, 'Found articles matching "future"');
  assert(
    searchRes.data.data.every((p) =>
      p.title.toLowerCase().includes('future') || p.excerpt.toLowerCase().includes('future')
    ),
    'All returned articles match the search term in title or excerpt'
  );

  // 4. Category filter
  console.log('\n--- Test 4: Category Filter (GET /api/posts?category=technology) ---');
  const catRes = await dispatch('GET', '/api/posts?category=technology');
  assert(catRes.status === 200, 'Category filter returns status 200');
  assert(
    catRes.data.data.every(
      (p) => p.categorySlug === 'technology' || p.category.toLowerCase() === 'technology'
    ),
    'All returned articles belong to category technology'
  );

  // 5. Pagination limit and page
  console.log('\n--- Test 5: Pagination (GET /api/posts?page=2&limit=2) ---');
  const pageRes = await dispatch('GET', '/api/posts?page=2&limit=2');
  assert(pageRes.status === 200, 'Pagination returns status 200');
  assert(pageRes.data.data.length <= 2, 'Page size respects limit=2');
  assert(pageRes.data.pagination.page === 2, 'Current page is 2');
  assert(pageRes.data.pagination.limit === 2, 'Current limit is 2');

  // 6. Get single post by existing slug
  console.log('\n--- Test 6: Single Post by Slug (GET /api/posts/:slug) ---');
  const firstPostSlug = listRes.data.data[0].slug;
  const singleRes = await dispatch('GET', `/api/posts/${firstPostSlug}`);
  assert(singleRes.status === 200, `Found existing slug "${firstPostSlug}" with 200`);
  assert(singleRes.data.data.slug === firstPostSlug, 'Returned post matches requested slug');

  // 7. Get nonexistent post by slug
  console.log('\n--- Test 7: Nonexistent Slug (GET /api/posts/this-does-not-exist) ---');
  const notFoundPostRes = await dispatch('GET', '/api/posts/this-does-not-exist-xyz');
  assert(notFoundPostRes.status === 404, 'Nonexistent slug returns 404');
  assert(notFoundPostRes.data.success === false, 'Error response reports success: false');

  // 8. Create post with missing required fields (Validation Error 400)
  console.log('\n--- Test 8: Create Post Validation Error (POST /api/posts with empty body) ---');
  const invalidCreateRes = await dispatch('POST', '/api/posts', {});
  assert(invalidCreateRes.status === 400, 'Empty post payload returns 400 Bad Request');
  assert(invalidCreateRes.data.details.title, 'Validation error flags missing title');
  assert(invalidCreateRes.data.details.content, 'Validation error flags missing content');

  // 9. Create post with valid data
  console.log('\n--- Test 9: Create Post Successfully (POST /api/posts) ---');
  const testTitle = `Test Article from Student ${Date.now()}`;
  const validPostPayload = {
    title: testTitle,
    content: 'This is an article written to test the native Node.js HTTP backend foundation.',
    category: 'Technology',
    tags: ['NodeJS', 'HTTP', 'Backend'],
    status: 'Published',
  };
  const createRes = await dispatch('POST', '/api/posts', validPostPayload);
  assert(createRes.status === 201, 'Valid post creation returns 201 Created');
  assert(createRes.data.data.id, 'New post has generated id');
  assert(createRes.data.data.slug, 'New post has generated slug');
  assert(createRes.data.data.status === 'Published', 'New post has status Published');

  // 10. Verify slug uniqueness handling with duplicate title
  console.log('\n--- Test 10: Slug Uniqueness Handling (Duplicate Title) ---');
  const dupCreateRes = await dispatch('POST', '/api/posts', validPostPayload);
  assert(dupCreateRes.status === 201, 'Duplicate title post created with 201');
  assert(
    dupCreateRes.data.data.slug !== createRes.data.data.slug,
    `Slugs are unique! (${createRes.data.data.slug} vs ${dupCreateRes.data.data.slug})`
  );

  // 11. Malformed JSON handling
  console.log('\n--- Test 11: Malformed JSON Request Body ---');
  const malformedRes = await dispatch('POST', '/api/posts', '{ title: invalid json, oops ');
  assert(malformedRes.status === 400, 'Malformed JSON body returns 400 Bad Request');
  assert(
    malformedRes.data.error.includes('Malformed JSON'),
    'Error message describes malformed JSON'
  );

  // 12. Unknown route handling
  console.log('\n--- Test 12: Unknown Route (GET /api/nonexistent-route) ---');
  const unknownRouteRes = await dispatch('GET', '/api/nonexistent-route');
  assert(unknownRouteRes.status === 404, 'Unknown route returns 404 Not Found');

  // 13. Verify file persistence
  console.log('\n--- Test 13: File Persistence Check ---');
  const postsFromFile = await getPosts();
  const persistedPost = postsFromFile.find((p) => p.title === testTitle);
  assert(persistedPost !== undefined, 'Created post was successfully persisted to data/posts.json');

  console.log(`\n=================================================`);
  console.log(`🎉 ALL ${passed}/${total} BACKEND TESTS PASSED SUCCESSFULLY!`);
  console.log(`=================================================\n`);
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
