import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { Suspense } from 'react';
import FullMenuSkeleton from 'src/components/Skeleton/FullMenuSkeleton';

import FullMenu from '@/components/Home/Common/FullMenu';
import Menu from '@/components/Home/Common/Menu';
import NavIcons from '@/components/Home/Common/NavIcons';
import SearchBar from '@/components/Home/Search/SearchBar';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { categoryApi } from '@/libs/services/categoryApi';

const Navbar = () => {
  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => categoryApi.listPublic({ next: { revalidate: 60, tags: ['categories'] } }),
    },
  ];

  return (
    <div className="pt-20 md:pt-32 relative">
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 border-b border-gray-100 bg-white fixed top-0 w-full z-10">
          {/* MOBILE */}
          <div className="h-full flex items-center justify-between md:hidden">
            <Link href="/public">
              <div className="text-xl font-extrabold tracking-wide text-ecom">E-COM</div>
            </Link>
            <Menu />
          </div>

          {/* BIGGER SCREENS */}
          <div className="hidden md:flex items-center justify-between gap-8 h-full">
            {/* LEFT */}
            <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
              <Link href="/public" className="flex gap-1">
                <ShoppingBagIcon className="h-7 w-7 text-ecom" />
                <div className="text-xl font-extrabold tracking-wide text-ecom">E-COM</div>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
              <SearchBar />
              <NavIcons />
            </div>
          </div>

          {/* FULL MENU */}
          <div className="hidden md:flex bg-white h-12 right-0 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 border-b border-gray-100 w-full items-center fixed top-20">
            <Suspense fallback={<FullMenuSkeleton />}>
              <FullMenu />
            </Suspense>
          </div>
        </div>
      </PrefetchBoundary>
    </div>
  );
};

export default Navbar;
