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

export function middleware(request) {
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

  // Decode JWT payload (without full verification — verification happens in API routes)
  // Middleware runs on edge, so we do a simple base64 decode of the payload
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

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
