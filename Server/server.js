import http from 'node:http';
import { router } from './routes/routes.js';
import { sendJSON } from './utils/httpHelpers.js';
import { readJSON, POSTS_FILE, USERS_FILE, COMMENTS_FILE } from './utils/fileHandler.js';

// Configuration: defaults to 4000, configurable via PORT env variable
const PORT = Number(process.env.PORT) || 4000;

/**
 * Applies Cross-Origin Resource Sharing (CORS) headers to allow
 * local React/Vite development frontends to make API calls safely.
 *
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
function applyCORS(req, res) {
  // Allow all local origins (or specific frontend origin if present)
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

/**
 * Initializes JSON storage files before accepting incoming traffic.
 */
async function initializeStorage() {
  await readJSON(POSTS_FILE, []);
  await readJSON(USERS_FILE, []);
  await readJSON(COMMENTS_FILE, []);
}

/**
 * Creates the native Node.js HTTP server.
 */
const server = http.createServer(async (req, res) => {
  // 1. Apply CORS headers to every response
  applyCORS(req, res);

  // 2. Handle CORS Preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }

  // 3. Delegate request to custom router with unified error boundary
  try {
    await router(req, res);
  } catch (err) {
    // Determine status code: default to 500 unless an explicit error status was provided
    const statusCode = err.statusCode || 500;

    // Log the actual error internally for debugging
    console.error(`[HTTP Error ${statusCode}] ${req.method} ${req.url}:`, err.message);

    // Never leak stack traces or internal server paths to the client
    sendJSON(res, statusCode, {
      success: false,
      error: statusCode === 500 ? 'Internal Server Error' : err.message,
    });
  }
});

// Handle server errors (e.g. port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`   To free port ${PORT}, run: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`   Or run on another port: PORT=4001 node server.js\n`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

// Initialize files and start listening
try {
  await initializeStorage();

  // Listen on PORT on all network interfaces (IPv4 and IPv6 dual-stack)
  server.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`  InkSpace Native Node.js Backend Running!`);
    console.log(`  Local URL:    http://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Posts API:    http://localhost:${PORT}/api/posts`);
    console.log(`=================================================\n`);
  });
} catch (startupErr) {
  console.error('Failed to start InkSpace backend server:', startupErr.message);
  process.exit(1);
}

// Graceful shutdown on SIGINT / SIGTERM
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Gracefully stopping InkSpace server...`);
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
