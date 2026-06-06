import { headers } from 'next/headers';
import DashboardSidebar from '@/components/DashboardSidebar';

export const metadata = {
  title: 'Dashboard | Hospital Portal',
  description: 'Manage appointments, patients, medical records, and hospital operations.',
};

export default function DashboardLayout({ children }) {
  // Read request headers set by middleware
  const headerList = headers();
  const userId = headerList.get('x-user-id') || '';
  const userRole = headerList.get('x-user-role') || 'patient';
  const userName = headerList.get('x-user-name') || 'User';

  const user = {
    id: userId,
    role: userRole,
    name: userName,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <DashboardSidebar user={user} />

      {/* Main Content Pane */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Welcome Notification Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-250 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hospital Portal</h1>
            <p className="text-gray-500 text-xs">Om Chaudhary Hospital & Trauma Centre Portal</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-2xl text-xs font-semibold text-gray-750 shadow-inner">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            Session Active
          </div>
        </div>

        {/* Dashboard child pages */}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
