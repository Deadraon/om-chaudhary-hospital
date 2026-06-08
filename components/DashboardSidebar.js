'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardSidebar({ user = { name: 'User', role: 'patient' } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Attendance states
  const [statusData, setStatusData] = useState({ checkedIn: false, checkInTime: null, checkOutTime: null });
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);

  useEffect(() => {
    if (user.role === 'patient') return;

    setFetchingStatus(true);
    fetch('/api/attendance?today=true')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setStatusData(data);
      })
      .catch(err => console.error('Error fetching today attendance:', err))
      .finally(() => setFetchingStatus(false));
  }, [user.role]);

  const handleCheckIn = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-in' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusData({ checkedIn: true, checkInTime: data.checkInTime, checkOutTime: null, status: 'present' });
      } else {
        alert(data.error || 'Failed to check in');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleCheckOut = async () => {
    if (!confirm('Are you sure you want to Check Out for today?')) return;
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-out' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusData(prev => ({ ...prev, checkOutTime: data.checkOutTime }));
      } else {
        alert(data.error || 'Failed to check out');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setLoadingStatus(false);
    }
  };

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
      { name: 'Attendance Roster', href: '/dashboard/admin/attendance', icon: '📝' },
    ],
    doctor: [
      { name: 'My Schedule', href: '/dashboard/doctor', icon: '📅' },
      { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: '🗒️' },
      { name: 'My Attendance', href: '/dashboard/doctor/attendance', icon: '📝' },
    ],
    receptionist: [
      { name: 'Overview', href: '/dashboard/receptionist', icon: '📋' },
      { name: 'Appointments', href: '/dashboard/receptionist/appointments', icon: '🗓️' },
      { name: 'Book Appointment', href: '/dashboard/receptionist/book', icon: '➕' },
      { name: 'My Attendance', href: '/dashboard/receptionist/attendance', icon: '📝' },
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
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 lg:min-h-screen flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
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

        {/* User Card & Attendance Widget */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-white font-bold text-sm truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold">{roleDisplayNames[user.role] || user.role}</p>
            </div>
          </div>

          {/* Attendance Widget for staff members */}
          {user.role !== 'patient' && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">⏱ Work Shift</span>
                {!fetchingStatus && statusData.checkedIn && (
                  <span className={`w-2 h-2 rounded-full ${statusData.checkOutTime ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                )}
              </div>

              {fetchingStatus ? (
                <div className="text-[10px] text-slate-500 italic">Syncing shift...</div>
              ) : (
                <div className="space-y-2">
                  {!statusData.checkedIn ? (
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-400 font-medium">You are not checked in.</p>
                      <button
                        onClick={handleCheckIn}
                        disabled={loadingStatus}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                      >
                        {loadingStatus ? 'Processing...' : '⚡ Check In'}
                      </button>
                    </div>
                  ) : !statusData.checkOutTime ? (
                    <div className="space-y-2">
                      <div className="text-[10px] space-y-0.5">
                        <p className="text-slate-450">In Time:</p>
                        <p className="text-white font-black text-xs">{statusData.checkInTime}</p>
                      </div>
                      <button
                        onClick={handleCheckOut}
                        disabled={loadingStatus}
                        className="w-full py-2 bg-sarvodaya-orange hover:bg-sarvodaya-orange-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                      >
                        {loadingStatus ? 'Processing...' : '🚪 Check Out'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Check-In:</span>
                        <span className="text-white font-bold">{statusData.checkInTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-Out:</span>
                        <span className="text-white font-bold">{statusData.checkOutTime}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 text-center font-bold text-slate-500 text-[9px] uppercase tracking-wider">
                        Shift Ended
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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

