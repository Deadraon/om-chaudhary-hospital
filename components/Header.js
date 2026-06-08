'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Modal from '@/components/Modal';
import HospitalLogo from '@/components/HospitalLogo';

const EMERGENCY_NUMBER = process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108';
const HOSPITAL_PHONE = process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+91-6396098340';
const HOSPITAL_ADDRESS = process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || 'Najibabad - Haridwar Road, Mandawali, Bijnor, Uttar Pradesh - 246749';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/departments', label: 'Specialities' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // New features state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChairmanOpen, setIsChairmanOpen] = useState(false);
  
  // Form submission states
  const [secondOpinionData, setSecondOpinionData] = useState({ name: '', phone: '', specialty: '', fileName: '' });
  const [secondOpinionSuccess, setSecondOpinionSuccess] = useState(false);
  const [secondOpinionFile, setSecondOpinionFile] = useState(null);
  const [submittingSecondOpinion, setSubmittingSecondOpinion] = useState(false);
  const [chairmanData, setChairmanData] = useState({ name: '', email: '', message: '' });
  const [chairmanSuccess, setChairmanSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDrawerOpen(false);
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

  // Submit handlers
  const handleSecondOpinionSubmit = async (e) => {
    e.preventDefault();
    setSubmittingSecondOpinion(true);
    try {
      const formData = new FormData();
      formData.append('name', secondOpinionData.name);
      formData.append('phone', secondOpinionData.phone);
      formData.append('specialty', secondOpinionData.specialty);
      if (secondOpinionFile) {
        formData.append('file', secondOpinionFile);
      }

      const res = await fetch('/api/second-opinions', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSecondOpinionSuccess(true);
        setSecondOpinionFile(null);
        setTimeout(() => {
          setSecondOpinionSuccess(false);
          setSecondOpinionData({ name: '', phone: '', specialty: '', fileName: '' });
          setIsDrawerOpen(false);
        }, 3000);
      } else {
        alert(data.error || 'Failed to submit report.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setSubmittingSecondOpinion(false);
    }
  };

  const handleChairmanSubmit = (e) => {
    e.preventDefault();
    setChairmanSuccess(true);
    setTimeout(() => {
      setChairmanSuccess(false);
      setChairmanData({ name: '', email: '', message: '' });
      setIsChairmanOpen(false);
    }, 4000);
  };

  return (
    <>
      {/* ==================== DOUBLE HEADER: TOP SUB-HEADER BAR ==================== */}
      <div className="bg-sarvodaya-dark text-white py-2 px-4 z-50 relative border-b border-white/5 text-[11px] md:text-xs">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Get Second Opinion Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsDrawerOpen(!isDrawerOpen);
                setSecondOpinionSuccess(false);
              }}
              className="flex items-center gap-1.5 font-bold hover:text-sarvodaya-blue transition-colors text-white"
            >
              <span className="w-2 h-2 rounded-full bg-sarvodaya-orange animate-pulse"></span>
              Get Second Opinion By Experts
              <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDrawerOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span className="hidden sm:inline text-white/20">|</span>
            {/* Middle: Write to Chairman Trigger */}
            <button
              onClick={() => {
                setIsChairmanOpen(true);
                setChairmanSuccess(false);
              }}
              className="hover:text-sarvodaya-blue transition-colors font-bold text-white flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Write to Chairman
            </button>
          </div>

          {/* Right: Location & Emergency Info */}
          <div className="flex items-center gap-4 text-white/90 font-bold uppercase tracking-wider text-[9px] md:text-[10px]">
            <a
              href="https://maps.app.goo.gl/KwSsx1e6XA5gDYY87"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 hover:text-cyan-350 transition-colors"
            >
              <span>📍</span> {HOSPITAL_ADDRESS.split(',').slice(0, 3).join(',')}
            </a>
            <span className="hidden xl:inline text-white/20">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span>📞</span> <a href={`tel:${HOSPITAL_PHONE}`} className="hover:text-cyan-300 transition-colors">{HOSPITAL_PHONE}</a>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Emergency Active
            </div>
          </div>
        </div>
      </div>

      {/* ==================== RETRACTABLE SECOND OPINION DRAWER ==================== */}
      <div className={`transition-all duration-500 overflow-hidden bg-slate-900 text-white relative z-40 border-b border-slate-800 ${
        isDrawerOpen ? 'max-h-[500px] py-6' : 'max-h-0'
      }`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="border border-white/10 rounded-2xl p-6 bg-slate-950/50">
            <h3 className="text-sm md:text-base font-extrabold text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sarvodaya-blue"></span>
              Upload Medical Reports for a Specialist Second Opinion
            </h3>
            <p className="text-[11px] text-gray-400 mb-6 max-w-xl">
              Get diagnostic confirmation and treatment reviews from senior clinical consultants. Fill in the form and attach your prescription or radiology PDF scans.
            </p>

            {secondOpinionSuccess ? (
              <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-4 text-center space-y-1">
                <p className="text-emerald-400 font-bold text-xs sm:text-sm">✓ Report Submitted Successfully!</p>
                <p className="text-gray-300 text-xs">Our clinical coordinator will call you back on your registered phone within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSecondOpinionSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={secondOpinionData.name}
                    onChange={e => setSecondOpinionData({ ...secondOpinionData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sarvodaya-blue"
                    placeholder="Patient Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={secondOpinionData.phone}
                    onChange={e => setSecondOpinionData({ ...secondOpinionData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sarvodaya-blue"
                    placeholder="10-digit mobile"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Choose Specialty *</label>
                  <select
                    required
                    value={secondOpinionData.specialty}
                    onChange={e => setSecondOpinionData({ ...secondOpinionData, specialty: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sarvodaya-blue"
                  >
                    <option value="">Choose Speciality</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Gynecology">Gynecology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Upload Reports *</label>
                  <input
                    type="file"
                    required
                    onChange={e => {
                      setSecondOpinionFile(e.target.files[0]);
                      setSecondOpinionData({ ...secondOpinionData, fileName: e.target.files[0]?.name || '' });
                    }}
                    className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                  />
                </div>
                <div className="sm:col-span-4 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="py-2 px-4 rounded-xl text-xs text-gray-400 hover:text-white"
                    disabled={submittingSecondOpinion}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingSecondOpinion}
                    className="py-2 px-6 bg-sarvodaya-blue hover:bg-sarvodaya-dark text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                  >
                    {submittingSecondOpinion ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ==================== MAIN HEADER & NAVBAR ==================== */}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-150 shadow-md py-2' 
          : 'bg-white border-b border-gray-50 py-4.5'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <HospitalLogo variant="light" size="md" />
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 flex-shrink-0">
              {/* Home */}
              <Link href="/" className={`px-2.5 py-1.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 relative whitespace-nowrap ${pathname === '/' ? 'text-sarvodaya-blue bg-primary-50/50' : 'text-gray-650 hover:text-sarvodaya-blue hover:bg-gray-50/50'}`}>
                Home
              </Link>
              
              {/* About Us */}
              <Link href="/about" className={`px-2.5 py-1.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 relative whitespace-nowrap ${pathname === '/about' ? 'text-sarvodaya-blue bg-primary-50/50' : 'text-gray-655 hover:text-sarvodaya-blue hover:bg-gray-50/50'}`}>
                About
              </Link>

              {/* Doctors */}
              <Link href="/doctors" className={`px-2.5 py-1.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 relative whitespace-nowrap ${pathname === '/doctors' ? 'text-sarvodaya-blue bg-primary-50/50' : 'text-gray-655 hover:text-sarvodaya-blue hover:bg-gray-50/50'}`}>
                Doctors
              </Link>

              {/* Specialities Hover Mega Menu */}
              <div className="relative group py-4">
                <button className="px-2.5 py-1.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 relative text-gray-655 hover:text-sarvodaya-blue flex items-center gap-1 whitespace-nowrap">
                  Specialties
                  <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[600px] bg-white border border-gray-150 rounded-2xl shadow-2xl p-5 grid grid-cols-3 gap-5 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
                  <div>
                    <h4 className="text-xs font-black text-sarvodaya-dark uppercase tracking-wider pb-1.5 border-b border-gray-100 mb-2">Centres of Excellence</h4>
                    <ul className="space-y-1.5 text-xs font-semibold text-gray-600">
                      <li><Link href="/departments" className="hover:text-sarvodaya-blue block">Emergency & Trauma</Link></li>
                      <li><Link href="/departments" className="hover:text-sarvodaya-blue block">Cardiology Sciences</Link></li>
                      <li><Link href="/departments" className="hover:text-sarvodaya-blue block">Orthopedic Clinic</Link></li>
                      <li><Link href="/departments" className="hover:text-sarvodaya-blue block">Neurology & Spine</Link></li>
                      <li><Link href="/departments" className="hover:text-sarvodaya-blue block">Pediatrics & Neonatal</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sarvodaya-dark uppercase tracking-wider pb-1.5 border-b border-gray-100 mb-2">Key Treatments</h4>
                    <ul className="space-y-1.5 text-xs text-gray-550 font-medium">
                      <li><Link href="/book-appointment" className="hover:text-sarvodaya-blue block">Joint Replacement</Link></li>
                      <li><Link href="/book-appointment" className="hover:text-sarvodaya-blue block">Angioplasty & Bypass</Link></li>
                      <li><Link href="/book-appointment" className="hover:text-sarvodaya-blue block">Awake Brain Surgery</Link></li>
                      <li><Link href="/book-appointment" className="hover:text-sarvodaya-blue block">High-Risk Pregnancy</Link></li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-wider mb-1">Diagnostics Desk</h4>
                      <p className="text-[9px] text-gray-500 leading-relaxed">Fast path reports, advanced MRI and blood screening active 24/7.</p>
                    </div>
                    <Link href="/appointment-status" className="mt-3 w-full py-2 bg-sarvodaya-blue text-white text-[10px] font-bold text-center rounded-lg hover:bg-sarvodaya-dark shadow-sm transition-colors">
                      Check Lab Reports
                    </Link>
                  </div>
                </div>
              </div>



              {/* Contact */}
              <Link href="/contact" className={`px-2.5 py-1.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 relative whitespace-nowrap ${pathname === '/contact' ? 'text-sarvodaya-blue bg-primary-50/50' : 'text-gray-655 hover:text-sarvodaya-blue hover:bg-gray-50/50'}`}>
                Contact
              </Link>

            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
              {/* Emergency Hotline (Desktop XL - Compact version to save width) */}
              <a
                href={`tel:${EMERGENCY_NUMBER}`}
                className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-650 rounded-xl text-[11px] font-black tracking-wide hover:bg-red-100 hover:scale-105 hover:shadow-sm transition-all whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse flex-shrink-0"></span>
                Emergency Call: {EMERGENCY_NUMBER}
              </a>

              {/* Book Appointment CTA Button */}
              <Link
                href="/book-appointment"
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 bg-sarvodaya-orange text-white text-[11px] font-black rounded-xl hover:bg-sarvodaya-orange-hover hover:scale-105 hover:shadow-md transition-all whitespace-nowrap shadow-sm"
              >
                Book Appointment
              </Link>

              {/* Auth Buttons */}
              {user ? (
                <div className="hidden md:flex items-center gap-1">
                  <Link href={getDashboardLink()} className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-200 text-gray-700 text-[11px] font-black rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 text-[11px] font-black px-1.5 py-1.5 transition-colors whitespace-nowrap">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:inline-flex items-center justify-center px-3 py-1.5 border border-gray-200 text-gray-700 text-[11px] font-black rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Login
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
                    ? 'text-sarvodaya-blue bg-primary-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book-appointment"
              className={`block px-4 py-3 rounded-xl text-sm font-bold text-white bg-sarvodaya-orange transition-colors`}
            >
              Book Appointment
            </Link>
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-sarvodaya-orange animate-pulse"></span>
              Get Second Opinion
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsChairmanOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
              </svg>
              Write to Chairman
            </button>

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

      {/* ==================== WRITE TO CHAIRMAN MODAL ==================== */}
      <Modal
        isOpen={isChairmanOpen}
        onClose={() => setIsChairmanOpen(false)}
        title="Direct Message to Hospital Chairman"
        size="md"
      >
        {chairmanSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <p className="text-emerald-700 font-extrabold text-base">✓ Grievance / Feedback Registered!</p>
            <p className="text-gray-500 text-xs leading-relaxed">Your message has been securely sent directly to the chairman\'s office. We value your feedback and will review this with clinical directors immediately.</p>
          </div>
        ) : (
          <form onSubmit={handleChairmanSubmit} className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Write directly to our Chairman for feedback, quality issues, or clinical recommendations. Your message is monitored directly by executive leadership.
            </p>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-700 font-bold mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={chairmanData.name}
                onChange={e => setChairmanData({ ...chairmanData, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-sarvodaya-blue"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-700 font-bold mb-1">Your Email Address *</label>
              <input
                type="email"
                required
                value={chairmanData.email}
                onChange={e => setChairmanData({ ...chairmanData, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-sarvodaya-blue"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-700 font-bold mb-1">Message Content *</label>
              <textarea
                required
                rows={4}
                value={chairmanData.message}
                onChange={e => setChairmanData({ ...chairmanData, message: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-sarvodaya-blue"
                placeholder="Please write your detailed feedback or grievance here..."
              ></textarea>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsChairmanOpen(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-sarvodaya-dark text-white font-bold rounded-xl text-xs hover:bg-slate-800 shadow-md"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
