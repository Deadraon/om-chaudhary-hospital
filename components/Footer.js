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
              <a href={SOCIAL_FACEBOOK} target={SOCIAL_FACEBOOK === '#' ? undefined : '_blank'} rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-all duration-300" title="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href={SOCIAL_INSTAGRAM} target={SOCIAL_INSTAGRAM === '#' ? undefined : '_blank'} rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#E1306C] hover:text-white transition-all duration-300" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href={SOCIAL_YOUTUBE} target={SOCIAL_YOUTUBE === '#' ? undefined : '_blank'} rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white transition-all duration-300" title="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 002.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href={`https://wa.me/${HOSPITAL_PHONE.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white transition-all duration-300" title="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.421 1.46h.01c5.566 0 10.093-4.52 10.097-10.081.002-2.694-1.043-5.227-2.946-7.132C17.327 1.496 14.8 1.45 12.011 1.45c-5.57 0-10.1 4.523-10.104 10.085-.001 1.943.508 3.84 1.472 5.448l-.966 3.529 3.634-.954zm12.39-7.53c-.322-.16-1.9-.937-2.193-1.044-.293-.108-.507-.16-.72.16-.214.32-.828 1.043-1.014 1.258-.187.214-.373.24-.694.08-1.517-.762-2.661-1.285-3.714-2.133-.8-.68-1.488-1.562-1.74-2.033-.254-.471-.027-.726.133-.886.143-.143.32-.375.48-.562.16-.188.214-.32.32-.536.107-.214.053-.4-.027-.562-.08-.16-.72-1.734-.987-2.378-.26-.625-.526-.54-.72-.55-.187-.008-.4-.01-.613-.01-.214 0-.56.08-.853.4-.294.32-1.12 1.1-1.12 2.678 0 1.578 1.147 3.1 1.307 3.32.16.22 2.244 3.424 5.437 4.8.759.328 1.353.524 1.815.67.763.243 1.458.209 2.007.127.613-.092 1.9-.777 2.167-1.49.266-.715.266-1.33.187-1.49-.08-.16-.293-.267-.613-.427z" />
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
