import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import { 
  IconCompassion, 
  IconAward, 
  IconShield, 
  IconSparkles,
  IconUserGroup,
  IconGeneralMedicine
} from '@/components/MedicalIcons';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

const coreValues = [
  { icon: IconCompassion, title: 'Compassion', description: 'Treating every patient with dignity, empathy, and absolute warmth.', style: 'bg-rose-50 text-rose-600 border-rose-100' },
  { icon: IconAward, title: 'Clinical Excellence', description: 'Striving for the highest benchmark in medicine, diagnostics, and service.', style: 'bg-amber-50 text-amber-600 border-amber-100' },
  { icon: IconShield, title: 'Absolute Integrity', description: 'Maintaining complete honesty, transparent billing, and ethical protocols.', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { icon: IconSparkles, title: 'Innovative Practice', description: 'Embracing modern surgical technology and advanced clinical workflows.', style: 'bg-primary-50 text-primary-600 border-primary-100' },
];

const medicalDirectors = [
  {
    name: 'Dr. Om Chaudhary',
    role: 'Founder & Chief Medical Director',
    speciality: 'Senior Trauma & Orthopedic Specialist',
    experience: '20+ Years Experience',
    bio: 'Dedicated to providing high-quality trauma and orthopedic care. Established this center to bring world-class healthcare to the region, ensuring every patient receives state-of-the-art diagnostics and compassionate rehabilitation.',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    name: 'Dr. Archana Chaudhary',
    role: 'Co-Founder & Clinical Director',
    speciality: 'Senior Gynecologist & Obstetrics Specialist',
    experience: '18+ Years Experience',
    bio: 'Expert in high-risk pregnancy management and advanced gynecological treatments, with a passion for women\'s health and wellness. Focused on setting top-tier safety standards for clinical nursing and maternity wards.',
    photo: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&w=400&h=400&q=80'
  },
];

export const metadata = {
  title: `About Us | ${HOSPITAL_NAME}`,
  description: `Learn more about the mission, vision, values, and outstanding medical team of ${HOSPITAL_NAME}.`,
};

export default function AboutPage() {
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
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">About Our Hospital</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto font-medium">
            Serving the community with clinical dedication, advanced diagnostic equipment, and patient-first medical protocols.
          </p>
        </div>
      </section>

      {/* Intro section */}
      <section className="section bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative Box */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold tracking-wide">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                Our Hospital Legacy
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Serving Humanity with Clinical Excellence and Compassionate Care
              </h2>
              <div className="space-y-4.5 text-gray-600 text-sm leading-relaxed font-medium font-medium">
                <p>
                  Established with a vision to provide state-of-the-art medical care, <strong>{HOSPITAL_NAME}</strong> has grown to become a premier healthcare destination in the region. We offer a comprehensive range of clinical services, specializing in emergency, trauma, orthopedics, cardiology, and general medicine.
                </p>
                <p>
                  Our hospital features advanced diagnostic services, modern modular operation theaters, an ultra-modern multi-bed ICU, and 24/7 trauma response units. We believe in the combination of cutting-edge technology and a gentle human touch, ensuring every patient receives custom, personalized care.
                </p>
                <p>
                  With a dedicated team of highly qualified doctors, skilled nurses, and compassionate administrative staff, we work tirelessly around the clock to provide excellent healthcare experiences and optimal recovery environments.
                </p>
              </div>
            </div>

            {/* Right side - Mission/Vision card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-primary-600 to-cyan-500 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                  <IconShield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-extrabold mb-2.5">Our Mission</h3>
                <p className="text-white/90 leading-relaxed text-xs">
                  To provide accessible, high-quality, and compassionate healthcare to all sections of society. We are committed to achieving clinical excellence and patient safety through continuous improvement, empathy, and advanced medical practices.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-xl"></div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-5 border border-white/10">
                  <IconSparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-extrabold mb-2.5">Our Vision</h3>
                <p className="text-white/80 leading-relaxed text-xs">
                  To be recognized as the most trusted and preferred healthcare provider, setting new standards in clinical outcomes and patient care, and becoming a regional leader in emergency trauma and specialized medicine.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section bg-slate-50/50 py-24 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Core Values</h2>
            <p className="text-gray-500 text-sm mt-3">The principles that guide our clinical choices, daily actions, and inpatient care.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => {
              const ValueIcon = value.icon;
              return (
                <div key={value.title} className="bg-white border border-gray-150 p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover-lift">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mx-auto mb-5 ${value.style}`}>
                      <ValueIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base mb-2">{value.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold tracking-wide">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
              Medical Leadership
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-4">Clinical Directors & Founders</h2>
            <p className="text-gray-500 text-sm mt-2">
              The visionaries driving our clinical quality standards, research policies, and trauma care programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {medicalDirectors.map((director) => (
              <div key={director.name} className="bg-white rounded-3xl border border-gray-150 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50/20 p-6 border-b border-gray-100 flex flex-col items-center sm:items-start sm:flex-row gap-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <img src={director.photo} alt={director.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-xl font-extrabold text-gray-900">{director.name}</h3>
                    <p className="text-primary-600 font-bold text-xs">{director.role}</p>
                    <p className="text-gray-500 text-[11px] font-semibold">{director.speciality} • {director.experience}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-gray-650 text-xs leading-relaxed italic font-medium">
                    &ldquo;{director.bio}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-medical-pattern-dark opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard icon={<IconGeneralMedicine className="w-7 h-7 text-white" />} value="50" label="Specialist Doctors" suffix="+" />
            <StatsCard icon={<IconSparkles className="w-7 h-7 text-white" />} value="12" label="Medical Wards" />
            <StatsCard icon={<IconShield className="w-7 h-7 text-white" />} value="50000" label="Successful Recoveries" suffix="+" />
            <StatsCard icon={<IconAward className="w-7 h-7 text-white" />} value="15" label="Years Dedicated Service" suffix="+" />
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="section bg-white text-center py-24">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Experience Professional Medical Care</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto font-medium">
            Schedule a consult online with our expert medical team members and receive the personalized clinical attention you deserve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/book-appointment" className="btn-primary btn-lg shadow-lg hover:shadow-xl text-sm py-4 px-8 flex items-center justify-center">
              Schedule Appointment
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-2xl">
              Contact Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
