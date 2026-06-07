import DepartmentCard from '@/components/DepartmentCard';
import { queryD1 } from '@/lib/d1';
import Link from 'next/link';
import { IconEmergency } from '@/components/MedicalIcons';

export const dynamic = 'force-dynamic';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

const STATIC_DEPARTMENTS = [
  { id: 'dept-emergency', name: 'Emergency & Trauma', description: 'Round-the-clock emergency and trauma care with state-of-the-art equipment and experienced doctors.' },
  { id: 'dept-cardiology', name: 'Cardiology', description: 'Comprehensive heart care including diagnostics, interventional procedures, and cardiac rehabilitation.' },
  { id: 'dept-orthopedics', name: 'Orthopedics', description: 'Expert bone, joint, and spine care with advanced surgical and non-surgical treatment options.' },
  { id: 'dept-neurology', name: 'Neurology', description: 'Specialized care for brain, spinal cord, and nervous system disorders.' },
  { id: 'dept-pediatrics', name: 'Pediatrics', description: 'Compassionate healthcare for infants, children, and adolescents.' },
  { id: 'dept-gynecology', name: 'Gynecology & Obstetrics', description: 'Complete women\'s health services including maternity care and gynecological treatments.' },
  { id: 'dept-ent', name: 'ENT (Ear, Nose, Throat)', description: 'Diagnosis and treatment of ear, nose, and throat conditions.' },
  { id: 'dept-ophthalmology', name: 'Ophthalmology', description: 'Complete eye care including cataract surgery, LASIK, and retinal treatments.' },
  { id: 'dept-dermatology', name: 'Dermatology', description: 'Skin, hair, and nail care with advanced cosmetic and medical dermatology.' },
  { id: 'dept-radiology', name: 'Radiology & Imaging', description: 'Advanced diagnostic imaging including X-ray, CT scan, MRI, and ultrasound.' },
  { id: 'dept-pathology', name: 'Pathology & Lab', description: 'Accurate and timely diagnostic laboratory services.' },
  { id: 'dept-general', name: 'General Medicine', description: 'Primary healthcare and internal medicine for all age groups.' },
];

export const metadata = {
  title: `Medical Departments | ${HOSPITAL_NAME}`,
  description: `Browse all specialized medical departments at ${HOSPITAL_NAME}. We offer trauma care, cardiology, orthopedics, and more.`,
};

export default async function DepartmentsPage() {
  let departments = [];
  try {
    departments = await queryD1('SELECT * FROM departments');
  } catch (error) {
    console.error('Failed to fetch departments from D1, using fallback:', error.message);
    departments = STATIC_DEPARTMENTS;
  }

  // If DB returns empty array for some reason
  if (!departments || departments.length === 0) {
    departments = STATIC_DEPARTMENTS;
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Departments</h1>
          <p className="text-lg text-white/70">
            Comprehensive, specialized medical services designed around your needs.
          </p>
        </div>
      </section>

      {/* Grid of departments */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* Emergency banner section */}
      <section className="py-12 bg-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/15 flex-shrink-0">
              <IconEmergency className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Need Immediate Emergency or Trauma Care?</h2>
              <p className="text-white/80 mt-1">Our emergency department is open 24 hours a day, 30 days a month.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}`} className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors">
              Call {process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
