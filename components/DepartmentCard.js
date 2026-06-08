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
  'Emergency & Trauma': 'bg-red-50 text-red-600 border-red-100/50',
  'Cardiology': 'bg-rose-50 text-rose-600 border-rose-100/50',
  'Orthopedics': 'bg-amber-50 text-amber-600 border-amber-100/50',
  'Neurology': 'bg-purple-50 text-purple-600 border-purple-100/50',
  'Pediatrics': 'bg-sky-50 text-sky-600 border-sky-100/50',
  'Gynecology & Obstetrics': 'bg-pink-50 text-pink-600 border-pink-100/50',
  'ENT (Ear, Nose, Throat)': 'bg-teal-50 text-teal-600 border-teal-100/50',
  'Ophthalmology': 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
  'Dermatology': 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
  'Radiology & Imaging': 'bg-violet-50 text-violet-600 border-violet-100/50',
  'Pathology & Lab': 'bg-green-50 text-green-600 border-green-100/50',
  'General Medicine': 'bg-blue-50 text-blue-600 border-blue-100/50',
};

const DEPT_TREATMENTS = {
  'Emergency & Trauma': ['Trauma Resuscitation', 'Fracture Stabilization', 'Emergency Surgery', 'Ambulance Services'],
  'Cardiology': ['Angioplasty & Stenting', 'ECG & Echo Diagnostics', 'Cardiac Rehabilitation', 'Heart Failure Management'],
  'Orthopedics': ['Joint Replacement', 'Spine Surgery', 'Arthroscopy', 'Sports Injury Rehab'],
  'Neurology': ['Brain Stroke Management', 'Epilepsy Treatment', 'Nerve Conduction Study', 'Headache & Migraine Clinic'],
  'Pediatrics': ['Neonatal ICU (NICU)', 'Child Vaccination', 'Growth & Development', 'Pediatric Surgery'],
  'Gynecology & Obstetrics': ['High-Risk Pregnancy', 'Normal & C-Section Delivery', 'Laparoscopic Surgery', 'Infertility Counseling'],
  'ENT (Ear, Nose, Throat)': ['Sinusitis Treatment', 'Tonsillectomy', 'Ear Microsurgery', 'Voice & Throat Disorders'],
  'Ophthalmology': ['Cataract Surgery', 'Glaucoma Management', 'Retinal Treatment', 'Eye Checkups & Glasses'],
  'Dermatology': ['Skin Allergy Treatment', 'Acne & Psoriasis', 'Hair Loss (PRP Therapy)', 'Cosmetic Dermatology'],
  'Radiology & Imaging': ['CT Scan', 'Digital X-Ray', 'Ultrasound (USG)', 'MRI Imaging'],
  'Pathology & Lab': ['Blood Panel (CBC)', 'Liver & Kidney Tests', 'Hormone Assay', 'Biopsy & Histopathology'],
  'General Medicine': ['Diabetes Management', 'Hypertension Care', 'Fever & Infection', 'Preventive Health Checkup'],
};

export default function DepartmentCard({ department }) {
  const IconComponent = DEPT_ICONS[department.name] || IconGeneralMedicine;
  const styleClasses = DEPT_STYLES[department.name] || 'bg-blue-50 text-blue-600 border-blue-100';
  const treatments = DEPT_TREATMENTS[department.name] || [];

  return (
    <div className="group rounded-3xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:border-sarvodaya-blue/30 transition-all duration-300 hover-lift flex flex-col">
      <div className="flex flex-col items-center text-center flex-1">
        {/* Icon container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${styleClasses}`}>
          <IconComponent className="w-7 h-7" />
        </div>

        {/* Department Name */}
        <h3 className="text-base font-extrabold text-gray-900 mt-4 mb-2 group-hover:text-sarvodaya-blue transition-colors">
          {department.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
          {department.description || 'Expert healthcare services with advanced technology and experienced specialists.'}
        </p>

        {/* Key Treatments List */}
        {treatments.length > 0 && (
          <div className="w-full mb-5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 text-left">Key Treatments</p>
            <ul className="space-y-1.5">
              {treatments.slice(0, 4).map((treatment) => (
                <li key={treatment} className="flex items-center gap-2 text-left">
                  <svg className="w-3 h-3 text-sarvodaya-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[11px] text-gray-600 font-medium">{treatment}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Link */}
        <Link
          href="/book-appointment"
          className="mt-auto inline-flex items-center gap-1.5 text-sarvodaya-blue text-xs font-bold group-hover:gap-2.5 transition-all duration-300"
        >
          Book Appointment
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
