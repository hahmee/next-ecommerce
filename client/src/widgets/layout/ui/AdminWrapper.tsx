'use client';
import { useState } from 'react';
import { Header, Sidebar } from '@/widgets/layout';

export function AdminWrapper({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark bg-graylight">
      {modal}
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="lg:ml-72.5 mt-20 ">
            <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 min-h-screen h-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
