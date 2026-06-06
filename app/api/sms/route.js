import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone and message fields are required' },
        { status: 400 }
      );
    }

    const smsResult = await sendSMS(phone, message.trim());

    if (smsResult.success) {
      return NextResponse.json({ success: true, message: 'SMS sent successfully' });
    } else {
      return NextResponse.json({ error: smsResult.message || 'Failed to send SMS' }, { status: 500 });
    }
  } catch (error) {
    console.error('Manual SMS send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
