'use client';

import Link from 'next/link';

const DEPT_ICONS = {
  'Emergency & Trauma': '🚑',
  'Cardiology': '❤️',
  'Orthopedics': '🦴',
  'Neurology': '🧠',
  'Pediatrics': '👶',
  'Gynecology & Obstetrics': '🤰',
  'ENT (Ear, Nose, Throat)': '👂',
  'Ophthalmology': '👁️',
  'Dermatology': '🧴',
  'Radiology & Imaging': '📡',
  'Pathology & Lab': '🔬',
  'General Medicine': '🩺',
};

const DEPT_COLORS = {
  'Emergency & Trauma': 'from-red-500 to-orange-500',
  'Cardiology': 'from-pink-500 to-red-500',
  'Orthopedics': 'from-amber-500 to-yellow-500',
  'Neurology': 'from-purple-500 to-indigo-500',
  'Pediatrics': 'from-sky-500 to-blue-500',
  'Gynecology & Obstetrics': 'from-rose-500 to-pink-500',
  'ENT (Ear, Nose, Throat)': 'from-teal-500 to-cyan-500',
  'Ophthalmology': 'from-blue-500 to-indigo-500',
  'Dermatology': 'from-emerald-500 to-teal-500',
  'Radiology & Imaging': 'from-violet-500 to-purple-500',
  'Pathology & Lab': 'from-green-500 to-emerald-500',
  'General Medicine': 'from-primary-500 to-primary-700',
};

export default function DepartmentCard({ department }) {
  const icon = DEPT_ICONS[department.name] || '🏥';
  const gradient = DEPT_COLORS[department.name] || 'from-primary-500 to-primary-700';

  return (
    <div className="card group cursor-pointer">
      <div className="card-body flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {department.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {department.description || 'Expert healthcare services with advanced technology and experienced specialists.'}
        </p>

        {/* CTA */}
        <Link
          href="/book-appointment"
          className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold group-hover:gap-2.5 transition-all duration-300"
        >
          Book Now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
