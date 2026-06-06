import AdminAppointmentsClient from '../../admin/appointments/AdminAppointmentsClient';
import { queryD1 } from '@/lib/d1';

export const metadata = {
  title: 'Manage Appointments | Hospital Portal',
};

export default async function ReceptionistAppointmentsPage() {
  let appointments = [];
  let doctors = [];

  try {
    // Fetch all appointments
    appointments = await queryD1(`
      SELECT a.*, dept.name AS department_name, doc.name AS doctor_name, doc.speciality AS doctor_speciality
      FROM appointments a
      LEFT JOIN departments dept ON a.department_id = dept.id
      LEFT JOIN doctors doc ON a.doctor_id = doc.id
      ORDER BY a.created_at DESC
    `);

    // Fetch all doctors for assignments
    doctors = await queryD1(`
      SELECT id, name, speciality, department_id
      FROM doctors
      ORDER BY name ASC
    `);
  } catch (error) {
    console.error('Failed to load receptionist appointments page data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manage Appointments</h2>
        <p className="text-gray-500 text-xs mt-0.5">Filter, search, allocate doctors, and update statuses of all patient visits.</p>
      </div>

      <AdminAppointmentsClient initialAppointments={appointments} doctors={doctors} />
    </div>
  );
}
