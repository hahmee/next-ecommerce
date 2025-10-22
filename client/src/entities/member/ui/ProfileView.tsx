// src/entities/member/ui/ProfileView.tsx



'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Member } from '@/entities/member/model/Member';

interface Props {
  member: Member | null;
  isLoading: boolean;
}

export function ProfileView({ member, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="rounded-sm border border-stroke bg-white p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-30 md:h-65 bg-gray-100" />
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-gray-200 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <Image
              src="/images/admin/user-01.png"
              alt="profile"
              width={1000}
              height={1000}
              className="cursor-pointer"
              aria-label="my-profile"
            />
          </div>

          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {member?.nickname ?? '-'} ({member?.roleNames ?? '-'})
            </h3>
            <p className="font-medium">{member?.email ?? '-'}</p>

            <div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">2</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">1</span>
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">2</span>
                <span className="text-sm">Following</span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">About Me</h4>
              <p className="mt-4.5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere
                fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet.
              </p>
            </div>

            <div className="mt-6.5">
              <h4 className="mb-3.5 font-medium text-black dark:text-white">Follow me on</h4>
              <div className="flex items-center justify-center gap-3.5">
                <Link href="#" className="hover:text-primary" aria-label="social-icon">
                  {/* svg ... */}
                </Link>
                <Link href="#" className="hover:text-primary" aria-label="social-icon">
                  {/* svg ... */}
                </Link>
                <Link href="#" className="hover:text-primary" aria-label="social-icon">
                  {/* svg ... */}
                </Link>
                <Link href="#" className="hover:text-primary" aria-label="social-icon">
                  {/* svg ... */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
