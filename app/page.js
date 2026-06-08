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
  { id: 'dept-gynecology', name: 'Gynecology & Obstetrics', description: 'Compassionate and expert health services for women from adolescence through motherhood.' },
  { id: 'dept-oncology', name: 'Oncology / Cancer Care', description: 'Advanced oncology services with compassionate chemotherapy and surgical care.' },
  { id: 'dept-urology', name: 'Urology / Kidney Care', description: 'Advanced urological diagnosis, dialysis support, and key urology surgeries.' },
];

const hospitalFeatures = [
  {
    icon: IconEmergency,
    title: '24/7 Emergency Care',
    description: 'Immediate trauma response, critical care transport, and emergency surgical teams available around the clock.',
    style: 'border-red-100 bg-red-50 text-red-650 shadow-sm shadow-red-100/50'
  },
  {
    icon: IconGeneralMedicine,
    title: 'Specialized Consultants',
    description: 'Direct consultations with award-winning experts in Cardiology, Orthopedics, and Neurology.',
    style: 'border-sky-100 bg-sky-50 text-sarvodaya-blue shadow-sm shadow-sky-100/50'
  },
  {
    icon: IconShield,
    title: 'Certified Safety Standards',
    description: 'Rigorous sanitation, digital healthcare tracking, and international patient safety protocols.',
    style: 'border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/50'
  },
  {
    icon: IconPathology,
    title: 'Advanced Diagnostics',
    description: 'Fully automated lab services, CT Scan, High-Res Ultrasound, and radiology reporting.',
    style: 'border-purple-100 bg-purple-50 text-purple-600 shadow-sm shadow-purple-100/50'
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
    kidney: { dept: 'Urology / Kidney Care', desc: 'Advanced kidney, bladder, prostate, and urinary tract treatments.' },
    urinary: { dept: 'Urology / Kidney Care', desc: 'Urinary tract disorders and urology surgery.' },
    stomach: { dept: 'General Medicine', desc: 'Digestive tract care and internal medicine.' },
    intestine: { dept: 'General Medicine', desc: 'Internal medicine and diagnostic pathology.' },
    eyes: { dept: 'General Medicine', desc: 'Primary ophthalmic screenings.' },
    ear: { dept: 'General Medicine', desc: 'ENT general wellness screenings.' },
    nose: { dept: 'General Medicine', desc: 'ENT general wellness screenings.' },
    throat: { dept: 'General Medicine', desc: 'ENT general wellness screenings.' },
    skin: { dept: 'General Medicine', desc: 'Dermatological screening support.' },
    pregnancy: { dept: 'Gynecology & Obstetrics', desc: 'Maternity, high-risk pregnancy, and comprehensive women health.' },
    uterus: { dept: 'Gynecology & Obstetrics', desc: 'Specialized gynecological care and surgery.' },
    tumor: { dept: 'Oncology / Cancer Care', desc: 'Advanced oncology diagnosis, screening, and therapy.' },
  };

  const recommendedSpecialty = selectedOrgan ? ORGAN_RECOMMENDATIONS[selectedOrgan] : null;

  return (
    <>
      {/* ==================== HERO SECTION (Corporate Deep Blue Banner) ==================== */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-sarvodaya-dark via-slate-900 to-slate-950 text-white overflow-hidden py-16 md:py-24 border-b border-white/5">
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 grid-medical-pattern opacity-10 pointer-events-none"></div>
        
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sarvodaya-blue/15 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sarvodaya-orange/10 border border-sarvodaya-orange/30 text-sarvodaya-orange rounded-full text-xs font-bold tracking-wider mb-2 animate-pulse mx-auto lg:mx-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Trusted Healthcare Partner
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
                Get World-Class <br className="hidden md:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-sarvodaya-orange">Medical Care</span> & Treatment
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Om Chaudhary Hospital provides expert critical care, advanced diagnostics, and surgical excellence in your region.
              </p>

              {/* Trust checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto lg:mx-0 pt-2 text-left">
                {[
                  "24x7 Ambulance & ICU Support",
                  "Modular Operation Theatres (OT)",
                  "Senior Specialty Consultants",
                  "Cashless Insurance/TPA Helpdesk"
                ].map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                <Link href="/book-appointment" className="w-full sm:w-auto px-8 py-3.5 bg-sarvodaya-orange text-white text-xs font-black rounded-2xl text-center hover:bg-sarvodaya-orange-hover hover:scale-[1.02] hover:shadow-lg hover:shadow-sarvodaya-orange/20 transition-all flex items-center justify-center gap-2">
                  Book Appointment Slot
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/doctors" className="w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white/50 text-white text-xs font-black rounded-2xl text-center hover:bg-white/5 transition-all">
                  Meet Our Doctors
                </Link>
              </div>
            </div>

            {/* Right Graphics Column */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
              {/* Overlay Glass Card 1 (Top Left) */}
              <div className="absolute -top-3 -left-3 z-20 bg-white/10 backdrop-blur-md p-3.5 flex items-center gap-2.5 rounded-2xl border border-white/20 shadow-2xl animate-float">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 font-extrabold text-sm">
                  ★
                </div>
                <div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-wider leading-none">Patient Trust</p>
                  <p className="text-xs font-black text-white mt-0.5">4.9/5 Rating</p>
                </div>
              </div>

              {/* Overlay Glass Card 2 (Bottom Right) */}
              <div className="absolute -bottom-3 -right-3 z-20 bg-white/10 backdrop-blur-md p-3.5 flex items-center gap-2.5 rounded-2xl border border-white/20 shadow-2xl animate-float [animation-delay:2s]">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-extrabold text-xs">
                  ✚
                </div>
                <div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-wider leading-none">Emergency Care</p>
                  <p className="text-xs font-black text-white mt-0.5">24/7 Level-1 Trauma</p>
                </div>
              </div>

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
        <div className="max-w-3xl mx-auto bg-white border border-gray-150 rounded-3xl shadow-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Doctor/Specialty Search */}
          <div className="relative md:col-span-2">
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

          {/* Book Appointment Submit CTA */}
          <Link
            href={`/book-appointment?query=${encodeURIComponent(searchQuery)}`}
            className="w-full py-3 bg-sarvodaya-orange text-white text-xs font-bold rounded-2xl text-center hover:bg-sarvodaya-orange-hover hover:scale-[1.02] shadow-md transition-all flex items-center justify-center gap-2 md:col-span-1"
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
      <section className="section bg-slate-50/45 pt-24 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-50/60 text-sarvodaya-blue rounded-full text-xs font-bold tracking-wider mb-4 border border-sky-100/50">
              <IconSparkles className="w-3.5 h-3.5" />
              Clinical Quality
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Hospital Facilities & Services
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              We offer advanced medical standards across diagnostics, emergency care, and specialist consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitalFeatures.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div key={feat.title} className="rounded-3xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(15,70,92,0.06)] hover:-translate-y-1.5 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${feat.style}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-2">{feat.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== OUR SPECIALITIES & SYMPTOM GUIDANCE ==================== */}
      <section className="section bg-white py-20 border-t border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Our Specialities Grid (Col-span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-sarvodaya-dark leading-tight">
                  Our Specialities
                </h2>
              </div>

              {/* 3x3 Grid of Specialties */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                {departments.map((dept) => {
                  return (
                    <Link
                      key={dept.id}
                      href={`/book-appointment?query=${encodeURIComponent(dept.name)}`}
                      className="flex items-center gap-3.5 p-4 bg-white border border-gray-150 rounded-2xl hover:border-sarvodaya-blue hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sarvodaya-blue flex items-center justify-center flex-shrink-0 group-hover:bg-sarvodaya-blue group-hover:text-white transition-colors duration-300">
                        {dept.id === 'dept-emergency' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        ) : dept.id === 'dept-cardiology' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        ) : dept.id === 'dept-orthopedics' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        ) : dept.id === 'dept-neurology' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        ) : dept.id === 'dept-pediatrics' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : dept.id === 'dept-general' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                          </svg>
                        ) : dept.id === 'dept-gynecology' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : dept.id === 'dept-oncology' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] font-bold text-gray-800 group-hover:text-sarvodaya-blue transition-colors leading-tight">
                        {dept.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Grid Footer / View All & Sliders */}
              <div className="flex items-center justify-between pt-2">
                <Link href="/departments" className="text-xs font-black text-sarvodaya-blue hover:underline flex items-center gap-1">
                  View All
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="flex gap-2">
                  <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-sarvodaya-blue hover:border-sarvodaya-blue transition-colors">
                    &larr;
                  </button>
                  <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-sarvodaya-blue hover:border-sarvodaya-blue transition-colors">
                    &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Unsure of the Speciality? (Col-span 5) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 via-blue-50/30 to-white border border-sky-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sarvodaya-blue/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/10 text-sky-700 rounded-full text-[9px] font-black uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                  Interactive Symptom Guide
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">Unsure of the speciality?</h3>
                <p className="text-gray-500 text-xs font-semibold">Select where you feel pain or discomfort</p>
              </div>

              {/* Organ Selector Dropdown */}
              <div className="relative z-10">
                <div className="relative">
                  <select
                    value={selectedOrgan}
                    onChange={e => setSelectedOrgan(e.target.value)}
                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-xs text-gray-900 font-extrabold focus:outline-none focus:ring-2 focus:ring-sarvodaya-orange focus:border-sarvodaya-orange appearance-none cursor-pointer hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <option value="">Select</option>
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
                    <option value="pregnancy">Pregnancy / Women Health</option>
                    <option value="tumor">Tumors / Unexplained Growth</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic recommendation output */}
              <div className="flex-1 flex flex-col justify-center min-h-[120px] relative z-10">
                {recommendedSpecialty ? (
                  <div className="space-y-4 animate-scale-in">
                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        href={`/book-appointment?query=${encodeURIComponent(recommendedSpecialty.dept)}`}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-150 rounded-2xl hover:border-sarvodaya-blue hover:shadow-lg transition-all group cursor-pointer shadow-sm"
                      >
                        <div className="w-11 h-11 rounded-xl bg-sky-50 text-sarvodaya-blue flex items-center justify-center flex-shrink-0 group-hover:bg-sarvodaya-blue group-hover:text-white transition-colors duration-300">
                          {recommendedSpecialty.dept.includes('Orthopedics') ? (
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          ) : recommendedSpecialty.dept.includes('Cardiology') ? (
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          ) : recommendedSpecialty.dept.includes('Neurology') ? (
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          ) : recommendedSpecialty.dept.includes('Gynecology') ? (
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          ) : recommendedSpecialty.dept.includes('Oncology') ? (
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          ) : (
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-[13px] font-black text-gray-900 group-hover:text-sarvodaya-blue transition-colors leading-tight">
                                {recommendedSpecialty.dept}
                              </h4>
                              <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase">Match</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 leading-tight group-hover:text-gray-500 transition-colors font-medium">
                              {recommendedSpecialty.desc}
                            </p>
                          </div>
                          <span className="text-[10px] font-extrabold text-sarvodaya-blue bg-sky-50 group-hover:bg-sarvodaya-blue group-hover:text-white px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap shadow-sm group-hover:translate-x-1">
                            Book Slot
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-sky-200 rounded-2xl p-6 text-center text-gray-400 bg-white/50 shadow-inner">
                    <svg className="w-8 h-8 text-sky-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-xs font-semibold leading-relaxed text-sky-500/80">
                      Select your symptom location above, and we will highlight the recommended specialty path for you.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== PREVENTIVE HEALTH SCREENING PACKAGES ==================== */}
      <section className="section bg-slate-50/50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sarvodaya-orange/10 text-sarvodaya-orange rounded-full text-xs font-bold tracking-wider mb-4 border border-sarvodaya-orange/20">
              <IconSparkles className="w-3.5 h-3.5" />
              Preventive Care
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Preventive Health Packages
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Early detection saves lives. Choose from our curated medical checkups designed for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Package 1 */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm hover:shadow-xl hover:border-sarvodaya-blue/30 transition-all duration-300 hover-lift flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-sky-50 text-sarvodaya-blue px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">Annual Wellness</span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">Basic Health Checkup</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 line-through font-semibold leading-none">₹1,999</p>
                    <p className="text-xl font-black text-sarvodaya-blue mt-1">₹999</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-6">A complete diagnostic panel matching key health indicators.</p>
                
                <hr className="border-gray-100 my-4" />
                
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Includes 24 Parameters:</h4>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Complete Blood Count (CBC)",
                    "Blood Sugar Fasting (FBS)",
                    "Urine Routine & Analysis",
                    "Serum Creatinine (Kidney)",
                    "General Physician Consultation"
                  ].map((test, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/book-appointment?package=basic-health" className="w-full py-3 bg-slate-50 hover:bg-sarvodaya-blue hover:text-white text-gray-700 text-xs font-bold rounded-2xl text-center shadow-sm transition-all flex items-center justify-center gap-1.5 border border-gray-200 hover:border-sarvodaya-blue">
                Book Package Now
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Package 2 */}
            <div className="bg-white rounded-3xl border-2 border-sarvodaya-blue p-6 shadow-md hover:shadow-xl transition-all duration-300 hover-lift relative flex flex-col justify-between">
              <span className="absolute -top-3.5 left-6 bg-gradient-to-r from-sarvodaya-orange to-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                ★ Best Selling
              </span>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">Cardiac Care</span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">Executive Cardiac Check</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 line-through font-semibold leading-none">₹4,999</p>
                    <p className="text-xl font-black text-rose-600 mt-1">₹2,499</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-6">Designed to evaluate your cardiac function and lipid profile metrics.</p>
                
                <hr className="border-gray-100 my-4" />
                
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Includes Cardiac Suite:</h4>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Electrocardiogram (ECG)",
                    "Complete Lipid Profile Screening",
                    "Treadmill Test (TMT) / Echocardiogram",
                    "HbA1c & Blood Sugar Levels",
                    "Senior Cardiologist Consultation"
                  ].map((test, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/book-appointment?package=cardiac-care" className="w-full py-3 bg-sarvodaya-blue hover:bg-sarvodaya-dark text-white text-xs font-bold rounded-2xl text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 border border-transparent">
                Book Package Now
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Package 3 */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm hover:shadow-xl hover:border-sarvodaya-blue/30 transition-all duration-300 hover-lift flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">Senior Citizen Special</span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">Senior Active Care</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 line-through font-semibold leading-none">₹3,999</p>
                    <p className="text-xl font-black text-amber-600 mt-1">₹1,999</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-6">Comprehensive diagnostic panel focused on bones, liver, and kidneys.</p>
                
                <hr className="border-gray-100 my-4" />
                
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Includes Elder Panel:</h4>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Kidney & Liver Function Screening",
                    "Bone Health (Calcium & Vit D3)",
                    "Uric Acid & Joint Markers",
                    "Complete Blood Profile (CBC)",
                    "Senior Consultant Physician Review"
                  ].map((test, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/book-appointment?package=senior-care" className="w-full py-3 bg-slate-50 hover:bg-sarvodaya-blue hover:text-white text-gray-700 text-xs font-bold rounded-2xl text-center shadow-sm transition-all flex items-center justify-center gap-1.5 border border-gray-200 hover:border-sarvodaya-blue">
                Book Package Now
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
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

      {/* ==================== HOSPITAL INFRASTRUCTURE & AMENITIES ==================== */}
      <section className="section bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sarvodaya-blue rounded-full text-xs font-bold tracking-wider mb-4 border border-sky-100/30">
              <span className="w-1.5 h-1.5 rounded-full bg-sarvodaya-blue"></span>
              State-Of-The-Art Facilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Hospital Infrastructure & Amenities
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              We invest in advanced medical technology and modern infrastructure to ensure the highest standard of patient safety and clinical outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Modular OTs",
                badge: "Sterile Environment",
                desc: "Equipped with HEPA-filtered laminar airflow systems that maintain zero-bacteria zones for high-precision orthopedic joint replacement and emergency trauma surgeries.",
                bg: "bg-blue-50/40 border-blue-100 text-sarvodaya-blue",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Advanced ICU Wards",
                badge: "24/7 Critical Care",
                desc: "Multi-bed ICU outfitted with high-end mechanical ventilators, multi-channel cardiac monitors, defibrillators, and continuous specialist physician monitoring.",
                bg: "bg-red-50/40 border-red-100 text-red-650",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              {
                title: "Radiology Suite",
                badge: "Advanced Imaging",
                desc: "High-resolution ultrasound scanner, multi-slice diagnostic CT scan, and digital X-ray machines active round-the-clock for swift trauma detection.",
                bg: "bg-purple-50/40 border-purple-100 text-purple-650",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517" />
                  </svg>
                )
              },
              {
                title: "Pathology Laboratory",
                badge: "Accurate & Automated",
                desc: "In-house automated lab analyzer for quick-turnaround hematology, biochemistry, hormone assay, and routine diagnostic tests.",
                bg: "bg-emerald-50/40 border-emerald-100 text-emerald-650",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707" />
                  </svg>
                )
              }
            ].map((infra, idx) => (
              <div key={idx} className="rounded-3xl border border-gray-150 bg-white p-6 hover:shadow-xl hover:border-sarvodaya-blue/30 transition-all duration-300 hover-lift flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${infra.bg}`}>
                    {infra.icon}
                  </div>
                  <span className="text-[9px] bg-slate-100 text-gray-500 font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                    {infra.badge}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-base mt-2.5 mb-2">{infra.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{infra.desc}</p>
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
