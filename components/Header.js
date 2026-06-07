'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';
const EMERGENCY_NUMBER = process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/departments', label: 'Departments' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/contact', label: 'Contact' },
  { href: '/book-appointment', label: 'Book Appointment' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const paths = {
      super_admin: '/dashboard/admin',
      doctor: '/dashboard/doctor',
      receptionist: '/dashboard/receptionist',
      patient: '/dashboard/patient',
    };
    return paths[user.role] || '/login';
  };

  return (
    <>
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-650 to-red-700 text-white py-2 px-4 text-center text-sm font-medium z-50 relative shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-100"></span>
          </span>
          <span className="tracking-wide">
            <strong>EMERGENCY?</strong> Call <a href={`tel:${EMERGENCY_NUMBER}`} className="font-extrabold underline underline-offset-4 hover:text-red-100 transition-colors">{EMERGENCY_NUMBER}</a> — 24/7 Rapid Ambulance & Trauma Services
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-lg border-b border-gray-100 shadow-md py-2' 
          : 'bg-white border-b border-gray-50 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300 border border-white/10 glow-primary-soft">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-extrabold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
                  Om Chaudhary Hospital
                </h1>
                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest">
                  & Trauma Centre
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 relative ${
                    pathname === link.href
                      ? 'text-primary-600 bg-primary-50/50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50/50'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-600 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Emergency Phone (Desktop) */}
              <a
                href={`tel:${EMERGENCY_NUMBER}`}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold tracking-wide hover:bg-red-100 hover:scale-102 hover:shadow-sm transition-all glow-red"
              >
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                Emergency: {EMERGENCY_NUMBER}
              </a>

              {/* Auth Buttons */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href={getDashboardLink()} className="btn-primary btn-sm text-xs py-2 px-4">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-ghost btn-sm text-gray-500 text-xs py-2 px-4">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex btn-primary btn-sm text-xs py-2 px-4">
                  Login / Register
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
        }`}>
          <div className="px-4 py-4 space-y-1 bg-white">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            {user ? (
              <>
                <Link href={getDashboardLink()} className="block px-4 py-3 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-3 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
