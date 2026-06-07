'use client';

import { useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import DepartmentCard from '@/components/DepartmentCard';
import { 
  IconEmergency, 
  IconGeneralMedicine, 
  IconPathology, 
  IconCardiology, 
  IconOrthopedics, 
  IconNeurology, 
  IconPediatrics,
  IconAward,
  IconUserGroup,
  IconShield,
  IconSparkles,
  IconClock
} from '@/components/MedicalIcons';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

const departments = [
  { id: 'dept-emergency', name: 'Emergency & Trauma', description: 'Round-the-clock emergency and trauma care with state-of-the-art equipment.' },
  { id: 'dept-cardiology', name: 'Cardiology', description: 'Comprehensive heart care including diagnostics and interventional procedures.' },
  { id: 'dept-orthopedics', name: 'Orthopedics', description: 'Expert bone, joint, and spine care with advanced treatment options.' },
  { id: 'dept-neurology', name: 'Neurology', description: 'Specialized care for brain, spinal cord, and nervous system disorders.' },
  { id: 'dept-pediatrics', name: 'Pediatrics', description: 'Compassionate healthcare for infants, children, and adolescents.' },
  { id: 'dept-general', name: 'General Medicine', description: 'Primary healthcare and internal medicine for all age groups.' },
];

const hospitalFeatures = [
  {
    icon: IconEmergency,
    title: '24/7 Emergency Care',
    description: 'Immediate trauma response, critical care transport, and emergency surgical teams available around the clock.',
    style: 'border-red-100 bg-red-50/30 text-red-650'
  },
  {
    icon: IconGeneralMedicine,
    title: 'Specialized Consultants',
    description: 'Direct consultations with award-winning experts in Cardiology, Orthopedics, and Neurology.',
    style: 'border-blue-100 bg-blue-50/30 text-primary-650'
  },
  {
    icon: IconShield,
    title: 'Certified Safety Standards',
    description: 'Rigorous sanitation, digital healthcare tracking, and international patient safety protocols.',
    style: 'border-emerald-100 bg-emerald-50/30 text-emerald-650'
  },
  {
    icon: IconPathology,
    title: 'Advanced Diagnostics',
    description: 'Fully automated lab services, CT Scan, High-Res Ultrasound, and radiology reporting.',
    style: 'border-purple-100 bg-purple-50/30 text-purple-650'
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    text: 'The orthopedic team at Om Chaudhary was phenomenal. My knee replacement surgery went smoothly, and the post-operative rehabilitation care was outstanding.',
    rating: 5,
    role: 'Orthopedic Patient'
  },
  {
    name: 'Priya Singh',
    text: 'During a critical family emergency, the ambulance and trauma team responded within minutes. Their efficiency and empathy literally saved my father\'s life.',
    rating: 5,
    role: 'Emergency Care Patient'
  },
  {
    name: 'Amit Sharma',
    text: 'One of the most professional healthcare facilities I have visited. Extremely clean, digital check-ins are seamless, and the cardiologists are top-tier.',
    rating: 5,
    role: 'Cardiology Patient'
  },
];

const faqs = [
  {
    question: 'How can I book an OPD consultation with a specialist?',
    answer: 'You can easily book a consultation online by clicking the "Book Appointment" button, choosing your department and doctor, and selecting a preferred time slot. Alternatively, you can call our reception desk directly.'
  },
  {
    question: 'Are emergency and trauma services active during night hours?',
    answer: 'Yes. Our emergency, ICU, ambulance services, and trauma operation theaters are open 24 hours a day, 7 days a week, with specialist surgeons and trauma coordinators present on-site.'
  },
  {
    question: 'What is the visiting hours policy for inpatient and ICU wards?',
    answer: 'To ensure patient recovery and safety, general ward visiting hours are from 11:00 AM - 1:00 PM and 5:00 PM - 7:00 PM. ICU wards allow one visitor at a time only during clinical briefing sessions.'
  },
  {
    question: 'Can I access my diagnostic lab reports online?',
    answer: 'Yes! Once registered, patients can log into their secure Patient Dashboard using their credentials to view and download all diagnostic pathology and radiology reports.'
  }
];

export default function HomePage() {
  const [activeDeptTab, setActiveDeptTab] = useState('dept-emergency');
  const [activeFaq, setActiveFaq] = useState(null);

  // Find active department details for spotlight
  const activeDeptInfo = departments.find(d => d.id === activeDeptTab) || departments[0];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-white overflow-hidden py-12 md:py-20 border-b border-gray-100/50">
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 grid-medical-pattern opacity-100 pointer-events-none"></div>
        
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (6 cols) */}
            <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
              {/* Patient Trust Badge */}
              <div className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-primary-50/60 border border-primary-100/50 rounded-full text-primary-750 text-xs font-bold shadow-sm backdrop-blur-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Trusted Healthcare Partner
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight text-balance">
                Your Health, Our <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-cyan-500">
                  Ultimate Commitment
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-550 max-w-xl leading-relaxed font-medium">
                Om Chaudhary Hospital & Trauma Centre provides world-class clinical care, utilizing advanced medical technology and a dedicated team of expert specialist physicians.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/book-appointment" className="btn-primary btn-lg shadow-lg hover:shadow-xl hover:shadow-primary-600/10 text-base py-4 px-8 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2.5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Appointment
                </Link>
                <Link href="/doctors" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-350">
                  Meet Our Specialists
                  <svg className="w-5 h-5 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Key Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-150 max-w-md">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">50+</div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5">Specialists</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">12+</div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5">Departments</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-950 flex items-center gap-1">
                    24/7
                    <span className="w-2 h-2 rounded-full bg-red-650 inline-block animate-pulse"></span>
                  </div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5">Trauma Care</div>
                </div>
              </div>
            </div>

            {/* Right Graphics Column (5 cols) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 animate-fade-in">
              <div className="relative mx-auto max-w-[440px] lg:max-w-none">
                {/* Accent background box */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-cyan-400 rounded-3xl transform rotate-3 scale-[1.02] opacity-10"></div>
                
                {/* Main Premium Medical Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" 
                    alt="Clinical Consultation at Om Chaudhary Hospital"
                    className="w-full h-[460px] object-cover hover:scale-[1.02] transition-transform duration-700" 
                  />
                  {/* Subtle dark tint gradient on image bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                </div>

                {/* Floating Interactive Widget: Active OPD indicator */}
                <div className="absolute bottom-6 -left-6 bg-white/90 backdrop-blur-md border border-gray-150 p-4.5 rounded-2xl shadow-xl max-w-[200px] flex items-center gap-3.5 hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                    <IconClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 leading-tight">OPD Status</h4>
                    <p className="text-[10px] text-emerald-600 font-extrabold uppercase mt-0.5">Active & Running</p>
                  </div>
                </div>

                {/* Floating Interactive Widget: Emergency contact */}
                <div className="absolute -top-6 -right-6 bg-white border border-red-100 p-4.5 rounded-2xl shadow-xl max-w-[220px] flex items-center gap-3.5 hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <IconEmergency className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 leading-tight">Ambulance Hub</h4>
                    <p className="text-[10px] text-red-600 font-extrabold uppercase mt-0.5">Dial 108 Emergency</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== QUICK ACCESS PORTAL BAR ==================== */}
      <section className="relative -mt-8 z-20 px-4">
        <div className="max-w-6xl mx-auto bg-white border border-gray-150 rounded-3xl shadow-xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/book-appointment" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-primary-100/50">
              <IconGeneralMedicine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">Book OPD</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Schedule online appointments</p>
            </div>
          </Link>
          <Link href="/doctors" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-cyan-100/50">
              <IconUserGroup className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-cyan-600 transition-colors">Find Doctors</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Meet our medical specialist panel</p>
            </div>
          </Link>
          <Link href="/appointment-status" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-purple-100/50">
              <IconPathology className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors">Check Reports</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Download diagnostic lab files</p>
            </div>
          </Link>
          <Link href="/contact" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-650 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-red-100/50">
              <IconEmergency className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-red-650 transition-colors">Emergency Info</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Trauma unit location & map</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ==================== CORE CLINICAL CAPABILITIES ==================== */}
      <section className="section bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold tracking-wider mb-4 border border-primary-100/30">
              <IconSparkles className="w-3.5 h-3.5" />
              Clinical Quality
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Hospital Facilities & Services
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              We offer advanced medical standards across diagnostics, emergency care, and specialist consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitalFeatures.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div key={feat.title} className="rounded-3xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all duration-300 hover-lift">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${feat.style}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-2">{feat.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== DEPARTMENTS TAB SWITCHER SPOTLIGHT ==================== */}
      <section className="section bg-slate-50/60 border-t border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Interactive Specialties Spotlight</h2>
            <p className="text-gray-500 text-xs mt-2 font-medium">Click on any specialization tab below to preview our clinical offerings.</p>
          </div>

          {/* Dynamic Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10 max-w-4xl mx-auto">
            {departments.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDeptTab(d.id)}
                className={`py-2.5 px-5 rounded-2xl text-xs font-bold tracking-wide transition-all ${
                  activeDeptTab === d.id
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-650/15'
                    : 'bg-white text-gray-650 border border-gray-200/80 hover:bg-gray-50'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* spotlight details box */}
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex px-3 py-1 bg-primary-50 text-primary-750 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                Featured Specialty
              </div>
              <h3 className="text-2xl font-black text-gray-900">{activeDeptInfo.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{activeDeptInfo.description}</p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                  State-of-the-art ICU & inpatient bed facility
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                  Consultations with senior board-certified specialists
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link href="/book-appointment" className="btn-primary py-3 px-6 text-xs">
                  Book Slot Now
                </Link>
                <Link href="/departments" className="inline-flex items-center text-xs font-bold text-gray-650 hover:text-primary-650 transition-colors">
                  View All Specialties &rarr;
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-[280px] border border-gray-100 shadow-md">
              {/* Change images based on tabs for realistic look */}
              <img 
                src={
                  activeDeptTab === 'dept-emergency'
                    ? "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
                    : activeDeptTab === 'dept-cardiology'
                    ? "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80"
                    : activeDeptTab === 'dept-orthopedics'
                    ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
                    : activeDeptTab === 'dept-neurology'
                    ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
                    : "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80"
                } 
                alt={activeDeptInfo.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ==================== SYSTEM SPECIALTIES LIST ==================== */}
      <section className="section bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Medical Departments</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2">
              Comprehensive medical services staffed by expert clinical physicians.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(dept => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/departments" className="btn-secondary py-3.5 px-6.5 text-sm">
              View All 12 Departments
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== STATS BANNER ==================== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-medical-pattern-dark opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard icon={<IconUserGroup className="w-7 h-7 text-white" />} value="50" label="Consultant Doctors" suffix="+" />
            <StatsCard icon={<IconGeneralMedicine className="w-7 h-7 text-white" />} value="12" label="Specialty Departments" />
            <StatsCard icon={<IconShield className="w-7 h-7 text-white" />} value="50000" label="Happy Patient Recoveries" suffix="+" />
            <StatsCard icon={<IconAward className="w-7 h-7 text-white" />} value="15" label="Years Clinical Excellence" suffix="+" />
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="section bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold tracking-wider mb-4 border border-primary-100/30">
              <IconSparkles className="w-3.5 h-3.5" />
              Patient Success
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Patients Say</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2">Real testimonials from families who have experienced our clinical excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }, (_, j) => (
                      <svg key={j} className="w-4.5 h-4.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-650 text-xs sm:text-sm mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                </div>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-xs">{t.name}</p>
                    <p className="text-gray-550 text-[10px] uppercase font-bold mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== INTERACTIVE FAQ ACCORDION ==================== */}
      <section className="section bg-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm mt-2">Find quick answers to help make your clinic visit seamless.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-gray-150 rounded-2xl overflow-hidden bg-white transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4.5 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-extrabold text-gray-950 text-sm sm:text-base">{faq.question}</span>
                    <span className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary-50 text-primary-600' : ''}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-48 border-t border-gray-100' : 'max-h-0'}`}>
                    <p className="px-6 py-4.5 text-gray-600 text-xs sm:text-sm leading-relaxed bg-slate-50/20">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CALL TO ACTION PORTAL ==================== */}
      <section className="section bg-white pb-24 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-750 via-primary-850 to-slate-900 p-8 md:p-16 shadow-2xl">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-medical-pattern-dark opacity-10"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Need Medical Assistance? Book Online & Skip the Queue
              </h2>
              <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
                Skip phone lines. Schedule consultations, search for specialist doctor timings, and track appointments in real time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/book-appointment" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl text-base hover:bg-gray-50 transition-all duration-300 shadow-md">
                  Book Slot Online
                </Link>
                <Link href="/appointment-status" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl text-base hover:bg-white/10 transition-all duration-300">
                  Track Appointment Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
