import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileCheck, Shield, Phone, Mail, Check } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export const TermsPage = () => {
  useSmoothScroll();
  const phoneNumber = '+91 7061838495';
  const emailAddress = 'syedimranh59@gmail.com';

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Navbar */}
      <PublicNavbar theme="blue" />

      {/* Royal Blue Hero Header */}
      <section className="relative bg-gradient-to-b from-[#0A2E73] via-[#0D44A8] to-[#1258D4] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-3">
            Legal Terms & Fair Usage Agreement
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Last Updated: November 2026 • Effective For All Users Worldwide
          </p>
        </div>
      </section>

      {/* Terms Body */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-sm border border-gray-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="p-4 bg-gray-50 border border-gray-200 text-xs text-black leading-relaxed">
            <strong>Summary:</strong> Asnad is a zero-host personal document vault. We provide organizational, indexing, and direct streaming capabilities that link directly to your personal Google Drive account. You own 100% of your data at all times.
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              1. Service Scope & Data Ownership
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Asnad acts as an interface layer between your web browser and your personal Google Drive account. Files, certificates, diplomas, and videos uploaded through Asnad are stored exclusively in your Google Drive under the dedicated <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">/Asnad</code> directory. Asnad claims zero intellectual property or storage custody over any file.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              2. Acceptable Use & Account Integrity
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree not to upload malware, copyrighted materials without authorization, or illegal content. Asnad reserves the right to terminate accounts that violate Google API policies or applicable laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              3. Google Drive Integration & Scopes
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Asnad integrates strictly through Google's official OAuth 2.0 protocol using the restricted <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">https://www.googleapis.com/auth/drive.file</code> scope. You can revoke access at any time through your Google Security Dashboard without risking any of your uploaded files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              4. Disclaimer & Liability
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The service is provided "AS IS" without warranties of any kind. Asnad is not liable for data loss caused by user-initiated deletions, Google Drive quota exhaustions, or third-party outages.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              5. Legal Inquiries & Direct Contact
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              For any legal questions regarding these terms, please contact:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-bold text-black pt-2">
              <a href={`tel:${phoneNumber}`} className="text-blue-600 hover:underline">
                Phone: {phoneNumber}
              </a>
              <span className="hidden sm:inline text-gray-300">•</span>
              <a href={`mailto:${emailAddress}`} className="text-blue-600 hover:underline">
                Email: {emailAddress}
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Dark Navy Footer */}
      <footer className="bg-[#050E1D] text-white/70 text-xs py-14 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
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
                <li><Link to="/security" className="hover:text-white transition">Security Architecture</Link></li>
                <li><Link to="/guides" className="hover:text-white transition">Guides & Docs</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition font-bold text-white">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Direct Contact</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href={`tel:${phoneNumber}`} className="hover:text-white transition">
                    {phoneNumber}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${emailAddress}`} className="hover:text-white transition">
                    {emailAddress}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <p>© {new Date().getFullYear()} ASNAD Document Vault. All rights reserved.</p>
            <p>Engineered with Zero-Host Security for absolute privacy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
