import AdminOverviewClient from './AdminOverviewClient';
import { queryD1, queryD1First } from '@/lib/d1';

export const metadata = {
  title: 'Admin Overview | Hospital Portal',
};

export default async function AdminDashboardPage() {
  let stats = {
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  };
  let pendingList = [];

  try {
    // Execute aggregate count queries in parallel/sequentially
    const patientsRes = await queryD1First('SELECT COUNT(*) AS count FROM patients');
    const doctorsRes = await queryD1First('SELECT COUNT(*) AS count FROM doctors');
    const appointmentsRes = await queryD1First('SELECT COUNT(*) AS count FROM appointments');
    const pendingRes = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE status = 'pending'");

    stats = {
      totalPatients: patientsRes?.count || 0,
      totalDoctors: doctorsRes?.count || 0,
      totalAppointments: appointmentsRes?.count || 0,
      pendingAppointments: pendingRes?.count || 0,
    };

    // Fetch up to 5 recent pending appointments
    pendingList = await queryD1(`
      SELECT a.*, dept.name AS department_name, doc.name AS doctor_name
      FROM appointments a
      LEFT JOIN departments dept ON a.department_id = dept.id
      LEFT JOIN doctors doc ON a.doctor_id = doc.id
      WHERE a.status = 'pending'
      ORDER BY a.created_at DESC
      LIMIT 5
    `);
  } catch (error) {
    console.error('Failed to load admin dashboard overview data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Administrative Overview</h2>
        <p className="text-gray-500 text-xs mt-0.5">Overview of active patient counts, doctor scheduling, and waiting operations.</p>
      </div>

      <AdminOverviewClient stats={stats} initialAppointments={pendingList} />
    </div>
  );
}
