import { NextResponse } from 'next/server';
import { getR2Url } from '@/lib/r2';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { key } = params;
    if (!key || key.length === 0) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    const fileKey = key.join('/');
    const isPrivate = fileKey.startsWith('lab-reports/') || fileKey.startsWith('second-opinions/');

    if (isPrivate) {
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Call getR2Url on the server side where environment variables are loaded
    const r2Url = getR2Url(fileKey);

    return NextResponse.redirect(r2Url);
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
