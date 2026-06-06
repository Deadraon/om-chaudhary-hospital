import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const departments = await queryD1('SELECT * FROM departments ORDER BY name ASC');
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Fetch departments API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
