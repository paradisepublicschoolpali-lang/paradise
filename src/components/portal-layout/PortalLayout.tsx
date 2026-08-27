import React, { useState } from 'react';
import { PortalSidebar } from './PortalSidebar';
import { PortalHeader } from './PortalHeader';

interface PortalLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  activeTab,
  setActiveTab,
  title,
  subtitle,
  children
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Sidebar */}
      <PortalSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <PortalHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
