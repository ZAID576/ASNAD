import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  HardDrive,
  KeyRound,
  EyeOff,
  Check,
  FileCheck,
  ServerOff,
  UserCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export const SecurityPage = () => {
  useSmoothScroll();

  const pillars = [
    {
      icon: ServerOff,
      title: 'Zero-Host Storage Paradigm',
      desc: '0 bytes of user documents are stored on application servers. Binary streams pass through memory buffers directly into your personal Google Drive /Asnad folder.',
    },
    {
      icon: Lock,
      title: 'Authenticated AES-256-GCM',
      desc: 'All OAuth refresh tokens and database secrets are encrypted with AES-256 in Galois/Counter Mode with 96-bit unique IVs and authenticated tags.',
    },
    {
      icon: EyeOff,
      title: 'Restricted drive.file Scope',
      desc: 'We request only https://www.googleapis.com/auth/drive.file. Asnad has mathematically zero permissions to access any other file in your Google Drive.',
    },
    {
      icon: KeyRound,
      title: 'JWT Bearer Authorization',
      desc: 'Dual-token model with Authorization Bearer headers guarantees complete protection against browser tracking prevention blockers and XSS vulnerabilities.',
    },
    {
      icon: Zap,
      title: 'Direct Browser Resumable Upload',
      desc: 'Large videos and high-res scans are uploaded directly to Google Drive resumable endpoints, completely bypassing serverless memory limits.',
    },
    {
      icon: UserCheck,
      title: 'Instant One-Click Revocation',
      desc: 'You can disconnect Asnad with one click inside Google Account Security. All tokens are instantly purged with zero loss to your existing files.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Navbar */}
      <PublicNavbar theme="blue" />

      {/* Royal Blue Hero Header */}
      <section className="relative bg-gradient-to-b from-[#0A2E73] via-[#0D44A8] to-[#1258D4] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-2">
            Zero-Trust Technical Whitepaper
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Security That Begins With True Data Custody
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            We don’t ask you to trust our cloud servers with your private documents. We engineered an architecture where our servers never touch your files in the first place.
          </p>
        </div>
      </section>

      {/* Security Content - Compact Spacing, No Dead Empty Void */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Architecture Hero Image Card */}
        <div className="p-6 sm:p-8 rounded-sm border border-gray-200 bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xs">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest">
              Architectural Boundary
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Isolated Storage Perimeter
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Under traditional cloud SaaS architectures, companies store your confidential PDFs and passports on centralized Amazon S3 or Google Cloud buckets managed under company accounts. If their infrastructure is breached, your files leak.
            </p>
            <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
              Asnad eliminates this vulnerability entirely: files reside exclusively on your personal Google Drive disks.
            </p>
          </div>
          <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src="/assets/feature-security.jpg"
              alt="Security Architecture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 6 Security Pillars - Visible by Default, No Opacity 0 Bugs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-sm border border-gray-200 bg-white hover:border-black transition flex flex-col justify-between shadow-2xs"
              >
                <div>
                  {/* RAW BLACK ICON - NO BACKGROUND CONTAINER BOX */}
                  <Icon className="w-5 h-5 text-black mb-3" strokeWidth={1.75} />
                  <h3 className="text-sm sm:text-base font-black text-black mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center gap-1.5 text-[11px] font-mono text-blue-600 font-bold">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Enforced In Production</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Verification Block */}
        <div className="p-6 rounded-sm border border-gray-200 bg-gray-50 space-y-2 font-mono text-xs">
          <div className="text-black font-bold uppercase tracking-wider text-[11px]">
            Cryptographic Authentication Tag Verification:
          </div>
          <div className="p-3 bg-white border border-gray-200 text-black text-[11px] break-all">
            CIPHER: AES-256-GCM | KEY_LEN: 32B | IV_LEN: 12B | AUTH_TAG_LEN: 16B | REASON: Authenticated Encryption
          </div>
        </div>
      </main>

      {/* Mid CTA */}
      <section className="py-14 bg-gradient-to-b from-[#0A2E73] to-[#08245C] text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Security Without Compromise
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Take full cryptographic control over your certificates, IDs, and financial files today.
          </p>
          <div className="mt-6">
            <Link to="/register">
              <button className="px-7 py-3 bg-white text-[#0A2E73] font-black text-xs uppercase tracking-wider hover:bg-gray-100 rounded-sm shadow-md transition">
                Create Your Vault
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Navy Footer */}
      <footer className="bg-[#050E1D] text-white/70 text-xs py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/asnad-icon-blue-transparent.png"
                  alt="ASNAD Icon"
                  className="w-7 h-7 object-contain"
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
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/security" className="hover:text-white transition font-bold text-white">Security Architecture</Link></li>
                <li><Link to="/guides" className="hover:text-white transition">Guides & Docs</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Direct Contact</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="tel:+917061838495" className="hover:text-white transition">
                    +91 7061838495
                  </a>
                </li>
                <li>
                  <a href="mailto:syedimranh59@gmail.com" className="hover:text-white transition">
                    syedimranh59@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <p>© {new Date().getFullYear()} ASNAD Document Vault. All rights reserved.</p>
            <p>Engineered with Zero-Host Security for absolute privacy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
