/**
 * Sends a JSON response with the appropriate Content-Type header and status code.
 *
 * @param {import('node:http').ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code (e.g. 200, 201, 400, 404, 500)
 * @param {any} data - JavaScript object to serialize into JSON
 */
export function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data, null, 2) + '\n');
}

/**
 * Safely parses the incoming JSON request body stream.
 * - Enforces a maximum payload size limit (default 1MB) to protect against DoS attacks.
 * - Rejects malformed JSON with an informative error.
 *
 * @param {import('node:http').IncomingMessage} req - HTTP request stream
 * @param {number} maxBytes - Maximum allowed payload in bytes (default 1MB = 1048576)
 * @returns {Promise<any>} Parsed JSON object
 */
export function parseRequestBody(req, maxBytes = 1048576) {
  return new Promise((resolve, reject) => {
    let rawBody = '';
    let receivedBytes = 0;

    // Listen for incoming data chunks
    req.on('data', (chunk) => {
      receivedBytes += chunk.length;

      // Reject if body size exceeds limit
      if (receivedBytes > maxBytes) {
        const error = new Error('Payload Too Large: Request body exceeds the 1MB size limit.');
        error.statusCode = 413;
        req.destroy(); // Terminate incoming stream
        return reject(error);
      }

      rawBody += chunk.toString('utf-8');
    });

    // When the stream ends, parse the accumulated string as JSON
    req.on('end', () => {
      if (!rawBody.trim()) {
        return resolve({});
      }

      try {
        const parsed = JSON.parse(rawBody);
        resolve(parsed);
      } catch (err) {
        const parseError = new Error(`Malformed JSON in request body: ${err.message}`);
        parseError.statusCode = 400;
        reject(parseError);
      }
    });

    // Handle network or stream abort errors
    req.on('error', (err) => {
      err.statusCode = 400;
      reject(err);
    });
  });
}

/**
 * Generates a clean, URL-safe slug from a string title.
 * Examples:
 *   "The Future of Web Development!" -> "the-future-of-web-development"
 *   "Hello & World" -> "hello-world"
 *
 * @param {string} text - Title or string to slugify
 * @returns {string} URL-safe slug
 */
export function slugify(text) {
  return String(text || '')
    .normalize('NFKD') // Normalize accented characters (e.g. é -> e)
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Strip leading and trailing hyphens
}

/**
 * Generates a guaranteed unique slug by checking against an existing list of posts.
 *
 * @param {string} title - The desired post title
 * @param {Array<{slug: string}>} existingPosts - List of posts
 * @returns {string} Unique slug
 */
export function generateUniqueSlug(title, existingPosts = []) {
  const baseSlug = slugify(title) || `post-${Date.now()}`;
  const existingSlugs = new Set(existingPosts.map((p) => p.slug?.toLowerCase()));

  if (!existingSlugs.has(baseSlug.toLowerCase())) {
    return baseSlug;
  }

  // If already taken, append incremental number: baseSlug-1, baseSlug-2, etc.
  let counter = 1;
  while (existingSlugs.has(`${baseSlug}-${counter}`.toLowerCase())) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}
