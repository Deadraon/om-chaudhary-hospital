'use client';

import { useState, useMemo } from 'react';
import DoctorCard from '@/components/DoctorCard';

export default function DoctorsClient({ initialDoctors = [], departments = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const filteredDoctors = useMemo(() => {
    return initialDoctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.speciality && doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDept = selectedDept === '' || doc.department_id === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept, initialDoctors]);

  return (
    <div className="space-y-10">
      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search bar */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            id="doctor-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11"
            placeholder="Search by doctor name or speciality..."
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Department filter */}
        <div className="w-full md:w-64">
          <select
            id="doctor-dept-filter"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="input-field"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid count & empty state */}
      <div>
        <p className="text-gray-500 text-sm mb-6 font-medium">
          Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
        </p>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white text-center py-16 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🔎
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No doctors found</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              We couldn't find any doctor matching your search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
