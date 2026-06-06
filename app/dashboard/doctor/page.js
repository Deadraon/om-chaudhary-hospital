import DoctorOverviewClient from './DoctorOverviewClient';
import { queryD1, queryD1First } from '@/lib/d1';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Doctor Schedule | Hospital Portal',
};

export default async function DoctorDashboardPage() {
  let doctor = null;
  let stats = { total: 0, pending: 0, confirmed: 0, completed: 0 };
  let appointments = [];

  try {
    const headerList = headers();
    const userId = headerList.get('x-user-id') || '';

    // Find doctor record linked to this user
    doctor = await queryD1First('SELECT * FROM doctors WHERE user_id = ?', [userId]);

    if (doctor) {
      const docId = doctor.id;

      // Parallel queries for statistics
      const totalRes = await queryD1First('SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ?', [docId]);
      const pendingRes = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND status = 'pending'", [docId]);
      const confirmedRes = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND status = 'confirmed'", [docId]);
      const completedRes = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND status = 'completed'", [docId]);

      stats = {
        total: totalRes?.count || 0,
        pending: pendingRes?.count || 0,
        confirmed: confirmedRes?.count || 0,
        completed: completedRes?.count || 0,
      };

      // Fetch active appointments (not completed or cancelled)
      appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        WHERE a.doctor_id = ? AND a.status IN ('pending', 'confirmed')
        ORDER BY a.preferred_date ASC, a.created_at DESC
        LIMIT 10
      `, [docId]);
    }
  } catch (error) {
    console.error('Failed to load doctor dashboard overview data:', error.message);
  }

  if (!doctor) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-750 p-6 rounded-3xl text-sm font-semibold max-w-xl mx-auto text-center mt-10">
        ⚠️ Profile Not Found. You do not seem to have an active Doctor clinical record associated with this account. Please contact the administrator.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Welcome, Dr. {doctor.name}</h2>
        <p className="text-gray-500 text-xs mt-0.5">{doctor.speciality || 'General Specialist'} • {doctor.experience || 'Clinical Practitioner'}</p>
      </div>

      <DoctorOverviewClient stats={stats} initialAppointments={appointments} />
    </div>
  );
}
