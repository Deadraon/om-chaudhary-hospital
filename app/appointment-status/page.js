import StatusLookup from './StatusLookup';

const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';

export const metadata = {
  title: `Check Appointment Status | ${HOSPITAL_NAME}`,
  description: `Check the status of your outpatient appointment request at ${HOSPITAL_NAME} by entering your registered mobile number.`,
};

export default function AppointmentStatusPage() {
  return (
    <>
      {/* Page Header */}
      <section className="relative py-20 gradient-hero overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Appointment Status</h1>
          <p className="text-lg text-white/70">
            Track your appointment progress and details instantly using your phone number.
          </p>
        </div>
      </section>

      {/* Main Status Lookup Layout */}
      <section className="section bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatusLookup />
        </div>
      </section>
    </>
  );
}
