import AdminPatientsClient from '../../admin/patients/AdminPatientsClient';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Patients | Hospital Portal',
};

export default async function DoctorPatientsPage() {
  const headerList = headers();
  const userId = headerList.get('x-user-id');
  
  let patients = [];

  try {
    // 1. Find the doctor record corresponding to the current logged in user
    const doctor = await queryD1First('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    
    if (doctor) {
      // 2. Fetch distinct patients who have scheduled appointments with this doctor
      patients = await queryD1(`
        SELECT DISTINCT p.*, u.email
        FROM patients p
        LEFT JOIN users u ON p.user_id = u.id
        JOIN appointments a ON p.phone = a.phone
        WHERE a.doctor_id = ?
        ORDER BY p.name ASC
      `, [doctor.id]);
    }
  } catch (error) {
    console.error('Failed to load doctor patients page data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Patients</h2>
        <p className="text-gray-500 text-xs mt-0.5">List of registered patients currently under your clinical care or consultation schedule.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <AdminPatientsClient patients={patients} />
      </div>
    </div>
  );
}
