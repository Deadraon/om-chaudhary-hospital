import DataTable from '@/components/DataTable';
import { queryD1, queryD1First } from '@/lib/d1';
import { headers } from 'next/headers';
import Link from 'next/link';

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

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      render: (val) => <span className="font-mono text-xs font-bold text-gray-400">{val.slice(0, 8).toUpperCase()}</span>,
    },
    {
      key: 'department_name',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'doctor_name',
      label: 'Doctor Assigned',
      sortable: true,
      render: (val, row) => (
        <span>
          {val ? `Dr. ${val} (${row.doctor_speciality || 'Specialist'})` : 'Waiting Allocation'}
        </span>
      ),
    },
    {
      key: 'preferred_date',
      label: 'Scheduled Date',
      sortable: true,
      render: (val) => (
        <span className="text-sm font-semibold">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full border ${statusColors[val] || 'bg-gray-50 text-gray-700'}`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Reason / Concern',
      sortable: false,
      render: (val) => <span className="text-gray-500 text-xs italic block max-w-xs truncate">{val || '-'}</span>,
    },
  ];

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
        <DataTable columns={columns} data={appointments} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
