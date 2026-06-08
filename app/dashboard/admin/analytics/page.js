import { queryD1 } from '@/lib/d1';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hospital Analytics | Admin Dashboard',
};

export default async function AnalyticsPage() {
  let monthlyData = [];
  let departmentData = [];
  let doctorLoadData = [];
  let summaryStats = {};

  try {
    // 1. Monthly appointments count (last 6 months)
    // Note: preferred_date is stored as YYYY-MM-DD
    monthlyData = await queryD1(`
      SELECT substr(preferred_date, 1, 7) AS month, COUNT(*) AS count
      FROM appointments
      WHERE preferred_date IS NOT NULL AND preferred_date != ''
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `);
    // Reverse to chronological order
    monthlyData.reverse();

    // 2. Department distribution
    departmentData = await queryD1(`
      SELECT d.name AS name, COUNT(a.id) AS count
      FROM departments d
      JOIN appointments a ON d.id = a.department_id
      GROUP BY d.id
      ORDER BY count DESC
    `);

    // 3. Doctor load
    doctorLoadData = await queryD1(`
      SELECT doc.name AS name, COUNT(a.id) AS count
      FROM doctors doc
      JOIN appointments a ON doc.id = a.doctor_id
      GROUP BY doc.id
      ORDER BY count DESC
    `);

    // 4. General Stats summary
    const patientsCount = await queryD1('SELECT COUNT(*) AS count FROM patients');
    const doctorsCount = await queryD1('SELECT COUNT(*) AS count FROM doctors');
    const appointmentsCount = await queryD1('SELECT COUNT(*) AS count FROM appointments');
    const opinionsCount = await queryD1('SELECT COUNT(*) AS count FROM second_opinions');

    summaryStats = {
      totalPatients: patientsCount[0]?.count || 0,
      totalDoctors: doctorsCount[0]?.count || 0,
      totalAppointments: appointmentsCount[0]?.count || 0,
      totalOpinions: opinionsCount[0]?.count || 0,
    };

  } catch (error) {
    console.error('Failed to load analytics data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Hospital Analytics & Insight</h2>
        <p className="text-gray-500 text-xs mt-0.5">Real-time statistics, monthly appointment ratios, and department load metrics.</p>
      </div>

      <AnalyticsClient 
        initialMonthly={monthlyData}
        initialDepartment={departmentData}
        initialDoctorLoad={doctorLoadData}
        summaryStats={summaryStats}
      />
    </div>
  );
}
