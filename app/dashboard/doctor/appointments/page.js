import DoctorAppointmentsClient from './DoctorAppointmentsClient';
import { queryD1, queryD1First } from '@/lib/d1';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Consultations Schedule | Hospital Portal',
};

export default async function DoctorAppointmentsPage() {
  let doctor = null;
  let appointments = [];

  try {
    const headerList = headers();
    const userId = headerList.get('x-user-id') || '';

    // Find doctor record linked to user
    doctor = await queryD1First('SELECT * FROM doctors WHERE user_id = ?', [userId]);

    if (doctor) {
      // Fetch all appointments for this doctor
      appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        WHERE a.doctor_id = ?
        ORDER BY a.preferred_date DESC, a.created_at DESC
      `, [doctor.id]);
    }
  } catch (error) {
    console.error('Failed to load doctor appointments data:', error.message);
  }

  if (!doctor) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-750 p-6 rounded-3xl text-sm font-semibold max-w-xl mx-auto text-center mt-10">
        ⚠️ Profile Not Found. Contact the administrator.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Consultations & Schedule</h2>
        <p className="text-gray-500 text-xs mt-0.5">Track patient appointments, view clinical history, and manage your consultation calendar.</p>
      </div>

      <DoctorAppointmentsClient initialAppointments={appointments} />
    </div>
  );
}
