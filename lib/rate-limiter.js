import { kvGet, kvSet } from './kv';

/**
 * Perform Cloudflare KV-based rate limiting for API endpoints
 * @param {string} identifier - Client identifier (e.g. IP address, user email, or token)
 * @param {number} limit - Maximum hits allowed in the window
 * @param {number} windowSeconds - Window duration in seconds (default: 60)
 * @returns {Promise<{ allowed: boolean, count: number }>}
 */
export async function rateLimit(identifier, limit = 60, windowSeconds = 60) {
  try {
    const key = `rate:${identifier}`;
    const currentHits = await kvGet(key);

    if (currentHits === null) {
      // First hit: initialize cache entry
      await kvSet(key, '1', windowSeconds);
      return { allowed: true, count: 1 };
    }

    const count = parseInt(currentHits) || 0;

    if (count >= limit) {
      // Over limit
      return { allowed: false, count };
    }

    // Increment count
    await kvSet(key, (count + 1).toString(), windowSeconds);
    return { allowed: true, count: count + 1 };
  } catch (error) {
    // Graceful degradation: allow request if KV check fails
    console.error('Rate limiting error, allowing request:', error.message);
    return { allowed: true, count: 1 };
  }
}
