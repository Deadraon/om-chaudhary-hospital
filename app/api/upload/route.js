import { NextResponse } from 'next/server';
import { uploadToR2, generateR2Key } from '@/lib/r2';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    // Authenticate user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (only admins, receptionists, and doctors can upload files)
    const isAllowed = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique R2 key
    const key = generateR2Key(folder, file.name);

    // Upload to Cloudflare R2
    await uploadToR2(buffer, key, file.type);

    return NextResponse.json({
      success: true,
      key,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file. Check your Cloudflare R2 configurations.' },
      { status: 500 }
    );
  }
}
