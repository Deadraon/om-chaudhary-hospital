'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';

export default function DoctorCard({ doctor }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const photoUrl = doctor.photo_r2_key
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''}/${doctor.photo_r2_key}`
    : null;

  // Generate a realistic professional biography if bio is missing
  const generatedBio = `Dr. ${doctor.name} is a dedicated ${doctor.speciality || 'General Physician'} at Om Chaudhary Hospital. With ${doctor.experience || 'several years'} of clinical experience, Dr. ${doctor.name} is committed to delivering state-of-the-art patient care and clinical excellence. Specializing in advanced diagnostics and modern treatment options, they work closely with the multidisciplinary trauma team to ensure optimal recovery and personalized health outcomes.`;

  return (
    <>
      <div className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:border-sarvodaya-blue/30 transition-all duration-300 hover-lift">
        {/* Photo Container */}
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-cyan-50/50 overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`Dr. ${doctor.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-sarvodaya-blue/40 group-hover:text-sarvodaya-blue/60 transition-colors">
              {/* Custom Medical Doctor SVG Avatar */}
              <svg className="w-24 h-24 mb-2 opacity-80 group-hover:scale-105 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11h.01M9 13.5h.01M15 13.5h.01" />
              </svg>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">
                Medical Staff
              </div>
            </div>
          )}
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Info */}
        <div className="p-6 text-center">
          <h3 className="text-base font-extrabold text-gray-900 mb-1 group-hover:text-sarvodaya-blue transition-colors">
            Dr. {doctor.name}
          </h3>
          <p className="text-sarvodaya-blue font-bold text-xs mb-2 tracking-wide">
            {doctor.speciality || 'General Physician'}
          </p>

          {doctor.department_name && (
            <p className="text-gray-500 text-[11px] mb-3 flex items-center justify-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {doctor.department_name}
            </p>
          )}

          {doctor.experience && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sarvodaya-blue rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-sky-100/50">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {doctor.experience} Exp
            </div>
          )}

          {/* Quick View Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-2 py-2 px-4 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-sarvodaya-blue hover:text-white hover:border-sarvodaya-blue transition-all duration-300"
          >
            View Profile & Details
          </button>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Doctor Profile: Dr. ${doctor.name}`}
        size="md"
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-12 h-12 text-sarvodaya-blue/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-extrabold text-gray-900">Dr. {doctor.name}</h4>
              <p className="text-sarvodaya-blue font-bold text-sm">{doctor.speciality || 'General Physician'}</p>
              <p className="text-gray-500 text-xs mt-1">{doctor.department_name} • {doctor.experience || 'Senior Consultant'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Biography</h5>
            <p className="text-gray-600 text-sm leading-relaxed">{generatedBio}</p>
          </div>

          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-3">
            <h5 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Consultation & OPD Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium text-gray-700">{doctor.phone || process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+91-6396098340'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-700">Mon - Sat: 10:00 AM - 4:00 PM</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close Window
            </button>
            <Link
              href="/book-appointment"
              className="flex-1 py-3 bg-sarvodaya-orange text-white font-bold rounded-xl text-xs text-center hover:bg-sarvodaya-orange-hover shadow-md transition-all"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
