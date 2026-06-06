import ContactForm from './ContactForm';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

export const metadata = {
  title: `Contact Us | ${HOSPITAL_NAME}`,
  description: `Contact ${HOSPITAL_NAME} for inquiries, appointments, or emergency support. Find our location, phone numbers, and email address.`,
};

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="relative py-20 gradient-hero overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-white/70">
            We are here to help you. Reach out to us for any medical query or emergency.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency Card */}
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full blur-xl"></div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🚨</div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg mb-1">Emergency Hotline</h3>
                    <p className="text-red-700 text-sm mb-3">Available 24/7 for trauma and critical care.</p>
                    <a href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}`} className="inline-flex items-center justify-center px-4 py-2 bg-red-650 text-white font-bold rounded-xl text-sm hover:bg-red-750 transition-colors shadow">
                      Call {process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '108'}
                    </a>
                  </div>
                </div>
              </div>

              {/* General Inquiry Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-xl font-bold">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Phone Numbers</h3>
                    <p className="text-gray-500 text-sm mb-1 font-medium">OPD & General Inquiries:</p>
                    <p className="text-gray-950 font-semibold text-sm">+91-9876543210</p>
                    <p className="text-gray-950 font-semibold text-sm">+91-120-123456</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Email Addresses</h3>
                    <p className="text-gray-500 text-sm mb-1 font-medium">Appointments & Info:</p>
                    <p className="text-gray-950 font-semibold text-sm mb-2">info@omchaudharyhospital.com</p>
                    <p className="text-gray-500 text-sm mb-1 font-medium">Careers & HR:</p>
                    <p className="text-gray-950 font-semibold text-sm">hr@omchaudharyhospital.com</p>
                  </div>
                </div>
              </div>

              {/* Address & Hours Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-xl font-bold">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Our Location</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Om Chaudhary Hospital & Trauma Centre<br />
                      Main Bypass Road, Sector-12,<br />
                      Greater Noida, Uttar Pradesh, India - 201308
                    </p>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">OPD Hours</h4>
                    <p className="text-gray-500 text-xs font-medium">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-500 text-xs font-medium">Sunday: 10:00 AM - 2:00 PM (Emergency 24/7)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form & Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Form Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Have a question or feedback? Fill out the form below, and we will get back to you as soon as possible.
                </p>
                <ContactForm />
              </div>

              {/* Map Card */}
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm h-[350px] relative">
                {/* Standard Google Maps Embed Iframe */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.886981883713!2d77.5011683!3d28.4527267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cbe0a3b2b8e39%3A0x6b1070857a2e7c3e!2sGreater+Noida%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${HOSPITAL_NAME} Location`}
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
