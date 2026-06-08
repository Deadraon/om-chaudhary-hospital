import Link from 'next/link';
import { IconEmergency } from '@/components/MedicalIcons';
import HospitalLogo from '@/components/HospitalLogo';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';
const EMERGENCY_NUMBER = process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108';
const HOSPITAL_PHONE = process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+91-6396098340';
const HOSPITAL_EMAIL = process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || 'info@omchaudharyhospital.com';
const HOSPITAL_ADDRESS = process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || 'Najibabad - Haridwar Road, Mandawali, Bijnor, Uttar Pradesh - 246749';

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
            {/* Social Links - placeholder until real handles are set */}
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-all duration-300" title="Facebook">
                <span className="text-xs font-bold">f</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#E1306C] hover:text-white transition-all duration-300" title="Instagram">
                <span className="text-xs font-bold">in</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white transition-all duration-300" title="YouTube">
                <span className="text-xs font-bold">yt</span>
              </a>
              <a href={`https://wa.me/${HOSPITAL_PHONE.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white transition-all duration-300" title="WhatsApp">
                <span className="text-xs font-bold">wa</span>
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
