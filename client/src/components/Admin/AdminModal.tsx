'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminModal = ({ children, modalTitle }: { children: React.ReactNode; modalTitle: string }) => {
    const router = useRouter();

    // 모달 열릴 때 overflow-hidden 추가
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = ""; // 모달이 닫힐 때 스크롤 복원
        };
    }, []);

    const closeModal = () => {
        router.push('/admin/category'); // 모달 닫기 시 경로 이동
    };

    return (
        <div
            id="crud-modal"
            tabIndex={-1}
            onClick={closeModal}
            className="bg-black2/70 fixed top-0 right-0 left-0 bottom-0 z-9999 flex justify-center items-center w-full h-full"
        >
            <div
                className="relative p-4 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white rounded-lg shadow dark:bg-boxdark max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {modalTitle}
                        </h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="crud-modal"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
