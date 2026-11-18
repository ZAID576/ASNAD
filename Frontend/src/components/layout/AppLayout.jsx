import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { DocumentUploaderModal } from '../documents/DocumentUploaderModal';

export const AppLayout = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('asnad_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('asnad_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFD] dark:bg-[#0E1217]">
      {/* Desktop Sidebar with Open/Close Toggle (Hidden on mobile) */}
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleSidebar} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8 transition-all duration-300">
        <Header onOpenUpload={() => setIsUploadModalOpen(true)} />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openUploadModal: () => setIsUploadModalOpen(true) }} />
        </main>

        {/* Mobile Fixed Navigation */}
        <MobileBottomNav />

        {/* Global Document Upload Modal */}
        <DocumentUploaderModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            // Trigger custom event or let views refresh
            window.dispatchEvent(new Event('documentUploaded'));
          }}
        />
      </div>
    </div>
  );
};
