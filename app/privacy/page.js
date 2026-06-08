import Link from 'next/link';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

export const metadata = {
  title: `Privacy Policy | ${HOSPITAL_NAME}`,
  description: `Read the Privacy Policy of ${HOSPITAL_NAME}. We are committed to protecting patient data and maintaining confidentiality of all medical records.`,
};

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-sarvodaya-dark to-slate-950 text-center overflow-hidden">
        <div className="absolute inset-0 grid-medical-pattern-dark opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Privacy Policy</h1>
          <p className="text-base text-gray-300 max-w-xl mx-auto font-medium">
            Last updated: January 1, 2024. Your trust is our foundation.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="text-sarvodaya-blue font-semibold text-sm">
                {HOSPITAL_NAME} is committed to protecting the privacy and confidentiality of all patient information in compliance with applicable Indian healthcare regulations including IT Act 2000 and DPDP Act 2023.
              </p>
            </div>

            {[
              {
                title: '1. Information We Collect',
                content: `We collect personal information necessary to provide healthcare services, including: full name, date of birth, contact details (phone, email, address), medical history, diagnostic reports, prescription records, insurance/TPA details, and appointment booking details. We collect this information when you register on our portal, book appointments, or interact with our staff.`
              },
              {
                title: '2. How We Use Your Information',
                content: `Your information is used to: (a) Provide and coordinate medical care and treatment, (b) Schedule and manage appointments, (c) Process diagnostic lab reports and share them with authorized medical staff, (d) Send appointment reminders and health advisories, (e) Maintain accurate medical records as required by law, (f) Process billing and insurance/TPA claims, (g) Improve our hospital services and patient experience.`
              },
              {
                title: '3. Medical Records Confidentiality',
                content: `All patient medical records are strictly confidential. Your records will only be shared with: (a) The treating physician and direct care team, (b) Specialists to whom you are referred, (c) Your authorized legal representatives, (d) Insurance/TPA companies for claim processing (with your consent), (e) Government authorities when legally required. We do NOT sell or share patient data with third-party advertisers or data brokers.`
              },
              {
                title: '4. Data Security',
                content: `We implement industry-standard security measures to protect your personal and medical information: encrypted database storage (AES-256), secure HTTPS connections, role-based access controls limiting staff access to only necessary information, JWT-based authentication for portal access, and regular security audits. Despite these measures, no internet-based system can guarantee 100% security.`
              },
              {
                title: '5. Cookies & Online Tracking',
                content: `Our website uses essential cookies to maintain your login session and improve your browsing experience. We do not use third-party tracking cookies for advertising purposes. You can disable cookies in your browser settings; however, some portal features may not function correctly without them.`
              },
              {
                title: '6. Your Rights as a Patient',
                content: `Under applicable Indian law, you have the right to: (a) Access your personal information we hold, (b) Request corrections to inaccurate records, (c) Request deletion of non-essential personal data (subject to medical record retention laws), (d) Withdraw consent for data processing for non-essential purposes, (e) Lodge a complaint with the relevant data protection authority. To exercise these rights, contact our Data Privacy Officer at info@omchaudharyhospital.com.`
              },
              {
                title: '7. Data Retention',
                content: `Medical records are retained for a minimum of 7 years from the date of last treatment as required by Indian Medical Council regulations. Appointment and billing records are retained for 5 years. Account data for portal users is retained for the duration of account activity plus 2 years.`
              },
              {
                title: '8. Contact Us',
                content: `For any privacy-related concerns, questions, or requests, please contact us at: info@omchaudharyhospital.com or visit our hospital at Main Bypass Road, Sector-12, Greater Noida, UP - 201308. We will respond to all privacy requests within 30 working days.`
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
