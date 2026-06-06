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
    <section className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white border border-gray-150/80 rounded-3xl p-8 shadow-sm">
          {/* Brand Logo & Name */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl text-2xl mb-4 hover:scale-105 transition-transform">
              🏥
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 text-xs mt-1.5">
              Sign in to access your Om Chaudhary Hospital account
            </p>
          </div>

          {/* Session Expired Alert */}
          {expired && (
            <div className="p-4 mb-6 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold text-center animate-pulse">
              Your session has expired. Please log in again.
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="input-label">Email Address</label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="input-label mb-0">Password</label>
              </div>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Sign In'
              )}
            </button>
          </form>

          {/* Alternate Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              Don't have an account?{' '}
              <Link href={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="text-primary-600 font-bold hover:underline">
                Create patient account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-1 opacity-90 shadow-sm">
          <p className="font-bold text-center border-b border-white/10 pb-1 mb-1 text-cyan-400">System Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2 text-white/80">
            <div><strong>Role</strong></div>
            <div><strong>Credentials (Email / Password)</strong></div>
            <div className="text-cyan-300 font-medium">Super Admin:</div>
            <div className="font-mono">admin@omchaudharyhospital.com / Admin@123</div>
          </div>
          <p className="text-[10px] text-white/50 text-center mt-2 italic pt-1 border-t border-white/5">
            * Or register as a new patient above.
          </p>
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
