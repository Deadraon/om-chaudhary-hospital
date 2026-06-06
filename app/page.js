import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import DepartmentCard from '@/components/DepartmentCard';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

const departments = [
  { id: 'dept-emergency', name: 'Emergency & Trauma', description: 'Round-the-clock emergency and trauma care with state-of-the-art equipment.' },
  { id: 'dept-cardiology', name: 'Cardiology', description: 'Comprehensive heart care including diagnostics and interventional procedures.' },
  { id: 'dept-orthopedics', name: 'Orthopedics', description: 'Expert bone, joint, and spine care with advanced treatment options.' },
  { id: 'dept-neurology', name: 'Neurology', description: 'Specialized care for brain, spinal cord, and nervous system disorders.' },
  { id: 'dept-pediatrics', name: 'Pediatrics', description: 'Compassionate healthcare for infants, children, and adolescents.' },
  { id: 'dept-general', name: 'General Medicine', description: 'Primary healthcare and internal medicine for all age groups.' },
];

const features = [
  {
    icon: '🏥',
    title: '24/7 Emergency',
    description: 'Round-the-clock emergency services with advanced life support and trauma care facilities.',
  },
  {
    icon: '👨‍⚕️',
    title: 'Expert Doctors',
    description: 'Team of highly qualified and experienced specialists across all medical departments.',
  },
  {
    icon: '🔬',
    title: 'Modern Technology',
    description: 'State-of-the-art diagnostic and treatment equipment for accurate and effective care.',
  },
  {
    icon: '💊',
    title: 'Complete Care',
    description: 'From diagnosis to recovery, we provide comprehensive healthcare under one roof.',
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    text: 'Excellent care and treatment. The doctors and staff were very professional and caring. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Priya Singh',
    text: 'The emergency services saved my father\'s life. The response time was incredible. Forever grateful to the team.',
    rating: 5,
  },
  {
    name: 'Amit Sharma',
    text: 'Best hospital in the area. Clean facilities, modern equipment, and compassionate doctors. Very satisfied with the treatment.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6 border border-white/10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Trusted by 50,000+ Patients
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your Health, Our
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                  Top Priority
                </span>
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
                {HOSPITAL_NAME} delivers compassionate, world-class healthcare with cutting-edge technology and a team of dedicated medical professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-appointment" className="btn-primary btn-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </Link>
                <Link href="/departments" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-2xl border-2 border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  Our Departments
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-white/50 text-sm">Doctors</div>
                </div>
                <div className="w-px bg-white/20"></div>
                <div>
                  <div className="text-3xl font-bold text-white">12</div>
                  <div className="text-white/50 text-sm">Departments</div>
                </div>
                <div className="w-px bg-white/20"></div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-white/50 text-sm">Emergency</div>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 ${
                    i % 2 === 1 ? 'mt-8' : ''
                  }`}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ==================== FEATURES SECTION (Mobile) ==================== */}
      <section className="lg:hidden section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4">
            {features.map(feature => (
              <div key={feature.title} className="card">
                <div className="card-body text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DEPARTMENTS SECTION ==================== */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
              Our Specializations
            </div>
            <h2 className="section-title">Medical Departments</h2>
            <p className="section-subtitle">
              Comprehensive healthcare services across specialized departments staffed by expert physicians
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(dept => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/departments" className="btn-secondary">
              View All Departments
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard icon="👨‍⚕️" value="50" label="Expert Doctors" suffix="+" />
            <StatsCard icon="🏥" value="12" label="Departments" />
            <StatsCard icon="😊" value="50000" label="Happy Patients" suffix="+" />
            <StatsCard icon="🏆" value="15" label="Years Experience" suffix="+" />
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden gradient-primary p-12 md:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need a Doctor? Book Your Appointment Now!
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Skip the queue. Book an appointment online with our expert doctors and get the care you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-appointment" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Book Appointment
                </Link>
                <Link href="/appointment-status" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl text-lg hover:bg-white/10 transition-all duration-300">
                  Check Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
              Patient Testimonials
            </div>
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-subtitle">Real stories from our patients about their experience at our hospital</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card">
                <div className="card-body">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }, (_, j) => (
                      <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-600 mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">Verified Patient</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
