import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HardDrive,
  ShieldCheck,
  FolderTree,
  Search,
  ArrowRight,
  Lock,
  Cloud,
  Layers,
  FileText,
  Eye,
  RotateCcw,
  UploadCloud,
  Phone,
  Mail,
  MessageSquare,
  Check,
  ChevronRight,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  useSmoothScroll();
  const landingRef = useRef(null);

  const phoneNumber = '+91 7061838495';
  const cleanPhone = '917061838495';
  const emailAddress = 'syedimranh59@gmail.com';

  const landingGuides = [
    {
      id: 'drive-setup',
      title: 'Connecting Google Drive With Zero-Host Authorization',
      tag: 'Setup Tutorial',
      readTime: '3 min read',
      image: '/assets/guide-connect.jpg',
      summary: 'Learn how Asnad leverages Google OAuth 2.0 with the restricted drive.file scope to create an isolated /Asnad directory in your drive.',
    },
    {
      id: 'security-architecture',
      title: 'Cryptographic Privacy & AES-256-GCM Token Storage',
      tag: 'Security Blueprint',
      readTime: '5 min read',
      image: '/assets/feature-security.jpg',
      summary: 'A deep dive into Asnad’s security perimeter: storing 0 bytes on company servers eliminates the danger of database breaches.',
    },
    {
      id: 'preview-lightbox',
      title: 'Real-Time In-Browser Document & Exam Paper Inspection',
      tag: 'Workflow Guide',
      readTime: '4 min read',
      image: '/assets/feature-preview.jpg',
      summary: 'How our streaming proxy serves instant inline previews for certificates, exam question papers, photos, and PDFs.',
    },
    {
      id: 'streaming-pipeline',
      title: 'Bypassing 4.5 MB Serverless Limits With Direct Streaming',
      tag: 'Performance Engine',
      readTime: '4 min read',
      image: '/assets/blog-cloud.jpg',
      summary: 'Direct resumable upload pipeline streams 4K videos, heavy archives, and full scans with live progress telemetry.',
    },
  ];

  return (
    <div
      ref={landingRef}
      className="min-h-screen bg-white text-black flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-clip"
    >
      {/* =========================================================================
          TRULY STICKY NAVBAR (Fixed at top, Lenis & GSAP compatible)
         ========================================================================= */}
      <PublicNavbar theme="blue" />

      {/* =========================================================================
          HERO SECTION (Super Mobile-Responsive, No Giant Mockup Image)
         ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#0A2E73] via-[#0D44A8] to-[#1258D4] text-white pt-24 pb-14 sm:pt-28 sm:pb-20 overflow-hidden border-b border-black">
        {/* Subtle Geometric Tile Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Hero Copy */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/20 text-white text-[10px] sm:text-[11px] font-mono uppercase tracking-wider mb-4 backdrop-blur-sm">
            <span>100% Zero-Host Privacy Vault • Google Drive Powered</span>
          </div>

          {/* Headline - Scaled for Mobile & Desktop */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
            Time, Tasks, And Focus. Seamlessly.
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-white/85 max-w-xl mx-auto font-normal leading-relaxed">
            All your educational certificates, exam papers, personal IDs, and vital records stored directly in your own <strong>Google Drive</strong>. Zero third-party hosting, zero vendor lock-in.
          </p>

          {/* Mobile-Friendly CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-md mx-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3 bg-white text-[#0A2E73] font-black text-xs uppercase tracking-wider hover:bg-gray-100 rounded-sm shadow-xl transition flex items-center justify-center gap-2">
                <span>Start Storing For Free</span>
                <ArrowRight className="w-4 h-4 text-[#0A2E73]" />
              </button>
            </Link>
            <Link to="/features" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 rounded-sm transition">
                Explore Features
              </button>
            </Link>
          </div>

          <p className="mt-3 text-[10px] sm:text-[11px] font-mono text-white/70">
            Instant 1-Click Google Drive Connection • No Credit Card Required
          </p>

          {/* Sleek Minimal 3-Pill Highlights (Replaces the clunky hero image) */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-white/90">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
              <span>0 Bytes On Server Disk</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
              <span>100% Personal Drive Custody</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
              <span>Authenticated AES-256-GCM</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LOGOS / TRUST TICKER (Crisp White Background, Pure Minimalist Black Icons)
         ========================================================================= */}
      <div className="py-4 sm:py-5 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-10 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-black">
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> Google Drive Isolated
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> AES-256-GCM Tokens
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> OAuth 2.0 Certified
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> Zero Server Lock-In
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> Resumable Streaming
          </span>
        </div>
      </div>

      {/* =========================================================================
          STATEMENT BLOCK (Clean White, Black Typography, Blue Pill)
         ========================================================================= */}
      <section className="py-10 sm:py-14 bg-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-black leading-snug tracking-tight">
            Every Feature in Asnad is Designed With Precision, Intention, And Flow In Mind.{' '}
            <span className="inline-block px-2 py-0.5 rounded-sm bg-blue-600 text-white font-mono text-[10px] sm:text-[11px] uppercase tracking-wider align-middle">
              Zero-Host
            </span>{' '}
            Built To Feel As Natural And Fluid As The Tools You Use Every Day.
          </h2>
        </div>
      </section>

      {/* =========================================================================
          "WHY WE'RE DIFFERENT" (Clean Bento Grid, Sharp Edges, White/Black/Blue)
         ========================================================================= */}
      <section id="why-different" className="py-10 sm:py-14 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-blue-600 block mb-1">
              Architectural Separation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Why We're Different
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
              Traditional platforms keep your private documents locked on their internal servers. Asnad is built differently.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Left Comparison Card (Span 2) */}
            <div className="lg:col-span-2 p-4 sm:p-6 rounded-sm bg-white border border-gray-200 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider mb-3 sm:mb-4">
                Direct Architecture Comparison
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-black font-semibold">Where are files stored?</span>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] line-through">Company's disks / AWS</span>
                    <span className="text-blue-600 font-bold">100% In your personal Google Drive</span>
                  </div>
                </div>

                <div className="p-3 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-black font-semibold">Data Lock-In Risk</span>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] line-through">Files lost if service shuts down</span>
                    <span className="text-blue-600 font-bold">Zero: Files stay in your Drive permanently</span>
                  </div>
                </div>

                <div className="p-3 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-black font-semibold">Token & Session Security</span>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] line-through">Plaintext or basic hashing</span>
                    <span className="text-black font-bold">AES-256-GCM authenticated encryption</span>
                  </div>
                </div>

                <div className="p-3 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-black font-semibold">Upload File Limits</span>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] line-through">Strict 4.5MB serverless limits</span>
                    <span className="text-blue-600 font-bold">Resumable direct upload (Any size/video)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Analytics Card */}
            <div className="p-4 sm:p-6 rounded-sm bg-white border border-gray-200 shadow-2xs flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-blue-600 block mb-1">
                  Privacy Retention
                </span>
                <div className="text-4xl sm:text-5xl font-black text-black mt-1">100%</div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Zero files stored on third-party servers. All files remain strictly in your Google Drive.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4 space-y-1.5 text-left text-xs">
                <div className="flex items-center gap-1.5 text-black font-medium">
                  <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                  <span>Dedicated folder: <code className="text-blue-600 font-bold font-mono">/Asnad</code></span>
                </div>
                <div className="flex items-center gap-1.5 text-black font-medium">
                  <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                  <span>Access revocable anytime from Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DETAILED FEATURES SHOWCASE (Using Generated Minimalist Images)
         ========================================================================= */}
      <section id="features-showcase" className="py-10 sm:py-14 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-blue-600 block mb-1">
              System Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              What Asnad Does
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
              Designed to help you manage and access every personal document without friction.
            </p>
          </div>

          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-7 rounded-sm border border-gray-200 bg-white shadow-2xs">
            <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src="/assets/feature-preview.jpg"
                alt="Document Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                Instant Lightbox
              </span>
            </div>
            <div className="lg:col-span-6 space-y-2.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest block">
                01 / Real-Time Inspection
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-black tracking-tight">
                Intuitive In-Browser Preview & Lightbox
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Inspect examination papers, academic transcripts, identity scans, and multi-page PDFs right inside your vault. Zoom in to read tiny text or open directly in a new tab without downloading.
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center gap-6 text-xs text-black font-semibold">
                <Link to="/features" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <span>Explore preview features</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-7 rounded-sm border border-gray-200 bg-white shadow-2xs">
            <div className="lg:col-span-6 space-y-2.5 order-2 lg:order-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest block">
                02 / Certified Cryptography
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-black tracking-tight">
                Zero-Host Custody & AES-256-GCM Tokens
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                All Google tokens are protected with authenticated AES-256-GCM encryption with unique Initialization Vectors. Asnad operates strictly on `drive.file` scope, meaning it cannot access or see any unrelated Google files.
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center gap-6 text-xs text-black font-semibold">
                <Link to="/security" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <span>View security architecture</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden border border-gray-200 bg-gray-50 order-1 lg:order-2">
              <img
                src="/assets/feature-security.jpg"
                alt="Security Architecture"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                AES-256-GCM
              </span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-7 rounded-sm border border-gray-200 bg-white shadow-2xs">
            <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src="/assets/guide-connect.jpg"
                alt="Google Drive Direct Resumable Upload"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                Any Size / Format
              </span>
            </div>
            <div className="lg:col-span-6 space-y-2.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest block">
                03 / Resumable Pipeline
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-black tracking-tight">
                Upload Any File Format Without Serverless Limits
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Direct Google Drive resumable streaming completely bypasses serverless 4.5 MB limits. Upload heavy 4K videos, zip files, and bulk certificates with live 0% to 100% progress telemetry.
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center gap-6 text-xs text-black font-semibold">
                <Link to="/features" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <span>Explore upload engine</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DOCUMENTATION & GUIDES SECTION (Prominent, High-Density, With Read More)
         ========================================================================= */}
      <section id="guides-showcase" className="py-10 sm:py-14 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-blue-600 block mb-1">
                Documentation & Guides
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Mastering Your Zero-Host Vault
              </h2>
            </div>
            <Link to="/guides" className="text-xs font-mono uppercase font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View All 4 Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Guide Cards with Real Images & Read More Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {landingGuides.map((guide) => (
              <div
                key={guide.id}
                className="group rounded-sm border border-gray-200 bg-white hover:border-black transition flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b border-gray-200 bg-gray-50">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                    {guide.tag}
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur text-black text-[9px] font-mono">
                    {guide.readTime}
                  </span>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-black group-hover:text-blue-600 transition leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1 line-clamp-2">
                      {guide.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/guides?guide=${guide.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MID-PAGE DARK BLUE CTA BANNER
         ========================================================================= */}
      <section className="py-12 sm:py-14 bg-gradient-to-b from-[#0A2E73] to-[#08245C] text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Try Asnad For Free
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            All your vital documents in one private, beautiful command center. Connect your Google Drive in 1 click.
          </p>
          <div className="mt-6">
            <Link to="/register">
              <button className="px-7 py-3 bg-white text-[#0A2E73] font-black text-xs uppercase tracking-wider hover:bg-gray-100 rounded-sm shadow-xl transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NUMBERS & METRICS (White Background, Sharp Boxes)
         ========================================================================= */}
      <section id="metrics-section" className="py-10 sm:py-12 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-black tracking-tight">
              Built For Unmatched Privacy & Speed
            </h2>
            <p className="mt-1 text-[10px] sm:text-[11px] font-mono text-gray-500 uppercase tracking-wider">
              0 Host Storage • 100% Personal Drive Custody
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="p-3.5 sm:p-5 rounded-sm border border-gray-200 bg-white">
              <div className="text-2xl sm:text-3xl font-black text-black">0 Bytes</div>
              <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5 font-mono">Stored on Server Disks</p>
            </div>
            <div className="p-3.5 sm:p-5 rounded-sm border border-gray-200 bg-white">
              <div className="text-2xl sm:text-3xl font-black text-blue-600">100%</div>
              <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5 font-mono">Google Drive Owned</p>
            </div>
            <div className="p-3.5 sm:p-5 rounded-sm border border-gray-200 bg-white">
              <div className="text-2xl sm:text-3xl font-black text-black">256-bit</div>
              <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5 font-mono">AES-GCM Encryption</p>
            </div>
            <div className="p-3.5 sm:p-5 rounded-sm border border-gray-200 bg-white">
              <div className="text-2xl sm:text-3xl font-black text-blue-600">&lt;80ms</div>
              <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5 font-mono">Instant Search Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DIRECT CONTACT US SECTION (NO FORM, STRICTLY DIRECT PHONE & EMAIL)
         ========================================================================= */}
      <section id="contact" className="py-10 sm:py-14 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-blue-600 block mb-1">
            Direct Line
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Contact Us
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            No lengthy contact forms. Contact us directly via phone, WhatsApp, or email for instant support and setup inquiries.
          </p>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Phone & WhatsApp Card */}
            <div className="p-5 sm:p-6 rounded-sm bg-white border border-gray-200 hover:border-black transition flex flex-col justify-between">
              <div>
                <Phone className="w-6 h-6 text-black mb-3" strokeWidth={1.5} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 block">Direct Phone & WhatsApp</span>
                <h3 className="text-base sm:text-xl font-black text-black mt-1">{phoneNumber}</h3>
                <p className="text-xs text-gray-600 mt-1">Direct line to technical support and founder.</p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-gray-200 flex items-center gap-2.5">
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1 py-2.5 px-3 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-sm border border-black hover:bg-gray-50 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-black" strokeWidth={2} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-5 sm:p-6 rounded-sm bg-white border border-gray-200 hover:border-black transition flex flex-col justify-between">
              <div>
                <Mail className="w-6 h-6 text-black mb-3" strokeWidth={1.5} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 block">Direct Email</span>
                <h3 className="text-sm sm:text-lg font-black text-black mt-1 break-all">{emailAddress}</h3>
                <p className="text-xs text-gray-600 mt-1">Send inquiries, feedback, or technical questions.</p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-gray-200">
                <a
                  href={`mailto:${emailAddress}`}
                  className="w-full py-2.5 px-3 rounded-sm bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DARK NAVY FOOTER
         ========================================================================= */}
      <footer className="bg-[#050E1D] text-white/70 text-xs py-10 sm:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-2.5">
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
              <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security Architecture</Link></li>
                <li><Link to="/guides" className="hover:text-white transition">Guides & Docs</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider">Direct Contact</h4>
              <ul className="space-y-1.5 text-[11px]">
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
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40 text-center sm:text-left">
            <p>© {new Date().getFullYear()} ASNAD Document Vault. All rights reserved.</p>
            <p>Engineered with Zero-Host Security for absolute privacy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
