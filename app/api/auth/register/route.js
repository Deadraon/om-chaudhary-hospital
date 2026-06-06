import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { hashPassword, signToken, createAuthCookieHeader } from '@/lib/auth';
import { kvSet } from '@/lib/kv';
import { generateId, now } from '@/lib/utils';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await queryD1First(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (patients only via self-registration)
    const userId = generateId();
    const patientId = generateId();
    const timestamp = now();

    await queryD1(
      'INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), email.toLowerCase().trim(), passwordHash, 'patient', timestamp]
    );

    // Also create a patient record
    await queryD1(
      'INSERT INTO patients (id, user_id, name, phone) VALUES (?, ?, ?, ?)',
      [patientId, userId, name.trim(), phone || '']
    );

    // Generate JWT and set cookie
    const token = signToken({
      userId,
      role: 'patient',
      name: name.trim(),
    });

    await kvSet(token, userId, 7 * 24 * 60 * 60);

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'patient',
      },
      redirect: '/dashboard/patient',
    });

    response.headers.set('Set-Cookie', createAuthCookieHeader(token));

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
