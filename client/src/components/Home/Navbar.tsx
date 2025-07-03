import Link from "next/link";
import Menu from "@/components/Home/Menu";
import SearchBar from "@/components/Home/SearchBar";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import FullMenu from "@/components/Home/FullMenu";
import FullMenuSkeleton from "../Skeleton/FullMenuSkeleton";
import {ShoppingBagIcon} from "@heroicons/react/24/outline";
import {getCart} from "@/apis/mallAPI";
import NavIcons from "@/components/Home/NavIcons";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import GuestAuthButtons from "@/components/Home/GuestAuthButtons";
import {getPublicCategories} from "@/apis/publicAPI";
import {cookies} from "next/headers";
import {getUserInfo} from "@/libs/auth";


const Navbar = async () => {

  const accessToken = cookies().get("access_token")?.value;
  let user = null;

  try {
    user = await getUserInfo();
  } catch (e) {
    console.error("getUserInfo 실패..:", e);
  }

  console.log('user',user)

  const prefetchOptions = [
    {
      queryKey: ["categories"],
      queryFn: () => getPublicCategories(),
    },
    ...(accessToken && user
      ? [
        {
          queryKey: ["carts"],
          queryFn: () => getCart(),
        },
      ]
      : []),
  ];

  return (
    <div className="pt-20 md:pt-32 relative">
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <div
          className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 border-b border-gray-100 bg-white fixed top-0 w-full z-10">
          {/* MOBILE */}
          <div className="h-full flex items-center justify-between md:hidden">
            <Link href="/">
              <div className="text-xl font-extrabold tracking-wide text-ecom">E-COM</div>
            </Link>
            {/*{user && accessToken && <Menu memberInfo={user} />}*/}
            { user && accessToken && <Menu/> }

          </div>

          {/* BIGGER SCREENS */}
          <div className="hidden md:flex items-center justify-between gap-8 h-full">
            {/* LEFT */}
            <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
              <Link href="/" className="flex gap-1">
                <ShoppingBagIcon className="h-7 w-7 text-ecom"/>
                <div className="text-xl font-extrabold tracking-wide text-ecom">E-COM</div>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
              <SearchBar/>
              {(accessToken && user) ? (
                <ErrorHandlingWrapper>
                  <NavIcons/>
                </ErrorHandlingWrapper>
              ) : (
                <GuestAuthButtons/>
              )}
            </div>
          </div>

          {/* FULL MENU */}
          <div
            className="hidden md:flex bg-white h-12 right-0 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 border-b border-gray-100 w-full items-center fixed top-20">
            <Suspense fallback={<FullMenuSkeleton/>}>
              <ErrorHandlingWrapper>
                <FullMenu/>
              </ErrorHandlingWrapper>
            </Suspense>
          </div>
        </div>
      </PrefetchBoundary>
    </div>
  );
};

export default Navbar;
