import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devResetToken, setDevResetToken] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSubmitted(true);
      if (res.data?.resetToken) {
        setDevResetToken(res.data.resetToken);
      }
    } catch (err) {
      toast.error(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#0E1217] flex flex-col pt-20 sm:pt-24 justify-between selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Navbar */}
      <PublicNavbar theme="blue" />

      {/* Main Form Container */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center gap-2.5 mb-4 group">
          <img
            src="/assets/asnad-icon-blue-transparent.png"
            alt="ASNAD Icon"
            onError={(e) => {
              e.currentTarget.src = '/logo.svg';
            }}
            className="w-9 h-9 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
          />
          <img
            src="/assets/asnad-wordmark-blue-transparent.png"
            alt="ASNAD"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
          />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-1.5 text-xs text-gray-500">
          Enter your email to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-surface-dark-card py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-gray-200/80 dark:border-surface-dark-border">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-10 h-10" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Instructions Sent
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
              </p>

              {devResetToken && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 text-left">
                  <span className="font-bold block mb-1">Development Reset Link:</span>
                  <Link
                    to={`/reset-password?token=${devResetToken}`}
                    className="text-brand-blue underline break-all font-mono text-[11px]"
                  >
                    Click here to reset password directly
                  </Link>
                </div>
              )}

              <div className="pt-4">
                <Link to="/login">
                  <Button variant="outline" size="sm" icon={ArrowLeft} className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                icon={Mail}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full mt-2"
                icon={ArrowRight}
              >
                Send Instructions
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>

      {/* Dark Navy Footer */}
      <footer className="bg-[#050E1D] text-white/70 text-xs py-10 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-400">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/asnad-icon-blue-transparent.png"
                alt="ASNAD Icon"
                className="w-6 h-6 object-contain"
              />
              <img
                src="/assets/asnad-wordmark-blue-transparent.png"
                alt="ASNAD"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="h-6 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p>© {new Date().getFullYear()} ASNAD Document Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
