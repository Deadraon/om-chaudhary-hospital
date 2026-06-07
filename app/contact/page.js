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
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-950 text-center overflow-hidden">
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 grid-medical-pattern-dark opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-0"></div>
        
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-350 max-w-xl mx-auto font-medium">
            Get in touch with our medical reception team, general helpdesk, or find directions to our emergency unit.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-slate-50/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Contact Cards (4 cols) */}
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
                    <p className="text-red-750 text-xs mb-3 font-medium">Available 24/7 for trauma and critical ambulance requests.</p>
                    <a href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}`} className="inline-flex items-center justify-center px-4.5 py-2.5 bg-red-600 text-white font-extrabold rounded-xl text-xs hover:bg-red-700 transition-colors shadow-sm tracking-wide">
                      Call {process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}
                    </a>
                  </div>
                </div>
              </div>

              {/* General Inquiry Card */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 border border-primary-100/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Phone Numbers</h3>
                    <p className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wider">OPD & Reception Desk:</p>
                    <p className="text-gray-950 font-extrabold text-sm hover:text-primary-600 transition-colors">
                      <a href="tel:+919876543210">+91-9876543210</a>
                    </p>
                    <p className="text-gray-950 font-extrabold text-sm hover:text-primary-600 transition-colors">
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
                    <p className="text-gray-950 font-extrabold text-xs mb-3">
                      <a href="mailto:info@omchaudharyhospital.com" className="hover:text-cyan-600 transition-colors">info@omchaudharyhospital.com</a>
                    </p>
                    <p className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">Careers & HR Desk:</p>
                    <p className="text-gray-950 font-extrabold text-xs">
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
                    <p className="text-gray-650 text-xs leading-relaxed mb-4 font-medium">
                      Om Chaudhary Hospital & Trauma Centre<br />
                      Main Bypass Road, Sector-12,<br />
                      Greater Noida, Uttar Pradesh, India - 201308
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
              <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm h-[380px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.886981883713!2d77.5011683!3d28.4527267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cbe0a3b2b8e39%3A0x6b1070857a2e7c3e!2sGreater+Noida%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
