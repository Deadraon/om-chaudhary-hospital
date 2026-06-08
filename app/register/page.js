'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

function RegisterForm() {
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
    <section className="min-h-screen flex flex-col lg:flex-row bg-slate-50/50 relative overflow-hidden">
      {/* Left side: Branding & Information Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-900 via-primary-950 to-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,180,216,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        {/* Top: Brand info */}
        <Link href="/" className="flex items-center gap-3 group text-white z-10 self-start">
          <span className="text-3xl bg-white/10 backdrop-blur-md p-2.5 rounded-2xl group-hover:scale-105 transition-transform duration-200 shadow-lg border border-white/10">🏥</span>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider leading-none">OM CHAUDHARY</h1>
            <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest mt-1">Hospital & Trauma Centre</p>
          </div>
        </Link>

        {/* Middle: Info Content */}
        <div className="z-10 max-w-md space-y-8 my-auto">
          <div className="space-y-3">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-[10px] font-black tracking-widest uppercase rounded-full">
              Patient Portal
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-450">In Safe Hands.</span>
            </h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              Register an account to easily book doctor visits, track all your clinical lab reports, view discharge summaries, and consult with specialists.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-xl">📅</span>
              <div>
                <h4 className="font-bold text-cyan-300">Book Instantly</h4>
                <p className="text-slate-350 mt-0.5">Select departments and view doctor availabilities in real-time.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-xl">🧪</span>
              <div>
                <h4 className="font-bold text-cyan-300">Instant Reports</h4>
                <p className="text-slate-350 mt-0.5">Download diagnostic blood tests and medical reports directly.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-xl">🔒</span>
              <div>
                <h4 className="font-bold text-cyan-300">Secure & Confidential</h4>
                <p className="text-slate-350 mt-0.5">Your medical records are fully encrypted and only visible to authorized staff.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: footer tag */}
        <div className="z-10 text-[11px] text-slate-450 font-medium">
          © {new Date().getFullYear()} Om Chaudhary Hospital. All Rights Reserved. Trusted healthcare services.
        </div>
      </div>

      {/* Right side: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto bg-slate-50/20 min-h-screen">
        {/* Glow blobs on mobile background */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100/30 rounded-full blur-3xl lg:hidden"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl lg:hidden"></div>

        <div className="max-w-md w-full relative z-10 space-y-6">
          {/* Mobile Back to Home Navigation */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center gap-2 group text-slate-900">
              <span className="text-xl bg-primary-50 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-200">🏥</span>
              <span className="font-bold text-xs uppercase tracking-wide">Om Chaudhary Hospital</span>
            </Link>
            <Link href="/" className="text-xs text-gray-400 font-bold hover:text-gray-650 flex items-center gap-1">
              ← Home
            </Link>
          </div>

          <div className="bg-white border border-gray-150/80 rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-100">
            {/* Brand Logo & Name */}
            <div className="text-center mb-6">
              <Link href="/" className="hidden lg:inline-flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl text-2xl mb-4 hover:scale-105 transition-transform shadow-sm">
                🏥
              </Link>
              <h2 className="text-2xl font-extrabold text-gray-900">Create Patient Account</h2>
              <p className="text-gray-500 text-xs mt-1.5 font-medium">
                Register as a patient to book appointments and track your health records online.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 mb-5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="input-label">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 pointer-events-none text-sm">
                    👤
                  </span>
                  <input
                    type="text"
                    id="reg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-9 text-xs"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="input-label">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 pointer-events-none text-sm">
                    ✉
                  </span>
                  <input
                    type="email"
                    id="reg-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-9 text-xs"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" className="input-label">Phone Number *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 pointer-events-none text-sm">
                    📞
                  </span>
                  <input
                    type="tel"
                    id="reg-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="input-field pl-9 text-xs"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="input-label">Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-455 pointer-events-none text-sm">
                    🔒
                  </span>
                  <input
                    type="password"
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-9 text-xs"
                    placeholder="Minimum 6 characters"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-700 hover:to-cyan-700 active:scale-[0.99] transition-all text-white font-bold rounded-xl text-xs shadow-md shadow-primary-950/10 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
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
                <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-primary-600 font-extrabold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[90vh] items-center justify-center bg-gray-50/50 py-12">
        <LoadingSpinner size="lg" text="Loading signup form..." />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
