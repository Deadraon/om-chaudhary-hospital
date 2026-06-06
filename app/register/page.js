'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful signup & login, redirect to patient dashboard
        router.push(redirect || data.redirect);
        router.refresh();
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white border border-gray-150/80 rounded-3xl p-8 shadow-sm">
          {/* Logo & title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl text-2xl mb-4 hover:scale-105 transition-transform">
              🏥
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Create Patient Account</h2>
            <p className="text-gray-500 text-xs mt-1.5">
              Register as a patient to book appointments and track your health records online.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="input-label">Full Name *</label>
              <input
                type="text"
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="input-label">Email Address *</label>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="reg-phone" className="input-label">Phone Number *</label>
              <input
                type="tel"
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="input-field"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="input-label">Password *</label>
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Minimum 6 characters"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account & Login'
              )}
            </button>
          </form>

          {/* Alternate Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              Already have an account?{' '}
              <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-primary-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
