'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirect = searchParams.get('redirect') || '';
  const expired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful login, redirect to dashboard
        router.push(redirect || data.redirect);
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password.');
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

        {/* Middle: Feature Highlights */}
        <div className="z-10 max-w-md space-y-8 my-auto">
          <div className="space-y-3">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-[10px] font-black tracking-widest uppercase rounded-full">
              Hospital Portal
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Advanced Healthcare, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-450">Compassionate Care.</span>
            </h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              Sign in to manage patient records, book medical visits, track clinical diagnostics, and consult with specialists.
            </p>
          </div>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
              <span className="text-2xl p-2 bg-cyan-500/10 rounded-xl h-fit">🩹</span>
              <div>
                <h3 className="font-bold text-sm text-cyan-300">24/7 Trauma & Emergency</h3>
                <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                  Immediate emergency care backed by top critical-care physicians and modern trauma infrastructure.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
              <span className="text-2xl p-2 bg-blue-500/10 rounded-xl h-fit">👨‍⚕️</span>
              <div>
                <h3 className="font-bold text-sm text-cyan-300">Expert Medical Roster</h3>
                <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                  Direct scheduling with board-certified surgeons, specialist cardiologists, pediatricians, and general practitioners.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/10">
              <span className="text-2xl p-2 bg-indigo-500/10 rounded-xl h-fit">🔬</span>
              <div>
                <h3 className="font-bold text-sm text-cyan-300">Labs & Diagnostics Access</h3>
                <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                  Online delivery of clinical blood panels, radiology reports, ECG, and pathology sheets directly to patients.
                </p>
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 relative overflow-y-auto bg-white min-h-screen">
        {/* Glow blobs on mobile background */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100/20 rounded-full blur-3xl lg:hidden"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl lg:hidden"></div>

        <div className="max-w-md w-full relative z-10 space-y-8">
          {/* Mobile Back to Home Navigation */}
          <div className="lg:hidden flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group text-slate-900">
              <span className="text-xl bg-primary-50 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-200">🏥</span>
              <span className="font-extrabold text-xs uppercase tracking-wide">Om Chaudhary Hospital</span>
            </Link>
            <Link href="/" className="text-xs text-slate-400 font-bold hover:text-slate-650 flex items-center gap-1">
              ← Home
            </Link>
          </div>

          <div className="space-y-6">
            {/* Logo & title */}
            <div className="space-y-2.5">
              <Link href="/" className="hidden lg:inline-flex items-center justify-center w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl text-3xl mb-2 hover:scale-105 transition-transform shadow-sm">
                🏥
              </Link>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Welcome Back</h2>
              <p className="text-slate-450 text-sm font-medium">
                Enter your credentials to access your Om Chaudhary Hospital account
              </p>
            </div>

            {/* Session Expired Alert */}
            {expired && (
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold text-center animate-pulse">
                Your session has expired. Please log in again.
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none text-base">
                    ✉
                  </span>
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-slate-800 text-sm font-semibold transition-all duration-200 outline-none shadow-sm"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="login-password" className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-0">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-455 pointer-events-none text-base">
                    🔒
                  </span>
                  <input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-slate-800 text-sm font-semibold transition-all duration-200 outline-none shadow-sm"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-700 hover:to-cyan-700 active:scale-[0.98] transition-all text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-primary-950/10 disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In to Account'
                )}
              </button>
            </form>

            {/* Alternate Link */}
            <div className="text-center pt-4">
              <p className="text-slate-400 text-xs font-semibold">
                Don't have an account?{' '}
                <Link href={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="text-primary-600 font-extrabold hover:underline">
                  Create patient account
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials Hint */}
          <div className="p-6 bg-slate-900 border border-slate-800 text-white rounded-3xl text-xs space-y-3 shadow-xl">
            <p className="font-extrabold text-center border-b border-white/10 pb-2 text-cyan-400 uppercase tracking-widest text-[9px]">
              System Demo Credentials
            </p>
            <div className="space-y-2 text-white/80">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-cyan-300 font-bold">Role:</span>
                <span className="font-black bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider text-[8px]">Super Admin</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-cyan-300 font-bold">Email:</span>
                <span className="font-mono text-white/95">admin@omchaudharyhospital.com</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-cyan-300 font-bold">Password:</span>
                <span className="font-mono text-white/95">Admin@123</span>
              </div>
            </div>
            <p className="text-[9px] text-white/40 text-center mt-1 italic pt-1 border-t border-white/5">
              * Patients can self-register using the link above.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[85vh] items-center justify-center bg-gray-50/50 py-12">
        <LoadingSpinner size="lg" text="Loading login form..." />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
