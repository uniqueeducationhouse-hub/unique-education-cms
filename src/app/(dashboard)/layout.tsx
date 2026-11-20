import React, { Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SchoolSettingsProvider } from '@/lib/school-settings';
import { SidebarProvider } from '@/components/layout/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SchoolSettingsProvider>
      <SidebarProvider>
        <div className="min-h-screen flex bg-slate-50 relative overflow-x-hidden w-full">
          <Suspense fallback={<aside className="hidden lg:block w-64 bg-slate-900 min-h-screen no-print shrink-0" />}>
            <Sidebar />
          </Suspense>
          <div className="w-full min-w-0 flex-1 flex flex-col overflow-x-hidden">
            <Header />
            <main className="w-full min-w-0 flex-1 overflow-x-hidden p-3 sm:p-6 overflow-y-auto">
              <div className="w-full min-w-0">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SchoolSettingsProvider>
  );
}
