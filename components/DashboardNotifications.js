'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function DashboardNotifications({ role }) {
  const [counts, setCounts] = useState({ appointments: 0, opinions: 0, patientsToday: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isStaff = ['super_admin', 'receptionist'].includes(role);

  useEffect(() => {
    if (!isStaff) return;

    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch (err) {
        console.error('Error fetching notification counts:', err);
      }
    };

    fetchCounts();
    // Poll every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [isStaff]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!isStaff) return null;

  const totalUnread = counts.appointments + counts.opinions + counts.patientsToday;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-2xl bg-white border border-gray-150 shadow-inner flex items-center justify-center text-lg hover:bg-gray-50 transition-colors relative"
        title="Notifications"
        aria-label="View notifications"
      >
        <span>🔔</span>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-black text-[9px] rounded-full flex items-center justify-center border border-white animate-bounce">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-xl z-50 animate-scale-in p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Alert Center</h4>
            <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full">
              {totalUnread} New
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Appointments */}
            <Link
              href="/dashboard/admin/appointments"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🗓️</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Pending Appointments</p>
                  <p className="text-[10px] text-gray-400 font-medium">Require approval/roster assignment</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${counts.appointments > 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                {counts.appointments}
              </span>
            </Link>

            {/* Second Opinions */}
            <Link
              href="/dashboard/admin/second-opinions"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">📥</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Second Opinions</p>
                  <p className="text-[10px] text-gray-400 font-medium">Unreviewed clinical submissions</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${counts.opinions > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-500'}`}>
                {counts.opinions}
              </span>
            </Link>

            {/* Patients Today */}
            <Link
              href="/dashboard/admin/patients"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">👥</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">New Patients Today</p>
                  <p className="text-[10px] text-gray-400 font-medium">Signed up in the last 24 hours</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${counts.patientsToday > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                {counts.patientsToday}
              </span>
            </Link>
          </div>

          {totalUnread === 0 && (
            <div className="py-4 text-center text-xs text-gray-400 italic">
              All caught up! No pending alerts.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
