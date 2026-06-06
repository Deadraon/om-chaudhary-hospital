import AdminStaffClient from './AdminStaffClient';
import { queryD1 } from '@/lib/d1';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Manage Staff | Hospital Portal',
};

export default async function AdminStaffPage() {
  let staff = [];
  let currentUserId = '';

  try {
    // Read user ID from headers (set by middleware)
    const headerList = headers();
    currentUserId = headerList.get('x-user-id') || '';

    // Fetch all staff members joining with users
    staff = await queryD1(`
      SELECT s.*, u.email, u.role
      FROM staff s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.name ASC
    `);
  } catch (error) {
    console.error('Failed to load admin staff page data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
        <p className="text-gray-500 text-xs mt-0.5">Manage portal administrative permissions, track logins, and register receptionist profiles.</p>
      </div>

      <AdminStaffClient initialStaff={staff} currentUserId={currentUserId} />
    </div>
  );
}
