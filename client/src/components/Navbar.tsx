import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Menu from "@/components/Menu";
import SearchBar from "@/components/SearchBar";
import FullMenu from "@/components/FullMenu";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {Member} from "@/interface/Member";
import {getCategories} from "@/api/adminAPI";
import {getCart} from "@/api/mallAPI";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = ({member}: { member: Member }) => {

  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => getCategories(),
    },
    {
      queryKey: ['carts'],
      queryFn: () => getCart(),
    }
  ];

  return (
      <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative border-b border-gray-100">
        {/* MOBILE */}
        <div className="h-full flex items-center justify-between md:hidden">
          <Link href="/">
            <span className="text-2xl tracking-wide">E-COM</span>
          </Link>
          <Menu/>
        </div>
        {/* BIGGER SCREENS */}
        <div className="hidden md:flex items-center justify-between gap-8 h-full  ">
          {/* LEFT */}
          <div className="w-1/3 xl:w-1/2 flex items-center gap-12 ">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="" width={24} height={24}/>
              <div className="text-2xl tracking-wide">E-COM</div>
            </Link>

            <Suspense fallback={<Loading/>}>
              <PrefetchBoundary prefetchOptions={prefetchOptions}>
                {
                  member && <FullMenu member={member}/>
                }
              </PrefetchBoundary>
            </Suspense>


          </div>
          {/* RIGHT */}
          <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
            {
                member && (
                    <>
                      <SearchBar/>
                      <NavIcons memberInfo={member}/>
                    </>
                )
            }
          </div>
        </div>
      </div>
  );
};

export default Navbar;
