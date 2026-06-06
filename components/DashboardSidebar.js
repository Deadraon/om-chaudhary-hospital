'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardSidebar({ user = { name: 'User', role: 'patient' } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      setLoggingOut(true);
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          router.push('/login');
          router.refresh();
        } else {
          alert('Failed to log out. Please try again.');
        }
      } catch (err) {
        alert('Network error. Please try again.');
      } finally {
        setLoggingOut(false);
      }
    }
  };

  // Define navigation items based on roles
  const navItems = {
    super_admin: [
      { name: 'Overview', href: '/dashboard/admin', icon: '📊' },
      { name: 'Appointments', href: '/dashboard/admin/appointments', icon: '🗓️' },
      { name: 'Doctors', href: '/dashboard/admin/doctors', icon: '👨‍⚕️' },
      { name: 'Staff Management', href: '/dashboard/admin/staff', icon: '👥' },
      { name: 'Patients', href: '/dashboard/admin/patients', icon: '🩹' },
    ],
    doctor: [
      { name: 'My Schedule', href: '/dashboard/doctor', icon: '📅' },
      { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: '🗒️' },
    ],
    receptionist: [
      { name: 'Overview', href: '/dashboard/receptionist', icon: '📋' },
      { name: 'Appointments', href: '/dashboard/receptionist/appointments', icon: '🗓️' },
      { name: 'Book Appointment', href: '/dashboard/receptionist/book', icon: '➕' },
    ],
    patient: [
      { name: 'My Profile', href: '/dashboard/patient', icon: '👤' },
      { name: 'Appointments', href: '/dashboard/patient/appointments', icon: '🗓️' },
      { name: 'Lab Reports', href: '/dashboard/patient/reports', icon: '🔬' },
    ],
  };

  const items = navItems[user.role] || [];
  const roleDisplayNames = {
    super_admin: 'Administrator',
    doctor: 'Doctor',
    receptionist: 'Receptionist',
    patient: 'Patient',
  };

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 lg:min-h-screen flex flex-col justify-between border-r border-slate-800">
      {/* Upper part: brand & navigation */}
      <div>
        {/* Hospital Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide leading-tight">Om Chaudhary</h1>
            <p className="text-[10px] text-primary-400 font-semibold uppercase tracking-wider">Hospital Portal</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-white font-bold text-sm truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold">{roleDisplayNames[user.role] || user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Lower part: logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <span>🚪</span>
          <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  );
}
