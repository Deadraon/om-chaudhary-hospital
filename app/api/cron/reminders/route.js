import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { sendSMS } from '@/lib/sms';

export const dynamic = 'force-dynamic';

/**
 * GET: Send SMS reminders for tomorrow's confirmed appointments
 * Secured by CRON_SECRET token.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || request.headers.get('Authorization')?.replace('Bearer ', '');
    const cronSecret = process.env.CRON_SECRET || 'local-cron-bypass-key';

    if (token !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate tomorrow's date string (YYYY-MM-DD)
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Query confirmed appointments for tomorrow
    const appointments = await queryD1(`
      SELECT a.*, d.name AS doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.preferred_date = ? AND a.status = 'confirmed'
    `, [tomorrowStr]);

    let sentCount = 0;
    const errors = [];

    for (const apt of appointments) {
      if (apt.phone) {
        try {
          const docName = apt.doctor_name ? `Dr. ${apt.doctor_name}` : 'our clinical specialist';
          const msg = `Dear ${apt.patient_name}, reminder: you have a confirmed appointment with ${docName} tomorrow (${apt.preferred_date}) at Om Chaudhary Hospital.`;
          
          await sendSMS(apt.phone, msg);
          sentCount++;
        } catch (smsErr) {
          console.error(`Cron reminder fail for appointment ${apt.id}:`, smsErr.message);
          errors.push({ id: apt.id, error: smsErr.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      scheduledDate: tomorrowStr,
      found: appointments.length,
      sent: sentCount,
      errors
    });
  } catch (error) {
    console.error('Cron reminders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
