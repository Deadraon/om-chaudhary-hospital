/**
 * Cloudflare R2 REST API Helper
 * Handles file uploads and URL generation for doctor photos and lab reports
 */

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'hospital-files';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer|ArrayBuffer} fileBuffer - File data
 * @param {string} key - Object key (file path in bucket)
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<{success: boolean, key: string}>}
 */
export async function uploadToR2(fileBuffer, key, contentType = 'application/octet-stream') {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error('Cloudflare R2 environment variables are not configured');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': contentType,
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('R2 Upload Error:', response.status, errorText);
    throw new Error(`R2 upload failed: ${response.status} ${response.statusText}`);
  }

  return { success: true, key };
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} key - Object key to delete
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteFromR2(key) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error('Cloudflare R2 environment variables are not configured');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('R2 Delete Error:', response.status, errorText);
    throw new Error(`R2 delete failed: ${response.status} ${response.statusText}`);
  }

  return { success: true };
}

/**
 * Get the public URL for an R2 object
 * @param {string} key - Object key
 * @returns {string} - Public URL
 */
export function getR2Url(key) {
  if (!key) return '/placeholder-doctor.png';
  
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key;
  }

  // Client-side execution: Return the local proxy/redirect API URL to avoid missing environment variables on the browser
  if (typeof window !== 'undefined') {
    return `/api/files/${key}`;
  }

  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }

  // Fallback: construct URL from account and bucket
  return `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
}

/**
 * Generate a unique R2 key for file upload
 * @param {string} folder - Folder prefix (e.g., 'doctors', 'reports')
 * @param {string} filename - Original filename
 * @returns {string} - Unique key
 */
export function generateR2Key(folder, filename) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = filename.split('.').pop();
  return `${folder}/${timestamp}-${randomStr}.${ext}`;
}
