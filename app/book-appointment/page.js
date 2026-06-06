import AppointmentForm from '@/components/AppointmentForm';
import { queryD1 } from '@/lib/d1';
import Link from 'next/link';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

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
  { id: 'doc-003', name: 'Rajesh Khanna', speciality: 'Consultant Cardiologist', department_id: 'dept-cardiology' },
  { id: 'doc-004', name: 'Sunita Rao', speciality: 'Pediatrician', department_id: 'dept-pediatrics' },
  { id: 'doc-005', name: 'Anil Mehta', speciality: 'Senior Neurologist', department_id: 'dept-neurology' },
];

export const metadata = {
  title: `Book an Appointment | ${HOSPITAL_NAME}`,
  description: `Book an appointment online with our medical specialists at ${HOSPITAL_NAME}. Skip the queue and schedule your checkup today.`,
};

export default async function BookAppointmentPage() {
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

  // Double check in case of empty DB response
  if (!departments || departments.length === 0) {
    departments = FALLBACK_DEPARTMENTS;
  }
  if (!doctors || doctors.length === 0) {
    doctors = FALLBACK_DOCTORS;
  }

  return (
    <>
      {/* Header section */}
      <section className="relative py-20 gradient-hero overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book an Appointment</h1>
          <p className="text-lg text-white/70">
            Schedule a visit with one of our specialized doctors quickly and securely.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request an Appointment</h2>
              <p className="text-gray-500 text-sm mb-6">
                Please fill in the form with details of the patient. Mandatory fields are marked with (*).
              </p>
              <AppointmentForm departments={departments} doctors={doctors} />
            </div>

            {/* Sidebar Guidelines Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency reminder */}
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-red-900 text-base mb-2 flex items-center gap-2">
                  <span>🚨</span> Medical Emergency?
                </h3>
                <p className="text-red-700 text-sm leading-relaxed mb-4">
                  If you have a life-threatening emergency, please do not use this booking form. Contact our emergency division immediately.
                </p>
                <a href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}`} className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm">
                  Call Emergency: {process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}
                </a>
              </div>

              {/* Guidelines card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-base mb-3">Important Guidelines</h3>
                <ul className="space-y-3 text-gray-600 text-xs">
                  <li className="flex gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>SMS confirmation:</strong> You will receive a mobile message once your appointment status is updated by our staff.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Check appointment status:</strong> You can track your request at any time using your phone number on our website.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Cancellations:</strong> If you need to cancel or change your appointment, please contact hospital support or write to us at least 24 hours in advance.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
