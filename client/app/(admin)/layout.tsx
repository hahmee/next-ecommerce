// app/(admin)/layout.tsx

'use client';

import React, { useState } from 'react';

import Header from '@/widgets/layout/ui/Header';
import Sidebar from '@/widgets/layout/ui/Sidebar';

export default function AdminLayout({
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
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start  overflow-x-hidden ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="lg:ml-72.5 mt-20 ">
            <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 min-h-screen h-auto">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>

      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
}
