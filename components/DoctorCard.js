'use client';

export default function DoctorCard({ doctor }) {
  const photoUrl = doctor.photo_r2_key
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''}/${doctor.photo_r2_key}`
    : null;

  return (
    <div className="card group">
      {/* Photo */}
      <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={doctor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Info */}
      <div className="card-body text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Dr. {doctor.name}</h3>
        <p className="text-primary-600 font-medium text-sm mb-2">{doctor.speciality || 'General Physician'}</p>
        {doctor.department_name && (
          <p className="text-gray-500 text-xs mb-3 flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {doctor.department_name}
          </p>
        )}
        {doctor.experience && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {doctor.experience} Experience
          </div>
        )}
      </div>
    </div>
  );
}
