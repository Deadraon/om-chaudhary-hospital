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
    style: 'border-red-100 bg-red-50/30 text-red-700'
  },
  {
    icon: IconGeneralMedicine,
    title: 'Specialized Consultants',
    description: 'Direct consultations with award-winning experts in Cardiology, Orthopedics, and Neurology.',
    style: 'border-blue-100 bg-blue-50/30 text-primary-700'
  },
  {
    icon: IconShield,
    title: 'Certified Safety Standards',
    description: 'Rigorous sanitation, digital healthcare tracking, and international patient safety protocols.',
    style: 'border-emerald-100 bg-emerald-50/30 text-emerald-700'
  },
  {
    icon: IconPathology,
    title: 'Advanced Diagnostics',
    description: 'Fully automated lab services, CT Scan, High-Res Ultrasound, and radiology reporting.',
    style: 'border-purple-100 bg-purple-50/30 text-purple-700'
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
  
  // Interactive search & organ states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOrgan, setSelectedOrgan] = useState('');

  // Find active department details for spotlight
  const activeDeptInfo = departments.find(d => d.id === activeDeptTab) || departments[0];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const ORGAN_RECOMMENDATIONS = {
    knee: { dept: 'Orthopedics', desc: 'Expert bone, joint, and spine care.' },
    shoulder: { dept: 'Orthopedics', desc: 'Expert bone, joint, and spine care.' },
    heart: { dept: 'Cardiology', desc: 'Comprehensive heart care and diagnostics.' },
    brain: { dept: 'Neurology', desc: 'Specialized care for nervous system disorders.' },
    spine: { dept: 'Neurology', desc: 'Specialized care for brain, spinal cord, and nervous system.' },
    kidney: { dept: 'General Medicine', desc: 'Pathology, dialysis support, and internal medicine.' },
    stomach: { dept: 'General Medicine', desc: 'Digestive tract care and internal medicine.' },
    intestine: { dept: 'General Medicine', desc: 'Internal medicine and diagnostic pathology.' },
    eyes: { dept: 'General Medicine', desc: 'Primary ophthalmic screenings.' },
    ear: { dept: 'General Medicine', desc: 'ENT general wellness screenings.' },
    nose: { dept: 'General Medicine', desc: 'ENT general wellness screenings.' },
    throat: { dept: 'General Medicine', desc: 'ENT general wellness screenings.' },
    skin: { dept: 'General Medicine', desc: 'Dermatological screening support.' },
  };

  const recommendedSpecialty = selectedOrgan ? ORGAN_RECOMMENDATIONS[selectedOrgan] : null;

  return (
    <>
      {/* ==================== HERO SECTION (Corporate Deep Blue Banner) ==================== */}
      <section className="relative min-h-[75vh] flex items-center bg-gradient-to-br from-sarvodaya-dark via-slate-900 to-slate-950 text-white overflow-hidden py-16 md:py-24 border-b border-white/5">
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 grid-medical-pattern opacity-10 pointer-events-none"></div>
        
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sarvodaya-blue/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <p className="text-sarvodaya-orange text-xs md:text-sm font-black uppercase tracking-widest">
                Our Medical Experts are here for you.
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
                Get quality medical care <br className="hidden md:inline" />
                and treatment with us.
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Find the required doctor and schedule your appointment now.
              </p>
            </div>

            {/* Right Graphics Column */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
              <div className="relative max-w-[420px] lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/50">
                <img 
                  src="/group-doctor.png" 
                  alt="Om Chaudhary Hospital Doctors Panel"
                  className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== INTERSECTING CALLBACK SEARCH FORM ==================== */}
      <section className="relative z-20 px-4 -mt-12">
        <div className="max-w-4xl mx-auto bg-white border border-gray-150 rounded-3xl shadow-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Doctor/Specialty Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5.5 h-5.5 text-sarvodaya-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Doctor / Specialities"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-sarvodaya-blue"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5.5 h-5.5 text-sarvodaya-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-sarvodaya-blue appearance-none cursor-pointer"
            >
              <option value="">Select Location</option>
              <option value="Greater Noida West">Greater Noida West</option>
              <option value="Sector 8, Faridabad">Sector 8, Faridabad</option>
              <option value="Sector 19, Faridabad">Sector 19, Faridabad</option>
              <option value="Palwal Health Clinic">Palwal Health Clinic</option>
            </select>
          </div>

          {/* Book Appointment Submit CTA */}
          <Link
            href={`/book-appointment?location=${encodeURIComponent(selectedLocation)}&query=${encodeURIComponent(searchQuery)}`}
            className="w-full py-3 bg-sarvodaya-orange text-white text-xs font-bold rounded-2xl text-center hover:bg-sarvodaya-orange-hover hover:scale-[1.02] shadow-md transition-all flex items-center justify-center gap-2"
          >
            Book Appointment
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ==================== QUICK ACCESS PORTAL BAR ==================== */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Link href="/book-appointment" className="flex items-center gap-3.5 p-4 bg-white border border-gray-150 rounded-2xl hover:bg-slate-50 transition-colors group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sarvodaya-blue flex items-center justify-center flex-shrink-0 border border-sky-100/50">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-sarvodaya-blue transition-colors leading-tight">Get Health Checkup</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-none">Preventive packages</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-3.5 p-4 bg-white border border-gray-150 rounded-2xl hover:bg-slate-50 transition-colors group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 border border-cyan-100/50">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-cyan-600 transition-colors leading-tight">Homecare Services</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-none">Clinical care at home</p>
            </div>
          </Link>

          <Link href="/appointment-status" className="flex items-center gap-3.5 p-4 bg-white border border-gray-150 rounded-2xl hover:bg-slate-50 transition-colors group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100/50">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">Book diagnostic Test</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-none">Lab path tests active</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-3.5 p-4 bg-white border border-gray-150 rounded-2xl hover:bg-slate-50 transition-colors group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-650 flex items-center justify-center flex-shrink-0 border border-red-100/50">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A2.5 2.5 0 0019 9.5V8a2 2 0 00-2-2h-3.5A1.5 1.5 0 0112 4.5V3a2 2 0 00-2-2H8a2 2 0 00-2 2v.935" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">International Patients</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-none">Specialized assistance</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ==================== CORE CLINICAL CAPABILITIES ==================== */}
      <section className="section bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sarvodaya-blue rounded-full text-xs font-bold tracking-wider mb-4 border border-sky-100/30">
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

      {/* ==================== DEPARTMENTS TAB SWITCHER SPOTLIGHT & BODY PART SELECTOR ==================== */}
      <section className="section bg-slate-50/60 border-t border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Centres of Excellence (Col-span 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sarvodaya-blue rounded-full text-xs font-bold tracking-wide mb-3">
                  <span className="w-1.5 h-1.5 bg-sarvodaya-blue rounded-full"></span>
                  Centres of Clinical Excellence
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  Featured Specialties Spotlight
                </h2>
                <p className="text-gray-500 text-xs mt-1.5 font-medium">
                  Click on any clinical tab below to explore our major treatments, diagnostics and doctors.
                </p>
              </div>

              {/* Dynamic Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {departments.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDeptTab(d.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all ${
                      activeDeptTab === d.id
                        ? 'bg-sarvodaya-blue text-white shadow-md shadow-sarvodaya-blue/15'
                        : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              {/* Spotlight Details Card */}
              <div className="bg-white border border-gray-150 rounded-3xl shadow-lg p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-flex px-2.5 py-1 bg-sky-50 text-sarvodaya-blue text-[9px] font-black uppercase tracking-wider rounded-md">
                    Featured Department
                  </div>
                  <h3 className="text-xl font-black text-gray-900">{activeDeptInfo.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">{activeDeptInfo.description}</p>
                  
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                      State-of-the-art ICU & inpatient bed facility
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                      Consultations with senior board-certified specialists
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <Link href="/book-appointment" className="btn-orange py-2 px-5 text-xs font-bold">
                      Book Slot Now
                    </Link>
                    <Link href="/departments" className="inline-flex items-center text-xs font-extrabold text-gray-600 hover:text-sarvodaya-blue transition-colors">
                      View All Specialties &rarr;
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-5 rounded-2xl overflow-hidden h-[200px] border border-gray-100 shadow-sm">
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
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Body Part Symptom Selector (Col-span 5) */}
            <div className="lg:col-span-5 bg-white border border-gray-150 rounded-3xl shadow-xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sarvodaya-blue/5 rounded-full blur-2xl"></div>
              
              <div className="space-y-1.5 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-sarvodaya-orange rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-sarvodaya-orange rounded-full"></span>
                  Symptom Guidance
                </span>
                <h3 className="text-xl font-black text-gray-900">Unsure of your Speciality?</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  Select the body part or organ where you are experiencing symptoms, and we will recommend the right clinical specialist.
                </p>
              </div>

              {/* Organ Selector Dropdown */}
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Select Organ / Body Part</label>
                <div className="relative">
                  <select
                    value={selectedOrgan}
                    onChange={e => setSelectedOrgan(e.target.value)}
                    className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sarvodaya-blue appearance-none cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <option value="">Choose Symptom Location...</option>
                    <option value="brain">Brain / Head / Spinal Cord</option>
                    <option value="heart">Heart / Chest Pain</option>
                    <option value="knee">Knee / Joint Pain</option>
                    <option value="shoulder">Shoulder / Bone Fracture</option>
                    <option value="spine">Spine / Back Ache</option>
                    <option value="stomach">Stomach / Digestive System</option>
                    <option value="kidney">Kidneys / Bladder / Dialysis</option>
                    <option value="eyes">Eyes / Ophthalmic / Vision</option>
                    <option value="ear">Ear, Nose or Throat</option>
                    <option value="skin">Skin / Rashes / Allergy</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic recommendation output */}
              <div className="min-h-[140px] flex flex-col justify-center">
                {recommendedSpecialty ? (
                  <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4.5 space-y-3 animate-scale-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-sarvodaya-orange uppercase tracking-wider">Recommended Specialty</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-sarvodaya-dark">{recommendedSpecialty.dept} Department</h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed font-semibold">{recommendedSpecialty.desc}</p>
                    </div>
                    <Link
                      href={`/book-appointment?query=${encodeURIComponent(recommendedSpecialty.dept)}`}
                      className="w-full py-2.5 bg-sarvodaya-blue text-white text-xs font-bold rounded-xl text-center hover:bg-sarvodaya-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Book {recommendedSpecialty.dept} Specialist
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 space-y-2">
                    <svg className="w-8 h-8 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-xs font-semibold leading-relaxed">
                      Select your symptom location above, and we will highlight the recommended specialty path for you.
                    </p>
                  </div>
                )}
              </div>

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sarvodaya-blue rounded-full text-xs font-bold tracking-wider mb-4 border border-sky-100/30">
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
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                </div>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sarvodaya-blue flex items-center justify-center font-extrabold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-xs">{t.name}</p>
                    <p className="text-gray-500 text-[10px] uppercase font-bold mt-0.5">{t.role}</p>
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
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4.5 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-extrabold text-gray-950 text-sm sm:text-base">{faq.question}</span>
                    <span className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-sky-50 text-sarvodaya-blue' : ''}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-48 border-t border-gray-100' : 'max-h-0'}`}>
                    <p className="px-6 py-4.5 text-gray-605 text-xs sm:text-sm leading-relaxed bg-slate-50/20">{faq.answer}</p>
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
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sarvodaya-dark via-slate-800 to-slate-900 p-8 md:p-16 shadow-2xl">
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
                <Link href="/book-appointment" className="btn-orange btn-lg shadow-lg hover:shadow-xl hover:shadow-sarvodaya-orange/20 text-base py-4 px-8 flex items-center justify-center">
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
