import AppointmentForm from '@/components/AppointmentForm';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

const FALLBACK_DEPARTMENTS = [
  { id: 'dept-emergency', name: 'Emergency & Trauma' },
  { id: 'dept-cardiology', name: 'Cardiology' },
  { id: 'dept-orthopedics', name: 'Orthopedics' },
  { id: 'dept-neurology', name: 'Neurology' },
  { id: 'dept-pediatrics', name: 'Pediatrics' },
  { id: 'dept-gynecology', name: 'Gynecology & Obstetrics' },
  { id: 'dept-general', name: 'General Medicine' },
];

const FALLBACK_DOCTORS = [
  { id: 'doc-001', name: 'Om Chaudhary', speciality: 'Senior Trauma & Orthopedic Specialist', department_id: 'dept-orthopedics' },
  { id: 'doc-002', name: 'Archana Chaudhary', speciality: 'Senior Gynecologist & Obstetrician', department_id: 'dept-gynecology' },
];

export const metadata = {
  title: 'Book Appointment | Hospital Portal',
};

export default async function ReceptionistBookPage() {
  let departments = [];
  let doctors = [];

  try {
    departments = await queryD1('SELECT id, name FROM departments ORDER BY name ASC');
    doctors = await queryD1('SELECT id, name, speciality, department_id FROM doctors ORDER BY name ASC');
  } catch (error) {
    console.error('Failed to load form data from D1, using fallbacks:', error.message);
    departments = FALLBACK_DEPARTMENTS;
    doctors = FALLBACK_DOCTORS;
  }

  if (!departments || departments.length === 0) {
    departments = FALLBACK_DEPARTMENTS;
  }
  if (!doctors || doctors.length === 0) {
    doctors = FALLBACK_DOCTORS;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Book Patient Appointment</h2>
        <p className="text-gray-500 text-xs mt-0.5">Use this form to manually book an appointment for call-in or walk-in patients.</p>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm max-w-4xl">
        <AppointmentForm departments={departments} doctors={doctors} />
      </div>
    </div>
  );
}
