import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      const res = await register({ name, email, password });
      if (res.success) {
        toast.success(`Welcome to Asnad, ${res.data.user.name}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#0E1217] flex flex-col pt-20 sm:pt-24 justify-between selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Navbar */}
      <PublicNavbar theme="blue" />

      {/* Main Register Form Container */}
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
          Create your Asnad account
        </h2>
        <p className="mt-1.5 text-xs text-gray-500">
          Start organizing your documents with personal Google Drive storage
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-surface-dark-card py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-gray-200/80 dark:border-surface-dark-border">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Syed Imran"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label="Password (min 8 characters)"
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
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            <p className="text-[11px] text-gray-500 leading-tight">
              By creating an account, you agree to store files in your own connected Google Drive.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-surface-dark-border text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-blue hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
          <span>No credit card required. Free & independent document vault.</span>
        </div>
      </div>
      </div>

      {/* Dark Navy Footer with Icon + Wordmark */}
      <footer className="bg-[#050E1D] text-white/70 text-xs py-10 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-2.5">
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
              <p className="text-[11px] leading-relaxed text-white/50">
                The zero-host personal document vault. Powered by your own Google Drive storage with end-to-end cryptographic privacy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security Architecture</Link></li>
                <li><Link to="/guides" className="hover:text-white transition">Guides & Docs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider">Direct Contact</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="tel:+917061838495" className="hover:text-white transition">+91 7061838495</a></li>
                <li><a href="mailto:syedimranh59@gmail.com" className="hover:text-white transition">syedimranh59@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} ASNAD Document Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
