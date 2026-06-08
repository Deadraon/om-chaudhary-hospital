'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IconEmergency } from '@/components/MedicalIcons';
import HospitalLogo from '@/components/HospitalLogo';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';
const EMERGENCY_NUMBER = process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108';
const HOSPITAL_PHONE = process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+91-6396098340';
const HOSPITAL_EMAIL = process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || 'info@omchaudharyhospital.com';
const HOSPITAL_ADDRESS = process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || 'Najibabad - Haridwar Road, Mandawali, Bijnor, Uttar Pradesh - 246749';

const SOCIAL_FACEBOOK = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#';
const SOCIAL_INSTAGRAM = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#';
const SOCIAL_YOUTUBE = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#';

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/departments', label: 'Departments' },
  { href: '/doctors', label: 'Our Doctors' },
  { href: '/book-appointment', label: 'Book Appointment' },
  { href: '/appointment-status', label: 'Check Appointment' },
  { href: '/contact', label: 'Contact Us' },
];

const departments = [
  'Emergency & Trauma',
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Pediatrics',
  'General Medicine',
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/invoice') || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#0f465c] to-[#082a38] text-slate-200">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card-dark p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Need Medical Assistance?</h3>
              <p className="text-gray-400">Our team of expert doctors is ready to help you 24/7</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book-appointment" className="btn-orange btn-lg whitespace-nowrap">
                Book Appointment
              </Link>
              <a href={`tel:${EMERGENCY_NUMBER}`} className="btn-danger btn-lg whitespace-nowrap flex items-center justify-center gap-2">
                <IconEmergency className="w-5 h-5 text-white" />
                Emergency: {EMERGENCY_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Hospital Info */}
          <div className="lg:col-span-1">
            <HospitalLogo variant="dark" size="md" className="mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Providing compassionate, world-class healthcare services with state-of-the-art technology and a team of dedicated medical professionals.
            </p>
            {/* Social Links - read from env or default to # */}
            <div className="flex gap-3">
              <a href={SOCIAL_FACEBOOK} target={SOCIAL_FACEBOOK === '#' ? undefined : '_blank'} rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm" title="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href={SOCIAL_INSTAGRAM} target={SOCIAL_INSTAGRAM === '#' ? undefined : '_blank'} rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#E1306C] hover:text-white transition-all duration-300 shadow-sm" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.622c2.403 0 2.688.009 3.637.052.877.04 1.354.187 1.67.31.421.164.72.359 1.037.675.316.317.511.616.675 1.037.123.316.27.793.31 1.67.043.949.052 1.234.052 3.637s-.009 2.688-.052 3.637c-.04.877-.187 1.354-.31 1.67-.164.421-.359.72-.675 1.037-.317.316-.616.511-1.037.675-.316.123-.793.27-1.67.31-.949.043-1.234.052-3.637.052s-2.688-.009-3.637-.052c-.877-.04-1.354-.187-1.67-.31-.421-.164-.72-.359-1.037-.675-.316-.317-.511-.616-.675-1.037-.123-.316-.27-.793-.31-1.67-.043-.949-.052-1.234-.052-3.637s.009-2.688.052-3.637c.04-.877.187-1.354.31-1.67.164-.421.359-.72.675-1.037.317-.316.616-.511 1.037-.675.316-.123.793-.27 1.67-.31.949-.043 1.234-.052 3.637-.052M12 2c-2.444 0-2.75.01-3.71.054s-1.613.196-2.185.419c-.592.23-1.094.537-1.593 1.037-.5.5-.807 1.002-1.037 1.593-.223.572-.375 1.225-.419 2.184C3.01 9.25 3 9.556 3 12s.01 2.75.054 3.71.196 1.613.419 2.185c.23.592.537 1.094 1.037 1.593.5.5 1.002.807 1.593 1.037.572.223 1.225.375 2.184.419C9.25 20.99 9.556 21 12 21s2.75-.01 3.71-.054 1.613-.196 2.185-.419c.592-.23 1.094-.537 1.593-1.037.5-.5.807-1.002 1.037-1.593.223-.572.375-1.225.419-2.184C20.99 14.75 21 14.444 21 12s-.01-2.75-.054-3.71-.196-1.613-.419-2.185c-.23-.592-.537-1.094-1.037-1.593-.5-.5-1.002-.807-1.593-1.037-.572-.223-1.225-.375-2.184-.419C14.75 2.01 14.444 2 12 2zm0 4.878a5.122 5.122 0 100 10.244 5.122 5.122 0 000-10.244zm0 8.444a3.322 3.322 0 110-6.644 3.322 3.322 0 010 6.644zm5.328-9.083a1.198 1.198 0 100 2.396 1.198 1.198 0 000-2.396z" />
                </svg>
              </a>
              <a href={SOCIAL_YOUTUBE} target={SOCIAL_YOUTUBE === '#' ? undefined : '_blank'} rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white transition-all duration-300 shadow-sm" title="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.543 6.498C22 8.29 22 12 22 12s0 3.71-.457 5.502a2.502 2.502 0 0 1-1.76 1.76C18.182 19.722 12 19.722 12 19.722s-6.182 0-7.783-.46a2.502 2.502 0 0 1-1.76-1.76C2 15.71 2 12 2 12s0-3.71.457-5.502a2.502 2.502 0 0 1 1.76-1.76C5.818 4.278 12 4.278 12 4.278s6.182 0 7.783.46a2.502 2.502 0 0 1 1.76 1.76zM9.8 15.06l5.4-3.06-5.4-3.06v6.12z" />
                </svg>
              </a>
              <a href={`https://wa.me/${HOSPITAL_PHONE.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm" title="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.371a9.936 9.936 0 004.777 1.216h.005c5.505 0 9.989-4.478 9.99-9.984 0-2.669-1.037-5.176-2.922-7.062C17.198 3.033 14.686 2 12.012 2zm6.732 14.24c-.297.838-1.725 1.6-2.396 1.706-.613.097-1.258.125-1.921-.06-.41-.114-.94-.271-1.63-.564-2.929-1.24-4.827-4.223-4.974-4.42-.146-.197-1.19-1.583-1.19-3.02 0-1.436.75-2.14.102-2.436-.297-.13-.655-.16-.948.16-.293.32-.828.805-.828 1.963 0 1.157.842 2.278 1.01 2.507.169.23 2.296 3.504 5.562 4.916.777.336 1.383.537 1.855.687.779.248 1.488.213 2.05.132.624-.09 1.936-.79 2.207-1.554.27-.764.27-1.42.19-1.554-.08-.135-.296-.216-.624-.38z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-sarvodaya-blue rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-sarvodaya-blue text-sm transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-3 h-3 text-sarvodaya-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-sarvodaya-blue rounded-full"></span>
              Departments
            </h4>
            <ul className="space-y-3">
              {departments.map(dept => (
                <li key={dept}>
                  <Link href="/departments" className="text-gray-400 hover:text-sarvodaya-blue text-sm transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-3 h-3 text-medical-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {dept}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-sarvodaya-blue rounded-full"></span>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{HOSPITAL_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <a href={`tel:${HOSPITAL_PHONE}`} className="text-slate-300 text-sm hover:text-cyan-300 transition-colors">{HOSPITAL_PHONE}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href={`mailto:${HOSPITAL_EMAIL}`} className="text-slate-300 text-sm hover:text-cyan-300 transition-colors">{HOSPITAL_EMAIL}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-900/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <a href={`tel:${EMERGENCY_NUMBER}`} className="text-red-400 text-sm font-semibold hover:text-red-300 transition-colors">Emergency: {EMERGENCY_NUMBER}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {HOSPITAL_NAME}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-sarvodaya-blue transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-sarvodaya-blue transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
