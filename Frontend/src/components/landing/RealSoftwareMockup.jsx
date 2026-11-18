import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileText,
  Search,
  HardDrive,
  Download,
  Eye,
  Star,
  MoreVertical,
  Check,
  Trash2,
  Lock,
  Plus,
  Play,
  X,
  Shield,
  Layers,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const RealSoftwareMockup = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    if (!mockupRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(mockupRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: mockupRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, mockupRef);

    return () => ctx.revert();
  }, []);

  const documents = [
    {
      id: 'doc-1',
      name: '1.png',
      category: 'Education & Degrees',
      type: 'image/png',
      size: '1.3 MB',
      date: '11 Nov 2026',
      storage: 'Google Drive',
      isStarred: true,
      previewType: 'exam',
      description: 'Python Programming Examination Question Paper',
    },
    {
      id: 'doc-2',
      name: 'Degree_Certificate.pdf',
      category: 'Education & Degrees',
      type: 'application/pdf',
      size: '2.4 MB',
      date: '10 Nov 2026',
      storage: 'Google Drive',
      isStarred: true,
      previewType: 'pdf',
      description: 'Bachelor of Technology Degree Transcript',
    },
    {
      id: 'doc-3',
      name: 'Passport_Front_Scan.jpg',
      category: 'Identity & IDs',
      type: 'image/jpeg',
      size: '3.1 MB',
      date: '08 Nov 2026',
      storage: 'Google Drive',
      isStarred: false,
      previewType: 'id',
      description: 'Government Issued Identity Passport Document',
    },
    {
      id: 'doc-4',
      name: 'Architecture_Demo.mp4',
      category: 'Media & Videos',
      type: 'video/mp4',
      size: '42.5 MB',
      date: '06 Nov 2026',
      storage: 'Google Drive',
      isStarred: false,
      previewType: 'video',
      description: '4K System Architecture Demo (Resumable Upload)',
    },
  ];

  const filteredDocs =
    activeTab === 'all'
      ? documents
      : documents.filter((doc) =>
          doc.category.toLowerCase().includes(activeTab.toLowerCase())
        );

  return (
    <div ref={mockupRef} className="relative w-full max-w-5xl mx-auto select-none">
      {/* Outer Glow & Ambient Reflection */}
      <div className="absolute -inset-1 bg-blue-500/10 blur-xl pointer-events-none" />

      {/* Main SaaS Window Frame - Razor-Sharp Modern Styling (White/Black/Blue) */}
      <div className="relative rounded-sm bg-white text-black shadow-2xl border border-gray-200 overflow-hidden">
        {/* Browser Topbar */}
        <div className="h-10 bg-gray-50 border-b border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/30" />
            <span className="ml-3 text-[11px] font-bold tracking-wider uppercase text-black hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-600" />
              Asnad Cloud Vault
            </span>
          </div>

          {/* Centered URL Pill */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-sm bg-white border border-gray-200 text-[10px] font-mono text-gray-600">
            <Lock className="w-3 h-3 text-black" strokeWidth={1.75} />
            <span>asnad-chi.vercel.app/dashboard</span>
          </div>

          {/* Drive Status Badge */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-black">
            <span className="w-1.5 h-1.5 bg-blue-600 animate-pulse" />
            <span>Google Drive /Asnad</span>
          </div>
        </div>

        {/* In-App Toolbar */}
        <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black" strokeWidth={1.75} />
            <input
              type="text"
              readOnly
              value="1.png"
              placeholder="Search documents, files, or categories..."
              className="w-full pl-8 pr-12 py-1.5 rounded-sm bg-gray-50 border border-gray-200 text-xs text-black font-medium focus:outline-none"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-500 bg-white px-1 py-0.5 border border-gray-200">
              Ctrl+K
            </span>
          </div>

          {/* Minimalist Action Controls - Raw Black Icons, No Background Boxes */}
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-sm border border-gray-200 text-black font-semibold flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-black" strokeWidth={1.75} />
              <span>/Asnad Root</span>
            </div>
            <div className="px-3 py-1.5 rounded-sm bg-blue-600 text-white font-bold flex items-center gap-1.5 shadow-xs">
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Upload File</span>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition ${
              activeTab === 'all'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black hover:bg-white'
            }`}
          >
            All Files (12)
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition ${
              activeTab === 'education'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-black hover:bg-white'
            }`}
          >
            Education & Degrees (4)
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition ${
              activeTab === 'identity'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-black hover:bg-white'
            }`}
          >
            Identity & IDs (3)
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition ${
              activeTab === 'media'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-black hover:bg-white'
            }`}
          >
            Media & Videos (5)
          </button>
        </div>

        {/* Real Document Cards Grid - Clean Sharp Minimalism */}
        <div className="p-4 sm:p-5 bg-white">
          <div className="flex items-center justify-between mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <span>Live Vault Storage</span>
            <span className="text-blue-600 lowercase font-medium">click to inspect preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setPreviewDoc(doc)}
                className="group relative rounded-sm bg-white border border-gray-200 p-2.5 hover:border-black transition cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Area */}
                <div className="relative w-full aspect-[4/3] rounded-none bg-gray-50 border border-gray-200 overflow-hidden mb-2.5 flex items-center justify-center">
                  {/* REAL EXAM PAPER VISUAL FOR 1.png */}
                  {doc.previewType === 'exam' && (
                    <div className="w-full h-full bg-white p-2 flex flex-col justify-between text-[7px] font-mono text-black leading-tight select-none">
                      <div className="border-b border-gray-200 pb-0.5 flex justify-between font-bold text-[6px] text-gray-500 uppercase">
                        <span>CS504: Python Prog</span>
                        <span>Marks: 70</span>
                      </div>
                      <div className="space-y-0.5 text-black">
                        <p className="font-bold text-[7px]">Q1. Choose the correct option:</p>
                        <p className="bg-gray-50 p-1 font-mono text-[6px] border border-gray-100">
                          a = True; b = False<br />
                          if not a or not b and c:<br />
                          &nbsp;&nbsp;print("A")<br />
                          elif not a or not b and a:<br />
                          &nbsp;&nbsp;print("B")
                        </p>
                      </div>
                      <div className="text-[6px] text-gray-400 flex justify-between border-t border-gray-100 pt-0.5">
                        <span className="font-bold text-black">1.png</span>
                        <span>11 Nov 2026</span>
                      </div>
                    </div>
                  )}

                  {/* REAL PDF THUMBNAIL - Clean, No Pastel Box */}
                  {doc.previewType === 'pdf' && (
                    <div className="w-full h-full bg-white p-3 flex flex-col items-center justify-center text-center">
                      <FileText className="w-8 h-8 text-black mb-1" strokeWidth={1.5} />
                      <span className="text-[9px] font-bold text-black truncate max-w-[120px]">
                        Degree_Certificate
                      </span>
                      <span className="text-[8px] text-gray-500 font-mono">PDF Document</span>
                    </div>
                  )}

                  {/* REAL ID THUMBNAIL - Clean, No Pastel Box */}
                  {doc.previewType === 'id' && (
                    <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px]">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-black" strokeWidth={1.5} />
                        <span className="font-bold text-black text-[8px] uppercase">Official Passport</span>
                      </div>
                      <div className="bg-gray-50 p-1 border border-gray-200 flex items-center gap-1.5">
                        <div className="w-5 h-6 bg-gray-200" />
                        <div className="space-y-0.5">
                          <div className="w-10 h-1 bg-black/40" />
                          <div className="w-6 h-1 bg-black/20" />
                        </div>
                      </div>
                      <span className="text-[6px] text-gray-500 font-mono">NO: ••••••••8495</span>
                    </div>
                  )}

                  {/* REAL VIDEO THUMBNAIL */}
                  {doc.previewType === 'video' && (
                    <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white relative">
                      <Play className="w-6 h-6 text-white" strokeWidth={1.5} />
                      <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black px-1 text-white">
                        04:18
                      </span>
                    </div>
                  )}

                  {/* Hover Cue */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Eye className="w-3 h-3 text-black" strokeWidth={1.75} /> View
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-xs font-bold text-black truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                      }}
                      className="text-gray-400 hover:text-black p-0.5"
                    >
                      <MoreVertical className="w-3.5 h-3.5 text-black" strokeWidth={1.75} />
                    </button>
                  </div>

                  <span className="text-[9px] font-mono text-gray-500 block mb-1">
                    {doc.category}
                  </span>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-1.5 font-mono">
                    <span>{doc.size}</span>
                    <span>{doc.date}</span>
                  </div>
                </div>

                {/* Action Menu */}
                {activeMenuId === doc.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-2 top-20 z-30 w-36 rounded-sm bg-white border border-gray-200 shadow-xl py-1 text-xs text-black"
                  >
                    <button
                      onClick={() => {
                        setPreviewDoc(doc);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> Preview
                    </button>
                    <button
                      onClick={() => setActiveMenuId(null)}
                      className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> Download
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => setActiveMenuId(null)}
                      className="w-full px-3 py-1.5 text-left hover:bg-gray-50 text-black flex items-center gap-2 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-black" strokeWidth={1.75} /> Move to Trash
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-mono">
          <div className="flex items-center gap-1.5 text-black font-semibold">
            <Check className="w-3 h-3 text-black" strokeWidth={2} />
            <span>0 Bytes Stored On Server Disks</span>
          </div>
          <span>AES-256-GCM Secure Pipeline</span>
        </div>
      </div>

      {/* Real Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-sm shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden text-left"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div>
                  <h3 className="text-sm font-bold text-black truncate max-w-[260px]">
                    {previewDoc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-0.5">
                    <span>{previewDoc.category}</span>
                    <span>•</span>
                    <span>{previewDoc.size}</span>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 hover:bg-gray-100 text-black rounded-sm"
                >
                  <X className="w-4 h-4 text-black" strokeWidth={1.75} />
                </button>
              </div>

              <div className="p-4 bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                {previewDoc.previewType === 'exam' ? (
                  <div className="w-full bg-white border border-gray-200 p-4 font-mono text-xs text-black space-y-2">
                    <div className="border-b border-gray-200 pb-1 flex justify-between font-bold text-[10px] text-gray-500 uppercase">
                      <span>Python Programming Examination</span>
                      <span>11 Nov 2026</span>
                    </div>
                    <p className="font-bold text-black pt-1">
                      Q1. Choose the correct option / answer:
                    </p>
                    <pre className="bg-gray-50 p-2.5 border border-gray-200 text-[11px] text-black overflow-x-auto">
{`a = True
b = False
if not a or b:
    print("A")
elif not a or not b and a:
    print("B")
else:
    print("C")`}
                    </pre>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <FileText className="w-10 h-10 text-black mx-auto" strokeWidth={1.5} />
                    <h4 className="font-bold text-sm text-black">{previewDoc.name}</h4>
                    <p className="text-xs text-gray-500">{previewDoc.description}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 border border-gray-200 font-semibold text-black hover:bg-gray-50 rounded-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => alert('Downloading directly from Google Drive stream.')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealSoftwareMockup;
