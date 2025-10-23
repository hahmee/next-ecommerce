// app/(home)/layout.tsx

// app/(home)/layout.tsx

import React from 'react';

import Footer from '@/widgets/layout/ui/Footer';
import Navbar from '@/widgets/layout/ui/Navbar';

export default async function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
