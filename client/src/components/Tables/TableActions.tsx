import ClickOutside from "@/components/ClickOutside";
import React, { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
interface DropdownPosition {
    top: number;
    left: number;
}
const TableActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0 });

    const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>) => {

        event.stopPropagation()

        const rect = event.currentTarget.getBoundingClientRect();

        // 현재 뷰포트 너비와 높이를 기준으로 드롭다운이 화면 밖으로 벗어나는지 확인
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dropdownWidth = 176; // 드롭다운 너비
        const dropdownHeight = 120; // 드롭다운 높이 예상

        // 기본 위치 설정
        let top = rect.top + window.scrollY + 30;
        let left = rect.left + window.scrollX;

        // 오른쪽 경계 넘을 경우 왼쪽으로 위치 조정
        if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth - 16; // 여유 간격 유지
        }

        // 하단 경계 넘을 경우 위쪽으로 위치 조정
        if (top + dropdownHeight > viewportHeight) {
            top = viewportHeight - dropdownHeight - 16; // 여유 간격 유지
        }

        setDropdownPosition({top, left});
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
            <button
                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                type="button"
                onClick={handleDropdownToggle}

            >
                <EllipsisHorizontalIcon className="h-6 w-6" />
            </button>

            {dropdownOpen && (
                <div
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    className="fixed w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                >
                    {children}
                </div>
            )}
        </ClickOutside>
    );
};

export default TableActions;
