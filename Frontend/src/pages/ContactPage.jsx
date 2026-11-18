import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MessageSquare,
  Shield,
  ArrowRight,
  Check,
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export const ContactPage = () => {
  useSmoothScroll();
  const phoneNumber = '+91 7061838495';
  const cleanPhone = '917061838495';
  const emailAddress = 'syedimranh59@gmail.com';

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Navbar */}
      <PublicNavbar theme="blue" />

      {/* Royal Blue Header */}
      <section className="relative bg-gradient-to-b from-[#0A2E73] via-[#0D44A8] to-[#1258D4] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-3">
            Direct Line & Instant Response
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Direct Contact & Engineering Support
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            No endless support ticketing forms. Contact us directly via Phone, WhatsApp, or Email for instant technical queries and setup assistance.
          </p>
        </div>
      </section>

      {/* Direct Contact Cards - Sharp Minimalism, No Form */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Phone & WhatsApp Card */}
          <div className="p-8 sm:p-10 rounded-sm bg-white border border-gray-200 hover:border-black transition flex flex-col justify-between">
            <div>
              {/* RAW BLACK ICON - NO BACKGROUND CONTAINER BOX */}
              <Phone className="w-8 h-8 text-black mb-6" strokeWidth={1.5} />

              <span className="text-xs font-mono uppercase tracking-widest text-blue-600 block mb-1">
                Direct Phone Line & WhatsApp
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-black mt-2">
                {phoneNumber}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-4">
                Direct line to technical support and engineering. Immediate voice response during business hours.
              </p>

              <div className="mt-6 space-y-2 text-xs text-black font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  <span>Immediate Voice Support Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  <span>WhatsApp Chat & Audio Inquiries</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-5 border border-black hover:bg-gray-50 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition"
              >
                <MessageSquare className="w-4 h-4 text-black" strokeWidth={2} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="p-8 sm:p-10 rounded-sm bg-white border border-gray-200 hover:border-black transition flex flex-col justify-between">
            <div>
              {/* RAW BLACK ICON - NO BACKGROUND CONTAINER BOX */}
              <Mail className="w-8 h-8 text-black mb-6" strokeWidth={1.5} />

              <span className="text-xs font-mono uppercase tracking-widest text-blue-600 block mb-1">
                Direct Email Inbox
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-black mt-2 break-all">
                {emailAddress}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-4">
                Send technical questions, custom deployment queries, or collaboration proposals directly to Syed Imran Hassan.
              </p>

              <div className="mt-6 space-y-2 text-xs text-black font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  <span>Direct Reply From Syed Imran Hassan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  <span>Response Time: Under 2 Hours</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={`mailto:${emailAddress}`}
                className="w-full py-3 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition"
              >
                <Mail className="w-4 h-4 text-white" strokeWidth={2} />
                <span>Send Direct Email</span>
              </a>
            </div>
          </div>
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
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Direct Contact</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href={`tel:${phoneNumber}`} className="hover:text-white transition flex items-center gap-1.5">
                    <span>{phoneNumber}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${emailAddress}`} className="hover:text-white transition flex items-center gap-1.5">
                    <span className="break-all">{emailAddress}</span>
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="hover:text-white transition">
                    WhatsApp Chat
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

export default ContactPage;
