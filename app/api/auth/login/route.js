import { NextResponse } from 'next/server';
import { queryD1First } from '@/lib/d1';
import { comparePassword, signToken, createAuthCookieHeader, getDashboardPath } from '@/lib/auth';
import { kvSet } from '@/lib/kv';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await queryD1First(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
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

    // Set HTTP-only cookie and return
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
