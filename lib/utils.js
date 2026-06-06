/**
 * Utility functions
 */

/**
 * Generate a unique ID (UUID v4 style)
 * @returns {string}
 */
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} - Formatted date (e.g., "15 Jan 2025")
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date string to include time
 * @param {string} dateStr - ISO date string
 * @returns {string} - Formatted datetime
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get current ISO timestamp
 * @returns {string}
 */
export function now() {
  return new Date().toISOString();
}

/**
 * Get status badge color class
 * @param {string} status
 * @returns {string}
 */
export function getStatusBadgeClass(status) {
  const classes = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    active: 'badge-success',
    inactive: 'badge-danger',
  };
  return classes[status] || 'badge-primary';
}

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export function truncate(str, length = 50) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate Indian phone number
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const clean = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
  return /^[6-9]\d{9}$/.test(clean);
}
