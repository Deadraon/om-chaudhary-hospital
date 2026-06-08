import ContactForm from './ContactForm';
import { 
  IconEmergency, 
  IconPhone, 
  IconEmail, 
  IconMapPin,
  IconClock
} from '@/components/MedicalIcons';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

export const metadata = {
  title: `Contact Us | ${HOSPITAL_NAME}`,
  description: `Contact ${HOSPITAL_NAME} for inquiries, appointments, or emergency support. Find our location, phone numbers, and email address.`,
};

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-sarvodaya-dark to-slate-950 text-center overflow-hidden">
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 grid-medical-pattern-dark opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-0"></div>
        
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto font-medium">
            Get in touch with our medical reception team, general helpdesk, or find directions to our emergency unit.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-slate-50/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Emergency Card */}
              <div className="bg-red-50 border border-red-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden glow-red">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full blur-xl opacity-60"></div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <IconEmergency className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-red-950 text-base mb-1">Emergency Hotline</h3>
                    <p className="text-red-700 text-xs mb-3 font-medium">Available 24/7 for trauma and critical ambulance requests.</p>
                    <a href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}`} className="inline-flex items-center justify-center px-4.5 py-2.5 bg-red-600 text-white font-extrabold rounded-xl text-xs hover:bg-red-700 transition-colors shadow-sm tracking-wide">
                      Call {process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}
                    </a>
                  </div>
                </div>
              </div>

              {/* General Inquiry Card */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sarvodaya-blue border border-sky-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Phone Numbers</h3>
                    <p className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wider">OPD & Reception Desk:</p>
                    <p className="text-gray-900 font-extrabold text-sm hover:text-sarvodaya-blue transition-colors">
                      <a href="tel:+919876543210">+91-9876543210</a>
                    </p>
                    <p className="text-gray-900 font-extrabold text-sm hover:text-sarvodaya-blue transition-colors">
                      <a href="tel:+91120123456">+91-120-123456</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-50 text-cyan-600 border border-cyan-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconEmail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Email Addresses</h3>
                    <p className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">Appointments & Support:</p>
                    <p className="text-gray-900 font-extrabold text-xs mb-3">
                      <a href="mailto:info@omchaudharyhospital.com" className="hover:text-cyan-600 transition-colors">info@omchaudharyhospital.com</a>
                    </p>
                    <p className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">Careers & HR Desk:</p>
                    <p className="text-gray-900 font-extrabold text-xs">
                      <a href="mailto:hr@omchaudharyhospital.com" className="hover:text-cyan-600 transition-colors">hr@omchaudharyhospital.com</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Address & Hours Card */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Hospital Location</h3>
                    <p className="text-gray-600 text-xs leading-relaxed mb-4 font-medium">
                      Om Chaudhary Hospital & Trauma Centre<br />
                      Najibabad - Haridwar Road, Mandawali,<br />
                      Bijnor, Uttar Pradesh, India - 246749
                    </p>
                    
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3 mt-1 text-gray-500">
                      <IconClock className="w-4 h-4 text-cyan-600" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">OPD Consulting Hours</h4>
                        <p className="text-[11px] font-medium mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</p>
                        <p className="text-[11px] font-medium">Sunday: 10:00 AM - 2:00 PM (Emergency 24/7)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form & Map (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Form Card */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Send Us a Secure Message</h2>
                <p className="text-gray-500 text-xs mb-6 font-medium">
                  Have a general question, feedback, or need help? Fill out the secure form, and our desk coordinator will respond shortly.
                </p>
                <ContactForm />
              </div>

              {/* Map Card */}
              <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm relative">
                <div className="h-[340px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.886981883713!2d78.26047307549765!3d29.64432577357485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39095f0024ca40bb%3A0xa3ab7cc27ae93ef6!2sOm%20Chaudhary%20Hospital%20and%20trauma%20centre!5e0!3m2!1sen!2sin!4v1749382800000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${HOSPITAL_NAME} Location Map`}
                    id="hospital-map"
                  ></iframe>
                </div>
                {/* Open in Maps button */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-sarvodaya-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">Om Chaudhary Hospital &amp; Trauma Centre</span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/KwSsx1e6XA5gDYY87"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sarvodaya-blue text-white text-xs font-bold rounded-xl hover:bg-sarvodaya-dark transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in Maps
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
