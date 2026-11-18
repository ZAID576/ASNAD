import React from 'react';
import { Link } from 'react-router-dom';
import {
  HardDrive,
  FolderTree,
  Search,
  Eye,
  ShieldCheck,
  RotateCcw,
  UploadCloud,
  FileText,
  Check,
  ArrowRight,
  Lock,
  Layers,
  Zap,
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export const FeaturesPage = () => {
  useSmoothScroll();

  const featurePillars = [
    {
      title: 'Zero-Host Storage Engine',
      tag: 'CUSTODY ARCHITECTURE',
      image: '/assets/feature-security.jpg',
      description:
        'Documents never stay on application servers. Binary streams pass through memory directly into your personal Google Drive in the dedicated /Asnad directory with zero vendor lock-in.',
      specs: [
        'Zero disk retention on cloud host',
        'Direct OAuth 2.0 drive.file scope isolation',
        'Complete portability: access files directly from Google Drive',
      ],
    },
    {
      title: 'Direct Resumable Upload Pipeline',
      tag: 'STREAMING ENGINE',
      image: '/assets/guide-connect.jpg',
      description:
        'Upload 4K videos, heavy multi-page diploma PDFs, or raw archives of any size. By establishing direct browser-to-Google resumable sessions, typical 4.5 MB serverless limits are eliminated completely.',
      specs: [
        'Any file format supported (PDF, PNG, JPG, MP4, ZIP)',
        'Live 0% to 100% upload progress telemetry',
        'Automatic chunked retry on network dropouts',
      ],
    },
    {
      title: 'High-Resolution In-Vault Preview',
      tag: 'INSTANT INSPECTION',
      image: '/assets/feature-preview.jpg',
      description:
        'Instant inline viewing for photos, certificates, examination question papers, and PDFs directly inside the vault. Inspect fine text, stamps, and high-resolution details without downloading.',
      specs: [
        'Real-time streaming proxy for rapid rendering',
        'Examination question paper high-zoom support',
        'One-click "Open in New Tab" and direct download',
      ],
    },
  ];

  const gridCapabilities = [
    {
      icon: Search,
      title: 'Sub-Millisecond Search',
      desc: 'Instant regex and substring indexing across all filenames, tags, and category labels with Ctrl+K keyboard shortcut.',
    },
    {
      icon: FolderTree,
      title: 'User-Scoped Folders',
      desc: 'Organize files into Education & Degrees, Identity & IDs, Financial & Tax, or custom user-defined categories.',
    },
    {
      icon: Lock,
      title: 'AES-256-GCM Tokens',
      desc: 'All Google tokens stored at rest are encrypted using authenticated AES-256-GCM with 96-bit Initialization Vectors.',
    },
    {
      icon: RotateCcw,
      title: 'Two-Stage Safe Trash',
      desc: 'Accidental deletions can be restored instantly from the Trash repository, or permanently purged from Google Drive.',
    },
    {
      icon: Layers,
      title: 'Tracking Prevention Immune',
      desc: 'Dual JWT authorization via HTTP-only sessions and Bearer headers prevents cross-browser tracking prevention blocks.',
    },
    {
      icon: Zap,
      title: 'Zero Latency Sync',
      desc: 'Changes made in the Asnad dashboard synchronize with your Google Drive /Asnad hierarchy in real time.',
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
            Core Specifications & Features
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Engineered For Absolute Privacy, Speed & Control
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Every feature in Asnad is designed with precision and minimal friction. No third-party host lock-in, no arbitrary upload caps, and zero clutter.
          </p>
        </div>
      </section>

      {/* 3 Heavyweight Feature Showcases With Minimalist Images - Compact Spacing */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        <div className="space-y-8">
          {featurePillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-sm border border-gray-200 bg-white shadow-2xs ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className={`lg:col-span-6 relative aspect-[16/10] overflow-hidden border border-gray-200 bg-gray-50 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                  {pillar.tag}
                </span>
              </div>

              {/* Text Side */}
              <div className={`lg:col-span-6 space-y-3 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest block">
                  Capability 0{idx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
                <div className="pt-3 border-t border-gray-100 space-y-1.5">
                  {pillar.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-black font-medium">
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 6-Grid Technical Capabilities (Pure Black Icons, No Background Boxes) */}
        <div className="pt-8 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 block mb-1">
              Deep Technical Foundation
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Platform Features Built For Production
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridCapabilities.map((item, cIdx) => {
              const Icon = item.icon;
              return (
                <div
                  key={cIdx}
                  className="p-5 rounded-sm border border-gray-200 bg-white hover:border-black transition shadow-2xs"
                >
                  {/* RAW BLACK ICON - NO BACKGROUND BOX */}
                  <Icon className="w-5 h-5 text-black mb-3" strokeWidth={1.75} />
                  <h4 className="text-sm sm:text-base font-bold text-black mb-1.5">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Mid CTA */}
      <section className="py-14 bg-gradient-to-b from-[#0A2E73] to-[#08245C] text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Deploy Your Private Vault Now
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Zero setup fees. Zero server lock-in. Connect directly to your personal Google Drive in seconds.
          </p>
          <div className="mt-6">
            <Link to="/register">
              <button className="px-7 py-3 bg-white text-[#0A2E73] font-black text-xs uppercase tracking-wider hover:bg-gray-100 rounded-sm shadow-md transition">
                Start Storing For Free
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
                <li><Link to="/features" className="hover:text-white transition font-bold text-white">Features</Link></li>
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

export default FeaturesPage;
