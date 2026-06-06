import AdminPatientsClient from './AdminPatientsClient';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Patients List | Hospital Portal',
};

export default async function AdminPatientsPage() {
  let patients = [];

  try {
    // Fetch registered patient records
    patients = await queryD1(`
      SELECT p.*, u.email
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.name ASC
    `);
  } catch (error) {
    console.error('Failed to load admin patients page data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Registered Patients</h2>
        <p className="text-gray-500 text-xs mt-0.5">Browse registered patients, search by email or mobile, and track medical records.</p>
      </div>

      {/* Main Roster Panel */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <AdminPatientsClient patients={patients} />
      </div>
    </div>
  );
}
