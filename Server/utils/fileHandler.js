import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve directory paths relative to this file's location, NOT process.cwd()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.resolve(__dirname, '..', 'data');
export const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
export const USERS_FILE = path.join(DATA_DIR, 'users.json');
export const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

/**
 * In-memory write queue to avoid race conditions and prevent concurrent file write corruption.
 * Sequential execution ensures one write completes before the next begins for the same file.
 */
const writeQueues = new Map();

function queueWrite(filePath, task) {
  const currentPromise = writeQueues.get(filePath) || Promise.resolve();
  const nextPromise = currentPromise
    .catch(() => {}) // Continue the queue even if a previous operation failed
    .then(task);

  writeQueues.set(filePath, nextPromise);
  return nextPromise;
}

/**
 * Ensures that the target directory exists.
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

/**
 * Reads and parses a JSON file safely.
 * - If the file does not exist (ENOENT), it creates it with the given defaultData.
 * - If the file exists but has invalid JSON, it throws an error (DO NOT overwrite malformed files!).
 *
 * @param {string} filePath - Absolute path to the JSON file
 * @param {any} defaultData - Fallback default data if file is missing (e.g. [])
 * @returns {Promise<any>} Parsed JavaScript object/array
 */
export async function readJSON(filePath, defaultData = []) {
  try {
    const rawContent = await fs.readFile(filePath, 'utf-8');
    try {
      return JSON.parse(rawContent);
    } catch (parseErr) {
      // Critical requirement: Do not silently overwrite malformed files!
      throw new Error(
        `JSON file "${path.basename(filePath)}" is corrupted or malformed: ${parseErr.message}`
      );
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File does not exist yet; initialize with default data
      await writeJSON(filePath, defaultData);
      return defaultData;
    }
    // Re-throw parse errors and other unexpected filesystem errors
    throw err;
  }
}

/**
 * Writes data to a JSON file atomically using a temporary file and rename.
 * Queued to ensure concurrent writes don't conflict or corrupt the file.
 *
 * @param {string} filePath - Absolute path to the JSON file
 * @param {any} data - Data to serialize and save
 * @returns {Promise<any>} The saved data
 */
export async function writeJSON(filePath, data) {
  return queueWrite(filePath, async () => {
    const dir = path.dirname(filePath);
    await ensureDirectoryExists(dir);

    const jsonString = JSON.stringify(data, null, 2) + '\n';
    const tempFilePath = `${filePath}.tmp.${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      // Write to temp file first
      await fs.writeFile(tempFilePath, jsonString, 'utf-8');
      // Atomic replacement of target file
      await fs.rename(tempFilePath, filePath);
      return data;
    } catch (writeErr) {
      // Attempt cleanup of temp file if write/rename fails
      try {
        await fs.unlink(tempFilePath);
      } catch {
        // Ignore unlink error if temp file was never created
      }
      throw new Error(`Failed to write JSON to "${path.basename(filePath)}": ${writeErr.message}`);
    }
  });
}

/**
 * Helper to fetch all posts
 */
export async function getPosts() {
  return readJSON(POSTS_FILE, []);
}

/**
 * Helper to save posts
 */
export async function savePosts(posts) {
  return writeJSON(POSTS_FILE, posts);
}

/**
 * Helper to fetch all users
 */
export async function getUsers() {
  return readJSON(USERS_FILE, []);
}

/**
 * Helper to save users
 */
export async function saveUsers(users) {
  return writeJSON(USERS_FILE, users);
}

/**
 * Helper to fetch all comments
 */
export async function getComments() {
  return readJSON(COMMENTS_FILE, []);
}

/**
 * Helper to save comments
 */
export async function saveComments(comments) {
  return writeJSON(COMMENTS_FILE, comments);
}
