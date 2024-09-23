'use client';
import React from "react";
import {useRouter} from "next/navigation";

const AdminModal = ({children, modalTitle}: { children: React.ReactNode, modalTitle:string}) => {
    const router = useRouter();

    const closeModal = () => {
        router.push('/admin/category');  // 모달 닫기 시 이 경로로 이동
    };

    return (
        <div id="crud-modal" tabIndex={-1} onClick={closeModal}
             aria-hidden="true"
             className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative bg-white rounded-lg shadow dark:bg-boxdark">
                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {modalTitle}
                        </h3>
                        <button type="button" onClick={closeModal}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="crud-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
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