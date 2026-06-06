import DataTable from '@/components/DataTable';
import { queryD1 } from '@/lib/d1';

export const metadata = {
  title: 'Patients List | Hospital Portal',
};

export default async function AdminPatientsPage() {
  let patients = [];

  try {
    // Fetch registered patient records
    patients = await queryD1(`
      SELECT p.*, u.email
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.name ASC
    `);
  } catch (error) {
    console.error('Failed to load admin patients page data:', error.message);
  }

  const columns = [
    {
      key: 'name',
      label: 'Patient Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900">{val}</p>
          <p className="text-gray-400 text-xs mt-0.5">UID: {row.id.slice(0, 8).toUpperCase()}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email Address',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      sortable: false,
      render: (val) => <span className="text-sm font-medium">{val || '-'}</span>,
    },
    {
      key: 'dob',
      label: 'Date of Birth',
      sortable: true,
      render: (val) => <span className="text-sm">{val || '-'}</span>,
    },
    {
      key: 'blood_group',
      label: 'Blood Group',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-md border ${
          val 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}>
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      sortable: false,
      render: (val) => <span className="text-xs text-gray-600 max-w-xs block truncate">{val || '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Registered Patients</h2>
        <p className="text-gray-500 text-xs mt-0.5">Browse registered patients, search by email or mobile, and track medical records.</p>
      </div>

      {/* Main Roster Panel */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={patients} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
