import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing reset token. Please request a new password reset link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({ token, password });
      if (res.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired reset token');
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
          Create new password
        </h2>
        <p className="mt-1.5 text-xs text-gray-500">
          Enter your new password below to regain access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-surface-dark-card py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-gray-200/80 dark:border-surface-dark-border">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-10 h-10" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Password Reset Complete
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your password has been securely updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="md" className="w-full" icon={ArrowRight}>
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
                Reset Password
              </Button>
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
