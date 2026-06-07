'use client';

import Link from 'next/link';
import { 
  IconEmergency, 
  IconCardiology, 
  IconOrthopedics, 
  IconNeurology, 
  IconPediatrics, 
  IconGynecology, 
  IconENT, 
  IconOphthalmology, 
  IconDermatology, 
  IconRadiology, 
  IconPathology, 
  IconGeneralMedicine 
} from '@/components/MedicalIcons';

const DEPT_ICONS = {
  'Emergency & Trauma': IconEmergency,
  'Cardiology': IconCardiology,
  'Orthopedics': IconOrthopedics,
  'Neurology': IconNeurology,
  'Pediatrics': IconPediatrics,
  'Gynecology & Obstetrics': IconGynecology,
  'ENT (Ear, Nose, Throat)': IconENT,
  'Ophthalmology': IconOphthalmology,
  'Dermatology': IconDermatology,
  'Radiology & Imaging': IconRadiology,
  'Pathology & Lab': IconPathology,
  'General Medicine': IconGeneralMedicine,
};

const DEPT_STYLES = {
  'Emergency & Trauma': 'bg-red-50 text-red-600 border-red-100/50 hover:bg-red-100/30',
  'Cardiology': 'bg-rose-50 text-rose-600 border-rose-100/50 hover:bg-rose-100/30',
  'Orthopedics': 'bg-amber-50 text-amber-600 border-amber-100/50 hover:bg-amber-100/30',
  'Neurology': 'bg-purple-50 text-purple-600 border-purple-100/50 hover:bg-purple-100/30',
  'Pediatrics': 'bg-sky-50 text-sky-600 border-sky-100/50 hover:bg-sky-100/30',
  'Gynecology & Obstetrics': 'bg-pink-50 text-pink-600 border-pink-100/50 hover:bg-pink-100/30',
  'ENT (Ear, Nose, Throat)': 'bg-teal-50 text-teal-600 border-teal-100/50 hover:bg-teal-100/30',
  'Ophthalmology': 'bg-indigo-50 text-indigo-600 border-indigo-100/50 hover:bg-indigo-100/30',
  'Dermatology': 'bg-emerald-50 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100/30',
  'Radiology & Imaging': 'bg-violet-50 text-violet-600 border-violet-100/50 hover:bg-violet-100/30',
  'Pathology & Lab': 'bg-green-50 text-green-600 border-green-100/50 hover:bg-green-100/30',
  'General Medicine': 'bg-blue-50 text-blue-600 border-blue-100/50 hover:bg-blue-100/30',
};

export default function DepartmentCard({ department }) {
  const IconComponent = DEPT_ICONS[department.name] || IconGeneralMedicine;
  const styleClasses = DEPT_STYLES[department.name] || 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/30';

  return (
    <div className="group rounded-3xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:border-sarvodaya-blue/30 transition-all duration-300 hover-lift">
      <div className="flex flex-col items-center text-center">
        {/* Icon container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${styleClasses}`}>
          <IconComponent className="w-7 h-7" />
        </div>

        {/* Department Name */}
        <h3 className="text-base font-extrabold text-gray-900 mt-5 mb-2 group-hover:text-sarvodaya-blue transition-colors">
          {department.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-3">
          {department.description || 'Expert healthcare services with advanced technology and experienced specialists.'}
        </p>

        {/* Action Link */}
        <Link
          href="/book-appointment"
          className="inline-flex items-center gap-1.5 text-sarvodaya-blue text-xs font-bold group-hover:gap-2.5 transition-all duration-300"
        >
          Schedule Appointment
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
