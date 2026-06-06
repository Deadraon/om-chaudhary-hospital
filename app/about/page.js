import Link from 'next/link';
import StatsCard from '@/components/StatsCard';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

const coreValues = [
  { icon: '🤝', title: 'Compassion', description: 'Treating every patient with dignity, empathy, and kindness.' },
  { icon: '⭐', title: 'Excellence', description: 'Striving for the highest quality in clinical care and service delivery.' },
  { icon: '🛡️', title: 'Integrity', description: 'Maintaining absolute honesty, transparency, and ethical standards.' },
  { icon: '💡', title: 'Innovation', description: 'Embracing modern technology and advanced medical practices for better outcomes.' },
];

const medicalDirectors = [
  {
    name: 'Dr. Om Chaudhary',
    role: 'Founder & Chief Medical Director',
    speciality: 'Senior Trauma & Orthopedic Specialist',
    experience: '20+ Years Experience',
    bio: 'Dedicated to providing high-quality trauma and orthopedic care. Established this center to bring world-class healthcare to the region.',
  },
  {
    name: 'Dr. Archana Chaudhary',
    role: 'Co-Founder & Clinical Director',
    speciality: 'Senior Gynecologist & Obstetrics Specialist',
    experience: '18+ Years Experience',
    bio: 'Expert in high-risk pregnancy management and advanced gynecological treatments, with a passion for women\'s health and wellness.',
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
      <section className="relative py-20 gradient-hero overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Our Hospital</h1>
          <p className="text-lg text-white/70">
            A legacy of trust, compassion, and world-class healthcare.
          </p>
        </div>
      </section>

      {/* Intro section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                Who We Are
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                Serving Humanity with Clinical Excellence and Care
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Established with a vision to provide state-of-the-art medical care, <strong>{HOSPITAL_NAME}</strong> has grown to become a premier healthcare destination in the region. We offer a comprehensive range of clinical services, specializing in emergency, trauma, orthopedics, cardiology, and more.
                </p>
                <p>
                  Our hospital features advanced diagnostic services, modern operation theaters, an ultra-modern ICU, and 24/7 trauma response units. We believe in combination of cutting-edge technology and human touch, ensuring every patient receives personalized care.
                </p>
                <p>
                  With a dedicated team of highly qualified doctors, skilled nurses, and compassionate administrative staff, we work tirelessly around the clock to provide excellent healthcare experiences and optimal recovery environments.
                </p>
              </div>
            </div>

            {/* Right side - Mission/Vision card */}
            <div className="space-y-6">
              <div className="gradient-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">
                  To provide accessible, high-quality, and compassionate healthcare to all sections of society. We are committed to achieving clinical excellence and patient safety through continuous improvement, empathy, and advanced medical practices.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-xl"></div>
                <div className="text-3xl mb-4">👁️</div>
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-white/70 leading-relaxed">
                  To be recognized as the most trusted and preferred healthcare provider, set standards in clinical outcomes and patient care, and become a leader in regional trauma and specialized medical services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide our choices, actions, and care on a daily basis</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <div key={value.title} className="card hover:-translate-y-1 transition-all duration-300">
                <div className="card-body text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
              Our Leadership
            </div>
            <h2 className="section-title">Medical Leadership & Founders</h2>
            <p className="section-subtitle">
              The visionaries driving our clinical quality, research and compassionate care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {medicalDirectors.map((director) => (
              <div key={director.name} className="card hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-50 to-cyan-50/50 p-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">
                    {director.name.split(' ').slice(1).map(n => n[0]).join('') || 'DR'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{director.name}</h3>
                  <p className="text-primary-600 font-semibold text-sm">{director.role}</p>
                  <p className="text-gray-500 text-xs mt-1">{director.speciality} • {director.experience}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    &ldquo;{director.bio}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard icon="👨‍⚕️" value="50" label="Specialist Doctors" suffix="+" />
            <StatsCard icon="🏥" value="12" label="Departments" />
            <StatsCard icon="😊" value="50000" label="Successful Recoveries" suffix="+" />
            <StatsCard icon="🏆" value="15" label="Years of Commitment" suffix="+" />
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="section bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience Our Care Firsthand</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Book an appointment online with one of our specialized medical team members and receive the attention you deserve.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/book-appointment" className="btn-primary btn-lg">
              Book Appointment
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-2xl">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
