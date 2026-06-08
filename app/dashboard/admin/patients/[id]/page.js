import { queryD1, queryD1First } from '@/lib/d1';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PatientDetailClient from './PatientDetailClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Patient History Profile | Hospital Portal',
};

export default async function PatientDetailPage({ params }) {
  const { id } = params;

  // 1. Fetch Patient details
  const patient = await queryD1First(`
    SELECT p.*, u.email 
    FROM patients p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.id = ?
  `, [id]);

  if (!patient) {
    notFound();
  }

  // 2. Fetch Appointments matching patient's phone
  const appointments = await queryD1(`
    SELECT a.*, doc.name AS doctor_name, doc.speciality AS doctor_speciality
    FROM appointments a
    LEFT JOIN doctors doc ON a.doctor_id = doc.id
    WHERE a.phone = ?
    ORDER BY a.preferred_date DESC
  `, [patient.phone]);

  // 3. Fetch Lab Reports
  const labReports = await queryD1(`
    SELECT * FROM lab_reports
    WHERE patient_id = ?
    ORDER BY uploaded_at DESC
  `, [id]);

  // 4. Fetch Discharge Summaries
  const dischargeSummaries = await queryD1(`
    SELECT * FROM discharge_summaries
    WHERE patient_id = ?
    ORDER BY uploaded_at DESC
  `, [id]);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link 
          href="/dashboard/admin/patients" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
        >
          ← Back to Patients List
        </Link>
      </div>

      {/* Patient Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Profile Details */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-black">
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{patient.name}</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Patient Profile</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">UID</p>
              <p className="text-gray-800 font-medium select-all">{patient.id}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Email Address</p>
              <p className="text-gray-800 font-medium">{patient.email}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Phone Number</p>
              <p className="text-gray-800 font-medium">{patient.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Date of Birth</p>
              <p className="text-gray-800 font-medium">{patient.dob || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Blood Group</p>
              <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-md border mt-0.5 ${
                patient.blood_group 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                {patient.blood_group || 'N/A'}
              </span>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Residential Address</p>
              <p className="text-gray-800 font-medium leading-relaxed">{patient.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* Right Cards: Clinical Timeline Client component */}
        <div className="lg:col-span-2">
          <PatientDetailClient
            patient={patient}
            initialAppointments={appointments}
            initialLabReports={labReports}
            initialDischargeSummaries={dischargeSummaries}
          />
        </div>
      </div>
    </div>
  );
}
