'use client';

import { useState } from 'react';
import Link from 'next/link';
import PatientChat from '@/components/PatientChat';

export default function PatientPortalPage() {
  const [tab, setTab] = useState('profile');

  const sections = {
    profile: () => (
      <div style={{ padding: '24px' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Profile</h2>
        <p className="text-gray-600">This section will display your personal details, contact information, and medical history.</p>
        <p className="mt-4 text-sm text-gray-500">Loading profile data...</p>
      </div>
    ),
    appointments: () => (
      <div style={{ padding: '24px' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Appointments</h2>
        <p className="text-gray-600">Your upcoming and past appointments will be listed here.</p>
        <p className="mt-4 text-sm text-gray-500">Loading appointments...</p>
      </div>
    ),
    billing: () => (
      <div style={{ padding: '24px' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Billing</h2>
        <p className="text-gray-600">View invoices, payment history, and insurance claims.</p>
        <p className="mt-4 text-sm text-gray-500">Loading billing data...</p>
      </div>
    ),
    messaging: () => (
      <div style={{ padding: '24px' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messaging</h2>
        <p className="text-gray-600">Communicate securely with your care team.</p>
        <PatientChat />
      </div>
    ),
  };

  // Simple tab navigation
  const tabOptions = [
    { key: 'profile', label: 'Profile' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'billing', label: 'Billing' },
    { key: 'messaging', label: 'Messaging' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Tab navigation */}
      <nav style={{ background: '#1e293b', color: 'white', padding: '16px' }}>
        {tabOptions.map((opt) => (
          <Link
            key={opt.key}
            href={`/?tab=${opt.key}`}
            onClick={() => setTab(opt.key)}
            style={{
              color: tab === opt.key ? '#0f465c' : 'inherit',
              marginRight: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            {opt.label}
          </Link>
        ))}
      </nav>

      {/* Main content area */}
      <main style={{ flex: 1, padding: '24px', transition: 'opacity 0.2s' }}>
        {sections[tab]()}
      </main>
    </div>
  );
}