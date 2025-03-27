"use client";

import React from "react";
import {Member} from "@/interface/Member";
import {PageResponse} from "@/interface/PageResponse";
import Image from "next/image";
// import { ChevronLeft, ChevrChevronRightonRight } from "lucide-react";

type Props = {
    users: PageResponse<Member> | undefined;
    onPageChange?: (page: number) => void; // 필요한 경우 콜백으로 페이지 이동 처리 가능
};

const UserListView = ({ users, onPageChange }: Props) => {
    return (
        <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="mb-2">
                <h2 className="text-2xl font-semibold text-gray-800">User list</h2>
                <p className="text-gray-500 mt-1">{users?.totalCount ?? 0} users</p>
            </div>

            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] text-gray-500 text-sm font-medium border-b border-gray-200 pb-2">
                <span>Email</span>
                <span>User name</span>
                <span>Role</span>
                <span>Signup Date</span>
            </div>

            {/* 유저 리스트 */}
            {users?.dtoList.map((user) => (
                <div
                    key={user.email}
                    className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] items-center gap-4 bg-white p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
                >
                    {/* Email + 이미지 */}
                    <div className="flex items-center gap-3">
                        <Image
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                            src="/images/mall/no_image.png"
                            alt="user"
                        />
                        <span className="text-gray-800 font-medium">{user.email}</span>
                    </div>

                    {/* Nickname */}
                    <div className="text-gray-700">{user.nickname}</div>

                    {/* Role */}
                    <div className="text-gray-700">{user.roleNames.join(", ")}</div>

                    {/* Signup Date */}
                    <div className="text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}

            {/* 페이지네이션 */}
            <div className="flex justify-between items-center pt-4 border-t mt-4">
                <button
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                    onClick={() => onPageChange?.(users?.current! - 1)}
                    disabled={!users?.prev}
                >
                    {/*<ChevronLeft className="w-4 h-4" />*/}
                    Prev
                </button>

                <div className="flex items-center gap-2">
                    {users?.pageNumList.map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1.5 rounded ${
                                users.current === page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={() => onPageChange?.(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                    onClick={() => onPageChange?.(users?.current! + 1)}
                    disabled={!users?.next}
                >
                    Next
                    {/*<ChevronRight className="w-4 h-4" />*/}
                </button>
            </div>
        </div>
    );
};

export default UserListView;
