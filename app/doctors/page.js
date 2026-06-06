import DoctorsClient from './DoctorsClient';
import { queryD1 } from '@/lib/d1';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

const STATIC_DEPARTMENTS = [
  { id: 'dept-emergency', name: 'Emergency & Trauma' },
  { id: 'dept-cardiology', name: 'Cardiology' },
  { id: 'dept-orthopedics', name: 'Orthopedics' },
  { id: 'dept-neurology', name: 'Neurology' },
  { id: 'dept-pediatrics', name: 'Pediatrics' },
  { id: 'dept-gynecology', name: 'Gynecology & Obstetrics' },
  { id: 'dept-ent', name: 'ENT (Ear, Nose, Throat)' },
  { id: 'dept-ophthalmology', name: 'Ophthalmology' },
  { id: 'dept-dermatology', name: 'Dermatology' },
  { id: 'dept-radiology', name: 'Radiology & Imaging' },
  { id: 'dept-pathology', name: 'Pathology & Lab' },
  { id: 'dept-general', name: 'General Medicine' },
];

const STATIC_DOCTORS = [
  {
    id: 'doc-001',
    name: 'Om Chaudhary',
    speciality: 'Senior Trauma & Orthopedic Specialist',
    experience: '20+ Years',
    department_id: 'dept-orthopedics',
    department_name: 'Orthopedics',
    photo_r2_key: null,
  },
  {
    id: 'doc-002',
    name: 'Archana Chaudhary',
    speciality: 'Senior Gynecologist & Obstetrician',
    experience: '18+ Years',
    department_id: 'dept-gynecology',
    department_name: 'Gynecology & Obstetrics',
    photo_r2_key: null,
  },
  {
    id: 'doc-003',
    name: 'Rajesh Khanna',
    speciality: 'Consultant Cardiologist',
    experience: '15 Years',
    department_id: 'dept-cardiology',
    department_name: 'Cardiology',
    photo_r2_key: null,
  },
  {
    id: 'doc-004',
    name: 'Sunita Rao',
    speciality: 'Pediatrician',
    experience: '10 Years',
    department_id: 'dept-pediatrics',
    department_name: 'Pediatrics',
    photo_r2_key: null,
  },
  {
    id: 'doc-005',
    name: 'Anil Mehta',
    speciality: 'Senior Neurologist',
    experience: '16 Years',
    department_id: 'dept-neurology',
    department_name: 'Neurology',
    photo_r2_key: null,
  },
  {
    id: 'doc-006',
    name: 'Preeti Patel',
    speciality: 'Dermatologist',
    experience: '8 Years',
    department_id: 'dept-dermatology',
    department_name: 'Dermatology',
    photo_r2_key: null,
  },
];

export const metadata = {
  title: `Our Medical Team | ${HOSPITAL_NAME}`,
  description: `Meet the expert doctors and medical specialists at ${HOSPITAL_NAME}. Filter by specialty to find the right care for you.`,
};

export default async function DoctorsPage() {
  let doctors = [];
  let departments = [];

  try {
    // Fetch doctors and join with department name
    doctors = await queryD1(`
      SELECT d.*, dept.name AS department_name
      FROM doctors d
      LEFT JOIN departments dept ON d.department_id = dept.id
    `);

    departments = await queryD1('SELECT id, name FROM departments');
  } catch (error) {
    console.error('Failed to fetch doctors/departments from D1, using fallback:', error.message);
    doctors = STATIC_DOCTORS;
    departments = STATIC_DEPARTMENTS;
  }

  // Fallback to static data if database returned empty results
  if (!doctors || doctors.length === 0) {
    doctors = STATIC_DOCTORS;
  }
  if (!departments || departments.length === 0) {
    departments = STATIC_DEPARTMENTS;
  }

  return (
    <>
      {/* Page Header */}
      <section className="relative py-20 gradient-hero overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Medical Specialists</h1>
          <p className="text-lg text-white/70">
            Highly qualified and dedicated professionals committed to your health and wellness.
          </p>
        </div>
      </section>

      {/* Interactive Doctors List */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorsClient initialDoctors={doctors} departments={departments} />
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="section bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl text-2xl mb-6">
            🩺
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Join Our Medical Team</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Are you a dedicated medical professional looking to make a difference? We are always seeking talented doctors and staff to join our growing family.
          </p>
          <Link href="/contact" className="btn-secondary">
            Contact Administration
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
