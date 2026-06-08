import Link from 'next/link';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

export const metadata = {
  title: `Terms of Service | ${HOSPITAL_NAME}`,
  description: `Terms and conditions for using ${HOSPITAL_NAME} services, patient portal, and online appointment booking.`,
};

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-sarvodaya-dark to-slate-950 text-center overflow-hidden">
        <div className="absolute inset-0 grid-medical-pattern-dark opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Terms of Service</h1>
          <p className="text-base text-gray-300 max-w-xl mx-auto font-medium">
            Last updated: January 1, 2024. Please read these terms carefully.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <p className="text-amber-800 font-semibold text-sm">
                By using the {HOSPITAL_NAME} website, patient portal, or online appointment booking services, you agree to these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </div>

            {[
              {
                title: '1. Acceptance of Terms',
                content: `These Terms of Service govern your access to and use of the ${HOSPITAL_NAME} website and patient portal ("Services"). By registering for an account, booking an appointment, or otherwise using our Services, you agree to be bound by these terms.`
              },
              {
                title: '2. Medical Disclaimer',
                content: `The information provided on this website is for general informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician or other qualified healthcare provider with any questions you may have regarding a medical condition. In case of a medical emergency, call 108 immediately or visit our emergency department.`
              },
              {
                title: '3. Online Appointment Booking',
                content: `Booking an appointment through our portal does not guarantee immediate medical consultation. Appointments are subject to doctor availability and may be rescheduled. We reserve the right to cancel or modify appointments with reasonable notice. Patients are expected to arrive 15 minutes prior to their scheduled appointment time.`
              },
              {
                title: '4. Patient Portal Account',
                content: `You are responsible for maintaining the confidentiality of your account credentials. Do not share your login password with anyone. Notify us immediately if you suspect unauthorized access to your account at info@omchaudharyhospital.com. We are not liable for any loss or damage arising from unauthorized use of your account.`
              },
              {
                title: '5. Patient Conduct',
                content: `Patients and visitors are expected to: (a) Treat hospital staff with respect and dignity, (b) Provide accurate and complete medical information, (c) Follow hospital rules, visiting hours, and clinical protocols, (d) Not engage in any behavior that disrupts the hospital environment or endangers other patients. The hospital reserves the right to refuse service to individuals who engage in abusive, threatening, or violent behavior.`
              },
              {
                title: '6. Billing & Payment',
                content: `All medical services are subject to applicable charges as per the hospital rate card. Patients are responsible for ensuring their insurance/TPA coverage is valid before availing services. The hospital is not responsible for claims denied by insurance providers. Outstanding bills must be cleared before discharge. Payment plans may be arranged with the billing department in special circumstances.`
              },
              {
                title: '7. Limitation of Liability',
                content: `${HOSPITAL_NAME} makes every effort to provide accurate information and quality medical services. However, we are not liable for: (a) Any indirect, incidental, or consequential damages arising from use of our website, (b) Medical outcomes as all medical procedures carry inherent risks disclosed by your treating physician, (c) Technical interruptions or errors in the online portal. Our liability is limited to the extent permitted by applicable law.`
              },
              {
                title: '8. Governing Law',
                content: `These Terms are governed by the laws of India. Any disputes arising from these Terms or use of our services shall be subject to the exclusive jurisdiction of the courts of Bijnor, Uttar Pradesh, India.`
              },
              {
                title: '9. Changes to Terms',
                content: `We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Continued use of our services after changes are posted constitutes your acceptance of the revised Terms.`
              },
              {
                title: '10. Contact',
                content: `For any questions about these Terms, please contact us at info@omchaudharyhospital.com or visit us at Najibabad - Haridwar Road, Mandawali, Bijnor, UP - 246749.`
              }
            ].map((section) => (
              <div key={section.title} className="border-b border-gray-100 pb-8">
                <h2 className="text-xl font-extrabold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-sarvodaya-blue text-white font-bold rounded-2xl text-sm hover:bg-sarvodaya-dark transition-colors">
                Contact Us
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-2xl text-sm hover:bg-gray-50 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
