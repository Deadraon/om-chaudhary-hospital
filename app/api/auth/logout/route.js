import { NextResponse } from 'next/server';
import { getAuthCookie, createLogoutCookieHeader } from '@/lib/auth';
import { kvDelete } from '@/lib/kv';

export async function POST(request) {
  try {
    const token = getAuthCookie(request);

    // Delete session from KV
    if (token) {
      try {
        await kvDelete(token);
      } catch (error) {
        console.error('KV delete error on logout:', error);
      }
    }

    // Delete cookie
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', createLogoutCookieHeader());

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
