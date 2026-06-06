import ReceptionistOverviewClient from './ReceptionistOverviewClient';
import { queryD1, queryD1First } from '@/lib/d1';

export const metadata = {
  title: 'Receptionist Dashboard | Hospital Portal',
};

export default async function ReceptionistDashboardPage() {
  let stats = { total: 0, pending: 0, todayCount: 0 };
  let pendingList = [];

  try {
    // Get aggregate counts
    const totalRes = await queryD1First('SELECT COUNT(*) AS count FROM appointments');
    const pendingRes = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE status = 'pending'");
    
    // Get count for today (formatted as YYYY-MM-DD in UTC local)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRes = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE preferred_date = ?", [todayStr]);

    stats = {
      total: totalRes?.count || 0,
      pending: pendingRes?.count || 0,
      todayCount: todayRes?.count || 0,
    };

    // Get 5 pending requests
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
    console.error('Failed to load receptionist dashboard overview data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Reception Desk Overview</h2>
        <p className="text-gray-500 text-xs mt-0.5">Manage patient walk-ins, phone bookings, and pending appointment requests.</p>
      </div>

      <ReceptionistOverviewClient stats={stats} initialAppointments={pendingList} />
    </div>
  );
}
