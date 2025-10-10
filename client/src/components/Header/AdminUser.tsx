import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import ClickOutside from '@/components/Common/ClickOutside';
import { useUserStore } from '@/store/userStore';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUserStore();

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user ? user.nickname : 'Loading...'}
          </span>
          <span className="block text-xs">{user && user.roleNames}</span>
        </span>
        <span className="h-12 w-12 rounded-full flex items-center justify-center">
          <Image
            width={500}
            height={500}
            src="/images/admin/user-01.png"
            style={{
              width: 'auto',
              height: 'auto',
            }}
            alt="User"
          />
        </span>
      </Link>
    </ClickOutside>
  );
};

export default DropdownUser;
