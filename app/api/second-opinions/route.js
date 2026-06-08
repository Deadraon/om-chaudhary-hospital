import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { uploadToR2, generateR2Key } from '@/lib/r2';
import { generateId, now } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve second opinion submissions (Staff only)
 */
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const submissions = await queryD1(`
      SELECT * FROM second_opinions
      ORDER BY created_at DESC
    `);

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Fetch second opinions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Submit a second opinion request (Public / Guest)
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const specialty = formData.get('specialty');
    const file = formData.get('file');

    if (!name || !phone || !specialty) {
      return NextResponse.json({ error: 'Name, phone, and specialty are required' }, { status: 400 });
    }

    let file_name = null;

    if (file && file.size > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Generate R2 key
        file_name = generateR2Key('second-opinions', file.name);
        // Upload to Cloudflare R2
        await uploadToR2(buffer, file_name, file.type);
      } catch (uploadErr) {
        console.error('Failed to upload second opinion file to R2:', uploadErr.message);
        return NextResponse.json({ error: 'Failed to upload report file. Please verify R2 configurations.' }, { status: 500 });
      }
    }

    const id = generateId();
    const timestamp = now();

    await queryD1(`
      INSERT INTO second_opinions (id, patient_name, phone, specialty, file_name, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `, [id, name.trim(), phone.trim(), specialty, file_name, timestamp]);

    return NextResponse.json({ success: true, submissionId: id });
  } catch (error) {
    console.error('Submit second opinion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
