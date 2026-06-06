import AdminDoctorsClient from './AdminDoctorsClient';
import { queryD1 } from '@/lib/d1';

export const metadata = {
  title: 'Manage Doctors | Hospital Portal',
};

export default async function AdminDoctorsPage() {
  let doctors = [];
  let departments = [];

  try {
    // Fetch all doctors with department names
    doctors = await queryD1(`
      SELECT d.*, dept.name AS department_name, u.email
      FROM doctors d
      LEFT JOIN departments dept ON d.department_id = dept.id
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.name ASC
    `);

    // Fetch departments for allocation select
    departments = await queryD1(`
      SELECT id, name
      FROM departments
      ORDER BY name ASC
    `);
  } catch (error) {
    console.error('Failed to load admin doctors page data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Doctors Directory</h2>
        <p className="text-gray-500 text-xs mt-0.5">Manage and organize hospital specialists, add new records, and assign departments.</p>
      </div>

      <AdminDoctorsClient initialDoctors={doctors} departments={departments} />
    </div>
  );
}
