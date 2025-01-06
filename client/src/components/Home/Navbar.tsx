import Link from "next/link";
import Menu from "@/components/Home/Menu";
import SearchBar from "@/components/Home/SearchBar";
import React, {Suspense} from "react";
import {Member} from "@/interface/Member";
import {getCategories} from "@/apis/adminAPI";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import FullMenu from "@/components/Home/FullMenu";
import FullMenuSkeleton from "../Skeleton/FullMenuSkeleton";
import {ShoppingBagIcon} from "@heroicons/react/24/outline";
import {getCart} from "@/apis/mallAPI";
import NavIcons from "@/components/Home/NavIcons";

const Navbar = ({member}: { member: Member }) => {

  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => getCategories(),
    },
    {
      queryKey: ['carts'],
      queryFn: () => getCart(),
    },
  ];

  return (
      <div className="pt-20 md:pt-32 relative">
        <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 border-b border-gray-100 bg-white fixed top-0 w-full z-9999">
          {/* MOBILE */}
          <div className="h-full flex items-center justify-between md:hidden">
            <Link href="/">
              <div className="text-xl font-extrabold tracking-wide text-ecom">E-COM</div>
            </Link>
            {
                member && <Menu memberInfo={member}/>
            }
          </div>
          {/* BIGGER SCREENS */}
          <div className="hidden md:flex items-center justify-between gap-8 h-full ">
            {/* LEFT */}
            <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
              <Link href="/" className="flex gap-1">
                <ShoppingBagIcon className="h-7 w-7 text-ecom"/>
                <div className="text-xl font-extrabold tracking-wide text-ecom">E-COM</div>
              </Link>


            </div>
            {/* RIGHT */}
            <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
              {
                  member && (
                      <>
                        <SearchBar/>
                        <PrefetchBoundary prefetchOptions={prefetchOptions}>
                          <NavIcons memberInfo={member}/>
                        </PrefetchBoundary>
                      </>
                  )
              }
            </div>
          </div>
          {
              member && <div className="hidden md:flex bg-white h-12 right-0 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 border-b border-gray-100 w-full items-center fixed top-20 ">
                <Suspense fallback={<FullMenuSkeleton/>}>
                  <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <FullMenu member={member}/>
                  </PrefetchBoundary>
                </Suspense>
              </div>
          }

        </div>
      </div>
  );
};

export default Navbar;
