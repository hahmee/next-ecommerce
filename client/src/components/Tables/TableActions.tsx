import React, { useState } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Portal from "@/components/Common/Portal";
import ClickOutside from "@/components/ClickOutside";

const TableActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { x, y, refs, strategy, update } = useFloating({
        middleware: [offset(0), flip(), shift()],
        placement: "bottom-end",
        whileElementsMounted: autoUpdate, // 자동 업데이트 처리 (스크롤, 리사이즈 등)
    });

    // 드롭다운 열기/닫기 토글
    const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setDropdownOpen((prev) => !prev);
        update(); // 위치 업데이트
    };

    return (
        <ClickOutside onClick={() => setDropdownOpen(false)} className="bg-black">
            {/* 버튼 */}
            <button
                ref={refs.setReference} // 버튼 요소 등록
                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                type="button"
                onClick={handleDropdownToggle}
            >
                <EllipsisHorizontalIcon className="h-6 w-6"/>
            </button>

            {/* 드롭다운 */}
            {dropdownOpen && (
                <Portal>
                    <div
                        ref={refs.setFloating} // 드롭다운 요소 등록
                        style={{
                            position: strategy, // `absolute` 또는 `fixed`
                            top: y ?? 0, // y 좌표
                            left: x ?? 0, // x 좌표
                            zIndex: 999,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </div>
                </Portal>
            )}
        </ClickOutside>
    );
};

export default TableActions;
