import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { hashPassword, signToken, createAuthCookieHeader } from '@/lib/auth';
import { kvSet } from '@/lib/kv';
import { generateId, now } from '@/lib/utils';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation — only name, phone and password required
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, phone number, and password are required' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Normalize email — if provided check uniqueness, else auto-generate placeholder
    const normalizedEmail = email && email.trim()
      ? email.toLowerCase().trim()
      : `patient.${phone}@omchaudharyhospital.local`;

    // Check if phone already registered
    const existingPhone = await queryD1First(
      'SELECT id FROM patients WHERE phone = ?',
      [phone.trim()]
    );
    if (existingPhone) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists. Please login.' },
        { status: 409 }
      );
    }

    // Check if real email already exists (skip for auto-generated ones)
    if (email && email.trim()) {
      const existing = await queryD1First(
        'SELECT id FROM users WHERE email = ? AND email NOT LIKE \'%@omchaudharyhospital.local\'',
        [normalizedEmail]
      );
      if (existing) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = generateId();
    const patientId = generateId();
    const timestamp = now();

    await queryD1(
      'INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), normalizedEmail, passwordHash, 'patient', timestamp]
    );

    // Create patient record with phone
    await queryD1(
      'INSERT INTO patients (id, user_id, name, phone) VALUES (?, ?, ?, ?)',
      [patientId, userId, name.trim(), phone.trim()]
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
        email: email && email.trim() ? normalizedEmail : null,
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
