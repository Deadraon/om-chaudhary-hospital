import PatientProfileClient from './PatientProfileClient';
import { queryD1First } from '@/lib/d1';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Profile | Hospital Portal',
};

export default async function PatientDashboardPage() {
  let patient = null;

  try {
    const headerList = headers();
    const userId = headerList.get('x-user-id') || '';

    // Fetch patient record linked to the user account
    patient = await queryD1First(`
      SELECT p.*, u.email
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `, [userId]);
  } catch (error) {
    console.error('Failed to load patient dashboard profile data:', error.message);
  }

  if (!patient) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-750 p-6 rounded-3xl text-sm font-semibold max-w-xl mx-auto text-center mt-10">
        ⚠️ Profile Not Found. You do not seem to have an active Patient medical record associated with this account. Please contact the administrator.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Profile & Settings</h2>
        <p className="text-gray-500 text-xs mt-0.5">Manage and review your patient registry records, contact details, and vital info.</p>
      </div>

      <PatientProfileClient initialPatient={patient} />
    </div>
  );
}
