import { NextResponse } from 'next/server';
import { queryD1First } from '@/lib/d1';
import { comparePassword, signToken, createAuthCookieHeader, getDashboardPath } from '@/lib/auth';
import { kvSet } from '@/lib/kv';
import { rateLimit } from '@/lib/rate-limiter';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const limitCheck = await rateLimit(`login:${ip}`, 5, 60); // Max 5 logins/min
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again after a minute.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Phone number (or email) and password are required' },
        { status: 400 }
      );
    }

    const identifier = email.trim();
    const isPhone = /^\d{10}$/.test(identifier.replace(/\s/g, ''));

    let user = null;

    if (isPhone) {
      // Login via phone number — look up through patients table
      const patient = await queryD1First(
        `SELECT u.id, u.name, u.email, u.password_hash, u.role
         FROM users u
         JOIN patients p ON p.user_id = u.id
         WHERE p.phone = ?`,
        [identifier]
      );
      user = patient;
    } else {
      // Login via email
      user = await queryD1First(
        'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
        [identifier.toLowerCase()]
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: isPhone ? 'No account found with this phone number' : 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      role: user.role,
      name: user.name,
    });

    // Save session to KV (token → userId, 7 day TTL)
    await kvSet(token, user.id, 7 * 24 * 60 * 60);

    // Get role-based redirect path
    const redirectPath = getDashboardPath(user.role);

    // Display email — hide auto-generated placeholder
    const displayEmail = user.email && !user.email.includes('@omchaudharyhospital.local')
      ? user.email
      : null;

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: displayEmail,
        role: user.role,
      },
      redirect: redirectPath,
    });

    response.headers.set('Set-Cookie', createAuthCookieHeader(token));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
