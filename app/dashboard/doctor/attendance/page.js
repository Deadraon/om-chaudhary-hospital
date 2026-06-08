import StaffAttendanceClient from './StaffAttendanceClient';
import { queryD1 } from '@/lib/d1';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Attendance | Doctor Portal',
};

export default async function DoctorAttendancePage() {
  const headerList = headers();
  const userId = headerList.get('x-user-id') || '';
  const userRole = headerList.get('x-user-role') || 'patient';

  if (userRole !== 'doctor') {
    redirect('/dashboard');
  }

  let initialLogs = [];
  try {
    initialLogs = await queryD1(`
      SELECT a.*, u.name AS user_name, u.role AS user_role, u.email AS user_email
      FROM attendance a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ?
      ORDER BY a.date DESC
    `, [userId]);
  } catch (error) {
    console.error('Failed to load doctor attendance history:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Attendance</h2>
        <p className="text-gray-500 text-xs mt-0.5">Track your check-ins, check-outs, and shift history.</p>
      </div>

      <StaffAttendanceClient initialLogs={initialLogs} />
    </div>
  );
}
