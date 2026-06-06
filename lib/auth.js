/**
 * Custom JWT Authentication Helper
 * Handles token generation, verification, password hashing, and cookie management
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { kvGet } from './kv';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const COOKIE_NAME = 'hospital_auth_token';
const TOKEN_EXPIRY = '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Sign a JWT token
 * @param {{ userId: string, role: string, name: string }} payload
 * @returns {string} - Signed JWT token
 */
export function signToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {{ userId: string, role: string, name: string } | null}
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Get the auth token from request cookies
 * @param {Request} request
 * @returns {string|null}
 */
export function getAuthCookie(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );
  return cookies[COOKIE_NAME] || null;
}

/**
 * Create a Set-Cookie header value for auth token
 * @param {string} token - JWT token
 * @returns {string} - Cookie header value
 */
export function createAuthCookieHeader(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Secure`;
}

/**
 * Create a cookie deletion header (for logout)
 * @returns {string} - Cookie header value that expires immediately
 */
export function createLogoutCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

/**
 * Get current user from request (verify JWT + check KV session)
 * @param {Request} request
 * @returns {Promise<{ userId: string, role: string, name: string } | null>}
 */
export async function getCurrentUser(request) {
  const token = getAuthCookie(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Verify session exists in KV (not logged out)
  try {
    const kvSession = await kvGet(token);
    if (!kvSession) return null; // Session was invalidated (logged out)
  } catch (error) {
    // If KV check fails, still allow (graceful degradation)
    console.error('KV session check failed:', error.message);
  }

  return payload;
}

/**
 * Get the role-based dashboard redirect path
 * @param {string} role
 * @returns {string}
 */
export function getDashboardPath(role) {
  const paths = {
    super_admin: '/dashboard/admin',
    doctor: '/dashboard/doctor',
    receptionist: '/dashboard/receptionist',
    patient: '/dashboard/patient',
  };
  return paths[role] || '/login';
}

export { COOKIE_NAME };
