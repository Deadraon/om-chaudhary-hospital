import { NextResponse } from 'next/server';

const COOKIE_NAME = 'hospital_auth_token';

// Define which roles can access which dashboard paths
const ROLE_ACCESS = {
  super_admin: ['/dashboard/admin'],
  doctor: ['/dashboard/doctor'],
  receptionist: ['/dashboard/receptionist'],
  patient: ['/dashboard/patient'],
};

// Role-based redirect paths
const ROLE_DASHBOARDS = {
  super_admin: '/dashboard/admin',
  doctor: '/dashboard/doctor',
  receptionist: '/dashboard/receptionist',
  patient: '/dashboard/patient',
};

// Verify HMAC SHA-256 JWT signature using standard Web Crypto API (Edge-safe)
async function verifyHS256(token, secretStr) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const secretKeyData = encoder.encode(secretStr);

    const key = await crypto.subtle.importKey(
      'raw',
      secretKeyData,
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['verify']
    );

    const base64UrlToUint8Array = (base64Url) => {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padLength = (4 - (base64.length % 4)) % 4;
      const padded = base64 + '='.repeat(padLength);
      const binary = atob(padded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    };

    const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(signatureB64);

    return await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      dataToVerify
    );
  } catch (err) {
    console.error('Crypto verification error:', err);
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard/* routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Get token from cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );
  const token = cookies[COOKIE_NAME];

  if (!token) {
    // No token — redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cryptographically verify the JWT signature using the environment's JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-this';
  const isValid = await verifyHS256(token, jwtSecret);
  if (!isValid) {
    console.warn('Middleware: JWT signature verification failed');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode JWT payload (already verified)
  try {
    const parts = token.split('.');
    const payloadBase64 = parts[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('expired', 'true');
      return NextResponse.redirect(loginUrl);
    }

    const userRole = payload.role;

    if (!userRole || !ROLE_ACCESS[userRole]) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is accessing their allowed dashboard
    const allowedPaths = ROLE_ACCESS[userRole];
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path));

    if (!isAllowed) {
      // Redirect to the user's correct dashboard
      const correctDashboard = ROLE_DASHBOARDS[userRole];
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }

    // Attach user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId || '');
    response.headers.set('x-user-role', payload.role || '');
    response.headers.set('x-user-name', payload.name || '');
    return response;
  } catch (error) {
    console.error('Middleware auth error:', error.message);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
