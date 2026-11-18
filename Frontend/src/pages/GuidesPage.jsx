import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  HardDrive,
  Lock,
  UploadCloud,
  Eye,
  Check,
  ChevronRight,
  ArrowLeft,
  Share2,
  ExternalLink,
  ShieldCheck,
  Layers,
  FileText,
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export const GuidesPage = () => {
  useSmoothScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeParam = searchParams.get('guide');

  const guides = [
    {
      id: 'drive-setup',
      title: 'Connecting Google Drive With Zero-Host Authorization',
      tag: 'SETUP TUTORIAL',
      readTime: '3 min read',
      image: '/assets/guide-connect.jpg',
      summary:
        'A complete walkthrough of configuring Google Drive integration using the restricted drive.file OAuth scope for absolute data custody.',
      overview:
        'Traditional cloud applications store your uploaded documents on third-party servers. Asnad reverses this model completely: files stream straight from your browser into your own Google Drive inside an isolated /Asnad directory.',
      sections: [
        {
          heading: '1. Why the drive.file Scope Matters',
          text: 'When connecting your Google account, Asnad asks only for the "drive.file" scope. This means Asnad can ONLY see and manage files that it specifically created. It has mathematically zero access to your emails, Google Photos, or unrelated Google Drive spreadsheets.',
        },
        {
          heading: '2. The Automatic /Asnad Root Directory',
          text: 'Upon your first sign-in, Asnad checks if an /Asnad folder exists in your Google Drive root. If not, it provisions one securely. Every certificate, ID, and video you upload is stored neatly inside this folder.',
        },
        {
          heading: '3. Token Encryption with AES-256-GCM',
          text: 'Google OAuth refresh tokens are never saved as plaintext. We encrypt each token with AES-256 in Galois/Counter Mode (GCM) using unique 96-bit Initialization Vectors (IV) before writing to the database.',
        },
        {
          heading: '4. Revocation Without Data Loss',
          text: 'If you ever decide to stop using Asnad, you can revoke access in one click from your Google Account Security panel. Because all files reside in your personal Google Drive, you retain 100% of your documents permanently.',
        },
      ],
    },
    {
      id: 'security-architecture',
      title: 'Cryptographic Privacy & Zero-Host Architecture',
      tag: 'SECURITY BLUEPRINT',
      readTime: '5 min read',
      image: '/assets/feature-security.jpg',
      summary:
        'Technical documentation explaining how storing 0 bytes on company servers eliminates the danger of database breaches and leaks.',
      overview:
        'The most secure server is the one that holds none of your sensitive documents. Asnad was engineered from day one on a zero-host paradigm.',
      sections: [
        {
          heading: '1. The Zero-Host Security Rule',
          text: 'Document binary payloads (PNG, PDF, MP4, JPG) are never written to persistent server disks. During uploads, chunks stream directly from your client to Google Drive resumable endpoints.',
        },
        {
          heading: '2. Authenticated GCM Cipher Tagging',
          text: 'Unlike standard CBC mode, Galois/Counter Mode generates an authentication tag (MAC) during encryption. Any tampering or bit-flipping in the database immediately triggers a cryptographic failure before decryption.',
        },
        {
          heading: '3. Dual-Layer JWT & Bearer Header Defense',
          text: 'Asnad uses HTTP-only session cookies alongside Bearer Authorization tokens in memory. This dual mechanism ensures seamless compatibility across iOS Safari, Edge Tracking Prevention, and modern browsers.',
        },
        {
          heading: '4. Two-Stage Trash Protection',
          text: 'Documents moved to Trash are marked for soft-deletion for 30 days. You can restore them instantly with one click, or trigger permanent deletion from your Google Drive.',
        },
      ],
    },
    {
      id: 'preview-lightbox',
      title: 'Real-Time In-Browser Document & Exam Paper Inspection',
      tag: 'WORKFLOW GUIDE',
      readTime: '4 min read',
      image: '/assets/feature-preview.jpg',
      summary:
        'How our custom streaming proxy serves instant inline previews for certificates, exam question papers, photos, and PDFs.',
      overview:
        'Downloading a 30 MB file just to check an exam question or degree roll number is frustrating. Asnad includes a high-speed streaming proxy that renders documents right inside your browser window.',
      sections: [
        {
          heading: '1. Instant High-Resolution Lightbox',
          text: 'Clicking any document card immediately opens the in-vault lightbox modal. You can inspect fine stamps, signatures, and printed equations in full resolution.',
        },
        {
          heading: '2. Multi-Format Rendering Support',
          text: 'Whether you upload PNG examination papers, multi-page PDFs, or 4K videos, Asnad automatically detects the MIME type and chooses the optimal viewing pipeline.',
        },
        {
          heading: '3. Rapid Keyboard Shortcuts',
          text: 'Navigate your vault effortlessly: Press Escape to close any preview modal, press Ctrl+K (or Cmd+K) to jump to the instant search bar.',
        },
        {
          heading: '4. Direct Google Drive Links',
          text: 'Need to share or open in a separate window? Click "Open in New Tab" or "Download" to fetch the file directly from Google Drive stream.',
        },
      ],
    },
    {
      id: 'streaming-pipeline',
      title: 'Bypassing 4.5 MB Serverless Limits With Direct Streaming',
      tag: 'PERFORMANCE ENGINE',
      readTime: '4 min read',
      image: '/assets/blog-cloud.jpg',
      summary:
        'Traditional serverless hosts abort uploads over 4.5 MB. Learn how Asnad handles 4K videos and heavy PDFs of any size.',
      overview:
        'Standard serverless architectures (like AWS Lambda and Vercel Functions) enforce a strict 4.5 MB maximum request payload. Storing a 50 MB college lecture video or 15 MB high-resolution thesis PDF was historically impossible.',
      sections: [
        {
          heading: '1. The Problem With Serverless Buffers',
          text: 'When files are sent through standard multipart form-data to a serverless backend, the request body is buffered in memory. Any file over 4.5 MB is instantly dropped with a 413 Payload Too Large error.',
        },
        {
          heading: '2. The Resumable Direct Pipeline',
          text: 'Asnad solves this by requesting an authorized Google Drive resumable upload session URI from the backend. The browser then streams the binary payload directly to Google Drive.',
        },
        {
          heading: '3. 0% to 100% Live Progress Telemetry',
          text: 'Because the browser talks directly to Google’s resumable endpoint, upload progress is measured chunk-by-chunk in real time with an accurate percentage progress bar.',
        },
        {
          heading: '4. Chunked Retries on Dropped Networks',
          text: 'If your internet drops mid-upload of a 4K video, the Google Resumable protocol queries the last byte offset uploaded and resumes without having to start over from 0%.',
        },
      ],
    },
  ];

  const selectedGuide = guides.find((g) => g.id === activeParam) || null;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Navbar */}
      <PublicNavbar theme="blue" />

      {/* Royal Blue Hero Header */}
      <section className="relative bg-gradient-to-b from-[#0A2E73] via-[#0D44A8] to-[#1258D4] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-2">
            Technical Documentation & Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Asnad Guides & Architecture
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Step-by-step guides on zero-host architecture, direct Google Drive pipelines, cryptographic token privacy, and high-performance document handling.
          </p>
        </div>
      </section>

      {/* Main Content Area - Tight, Minimalist Spacing */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {selectedGuide ? (
          /* =========================================================================
             DETAILED GUIDE VIEW (When user clicks Read Full Guide)
             ========================================================================= */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Back Button */}
            <button
              onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Guides</span>
            </button>

            {/* Guide Header Card */}
            <div className="border border-gray-200 bg-white p-6 sm:p-8 rounded-sm space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500">
                <span className="px-2 py-0.5 bg-black text-white text-[10px] uppercase font-bold">
                  {selectedGuide.tag}
                </span>
                <span>•</span>
                <span>{selectedGuide.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                {selectedGuide.title}
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {selectedGuide.overview}
              </p>
            </div>

            {/* Banner Image */}
            <div className="aspect-[21/9] border border-gray-200 bg-gray-50 overflow-hidden rounded-sm">
              <img
                src={selectedGuide.image}
                alt={selectedGuide.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* In-Depth Sections */}
            <div className="border border-gray-200 bg-white p-6 sm:p-8 rounded-sm space-y-8">
              {selectedGuide.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-2 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setSearchParams({})}
                className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-sm hover:border-black"
              >
                ← Back to Guides List
              </button>
              <Link to="/register">
                <button className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-sm hover:bg-blue-700">
                  Try Asnad Free →
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* =========================================================================
             ALL GUIDES LIST (Compact, Crisp, Tight Spacing, No Dead Empty Void)
             ========================================================================= */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 text-xs font-mono">
              <span className="font-bold uppercase tracking-wider text-black">
                All Guides (4)
              </span>
              <span className="text-gray-500">
                Click any guide to read full documentation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, idx) => (
                <article
                  key={guide.id}
                  onClick={() => setSearchParams({ guide: guide.id })}
                  className="group rounded-sm border border-gray-200 bg-white hover:border-black transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-2xs"
                >
                  {/* Image */}
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

                  {/* Copy */}
                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-black group-hover:text-blue-600 transition leading-snug">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2 line-clamp-2">
                        {guide.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mid CTA */}
      <section className="py-14 bg-gradient-to-b from-[#0A2E73] to-[#08245C] text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Build Your Personal Cloud Vault?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Connect your own Google Drive and experience complete zero-host sovereignty today.
          </p>
          <div className="mt-6">
            <Link to="/register">
              <button className="px-7 py-3 bg-white text-[#0A2E73] font-black text-xs uppercase tracking-wider hover:bg-gray-100 rounded-sm shadow-md transition">
                Create Free Vault
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
                <li><Link to="/security" className="hover:text-white transition">Security Architecture</Link></li>
                <li><Link to="/guides" className="hover:text-white transition font-bold text-white">Guides & Docs</Link></li>
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

export default GuidesPage;
