import PatientAppointmentsClient from './PatientAppointmentsClient';
import { queryD1, queryD1First } from '@/lib/d1';
import { headers } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Appointments | Hospital Portal',
};

export default async function PatientAppointmentsPage() {
  let appointments = [];
  let patient = null;

  try {
    const headerList = headers();
    const userId = headerList.get('x-user-id') || '';

    // Find patient profile to get their phone number
    patient = await queryD1First('SELECT id, phone FROM patients WHERE user_id = ?', [userId]);

    if (patient && patient.phone) {
      // Fetch appointments matching this patient's phone number
      appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name, doc.name AS doctor_name, doc.speciality AS doctor_speciality
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        LEFT JOIN doctors doc ON a.doctor_id = doc.id
        WHERE a.phone = ?
        ORDER BY a.preferred_date DESC, a.created_at DESC
      `, [patient.phone]);
    }
  } catch (error) {
    console.error('Failed to load patient appointments data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Consultation Schedule</h2>
          <p className="text-gray-500 text-xs mt-0.5">Track and review all your scheduled visits and outpatient bookings.</p>
        </div>
        <Link href="/book-appointment" className="btn-primary py-2.5 text-xs font-bold">
          Book Appointment
        </Link>
      </div>

      {/* Roster list */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <PatientAppointmentsClient appointments={appointments} />
      </div>
    </div>
  );
}
