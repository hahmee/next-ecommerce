'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { SidebarItemType } from '@/widgets/layout';

interface SidebarDropdownProps {
  item: SidebarItemType[];
  changeShowDialog: () => void;
}

export const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ item, changeShowDialog }) => {
  const pathname = usePathname();
  // const [showDialog, setShowDialog] = useState(false);
  // const toggleModal = () => setShowDialog((prev) => !prev);
  return (
    <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
      {item.map((menuItem, index) => (
        <li key={index}>
          {menuItem.click === 'logout' ? (
            <div
              onClick={changeShowDialog}
              className="cursor-pointer group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
            >
              {menuItem.label}
            </div>
          ) : (
            <Link
              href={menuItem.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                pathname === menuItem.route ? 'text-white' : ''
              }`}
            >
              {menuItem.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};
