import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/Common/ClickOutside";
import { getCookie } from "cookies-next";
import {Member} from "@/interface/Member";

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [member, setMember] = useState<Member | null>(null); // 타입 정의

    useEffect(() => {
        const memberInfo = getCookie('member');
        if (memberInfo) {
            setMember(JSON.parse(memberInfo));
        }
    }, []);

    return (
        <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
            <Link
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                href="#"
            >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {member ? member.nickname : "Loading..."}
          </span>
            <span className="block text-xs">{member && member.roleNames}</span>
        </span>
                <span className="h-12 w-12 rounded-full flex items-center justify-center">
          <Image
              width={500}
              height={500}
              src="/images/admin/user-01.png"
              style={{
                  width: "auto",
                  height: "auto",
              }}
              alt="User"
          />
        </span>
            </Link>
        </ClickOutside>
    );
};

export default DropdownUser;
