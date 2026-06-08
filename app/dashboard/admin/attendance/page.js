import AdminAttendanceClient from './AdminAttendanceClient';
import { queryD1 } from '@/lib/d1';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Attendance Roster | Admin Portal',
};

export default async function AdminAttendancePage() {
  // Read request headers set by middleware to verify Admin access
  const headerList = headers();
  const userRole = headerList.get('x-user-role') || 'patient';
  
  if (userRole !== 'super_admin') {
    redirect('/dashboard');
  }

  let initialLogs = [];
  let staffList = [];

  try {
    // 1. Fetch initial logs
    initialLogs = await queryD1(`
      SELECT a.*, u.name AS user_name, u.role AS user_role, u.email AS user_email
      FROM attendance a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.date DESC, a.check_in DESC
    `);

    // 2. Fetch list of active staff & doctors (excluding patients)
    staffList = await queryD1(`
      SELECT id, name, role
      FROM users
      WHERE role IN ('super_admin', 'doctor', 'receptionist')
      ORDER BY name ASC
    `);
  } catch (error) {
    console.error('Failed to load attendance roster data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Staff & Management Attendance</h2>
        <p className="text-gray-500 text-xs mt-0.5">Track daily check-ins, check-outs, shift durations, and manual override adjustments.</p>
      </div>

      <AdminAttendanceClient initialLogs={initialLogs} staffList={staffList} />
    </div>
  );
}
