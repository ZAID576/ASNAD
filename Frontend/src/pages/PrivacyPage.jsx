import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, CheckCircle2, Phone, Mail, Check } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export const PrivacyPage = () => {
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
            Legal & Privacy Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Privacy Policy & Data Sovereignty
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Last Updated: November 2026 • Effective Worldwide
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-sm border border-gray-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="p-4 bg-gray-50 border border-gray-200 flex items-start gap-3 text-xs text-black leading-relaxed">
            <Lock className="w-5 h-5 flex-shrink-0 text-black mt-0.5" strokeWidth={1.75} />
            <div>
              <strong>Zero-Host Document Storage Guarantee:</strong> Asnad never stores your binary document files (PDFs, images, spreadsheets, videos) on its servers. All files are uploaded and retained strictly inside your personal Google Drive account in a dedicated <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono font-bold text-black">/Asnad</code> folder.
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              1. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We collect minimal information necessary to deliver and organize your personal document vault:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1.5 pl-2">
              <li><strong>Account Credentials:</strong> Name, email address, and securely salted bcrypt-hashed passwords.</li>
              <li><strong>Google Authentication:</strong> Encrypted OAuth 2.0 access and refresh tokens (encrypted with authenticated AES-256-GCM).</li>
              <li><strong>Document Metadata:</strong> File name, MIME type, file size, custom category labels, and Google Drive file IDs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              2. Google API Services User Data Policy Compliance
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Asnad's use and transfer to any other app of information received from Google APIs adhere to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline font-semibold"
              >
                Google API Services User Data Policy
              </a>, including the Limited Use requirements:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1.5 pl-2">
              <li>We only request scopes needed to organize files created by the application (<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 font-mono">drive.file</code>) and verify user identity (<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 font-mono">userinfo.email</code>, <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 font-mono">userinfo.profile</code>).</li>
              <li>We do not read, inspect, or list files in your Google Drive outside the Asnad-managed folder.</li>
              <li>We never sell, rent, or transfer your Google user data to third parties for advertising or tracking purposes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              3. Data Security & Encryption
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              All communications between your browser, our servers, and Google APIs are secured with TLS 1.3 encryption in transit. OAuth tokens and secrets stored at rest are encrypted with authenticated AES-256-GCM.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              4. User Control & Data Deletion
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You maintain total sovereignty over your documents. You can disconnect your Google Drive at any moment. Disconnecting immediately wipes your encrypted tokens from our database. Since files reside in your personal Google Drive, you can access, download, or delete them directly from Google Drive at any time.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">
              5. Direct Contact
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you have any questions or concerns regarding this privacy policy or data handling practices, please contact us directly:
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
                <li><Link to="/privacy" className="hover:text-white transition font-bold text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
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

export default PrivacyPage;
