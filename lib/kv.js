/**
 * Cloudflare KV REST API Helper
 * Manages JWT session tokens for server-side session invalidation
 */

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID;

const KV_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}`;

/**
 * Set a key-value pair in Cloudflare KV
 * @param {string} key - KV key
 * @param {string} value - KV value
 * @param {number} [ttl] - Time to live in seconds (optional)
 * @returns {Promise<{success: boolean}>}
 */
export async function kvSet(key, value, ttl = null) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !KV_NAMESPACE_ID) {
    throw new Error('Cloudflare KV environment variables are not configured');
  }

  let url = `${KV_BASE_URL}/values/${encodeURIComponent(key)}`;
  if (ttl) {
    url += `?expiration_ttl=${ttl}`;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: value,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('KV Set Error:', response.status, errorText);
    throw new Error(`KV set failed: ${response.status} ${response.statusText}`);
  }

  return { success: true };
}

/**
 * Get a value from Cloudflare KV
 * @param {string} key - KV key
 * @returns {Promise<string|null>} - Value or null if not found
 */
export async function kvGet(key) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !KV_NAMESPACE_ID) {
    throw new Error('Cloudflare KV environment variables are not configured');
  }

  const url = `${KV_BASE_URL}/values/${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('KV Get Error:', response.status, errorText);
    throw new Error(`KV get failed: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

/**
 * Delete a key from Cloudflare KV
 * @param {string} key - KV key to delete
 * @returns {Promise<{success: boolean}>}
 */
export async function kvDelete(key) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !KV_NAMESPACE_ID) {
    throw new Error('Cloudflare KV environment variables are not configured');
  }

  const url = `${KV_BASE_URL}/values/${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    console.error('KV Delete Error:', response.status, errorText);
    throw new Error(`KV delete failed: ${response.status} ${response.statusText}`);
  }

  return { success: true };
}
