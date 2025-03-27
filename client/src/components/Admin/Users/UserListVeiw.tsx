import React from "react";
import { Member } from "@/interface/Member";
import { PageResponse } from "@/interface/PageResponse";
import Image from "next/image";

const UserListView = ({ users }: { users: PageResponse<Member> | undefined }) => {
    return (
        <div className="p-6">
            {/* 상단 헤더 영역 */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">User list</h2>
                <p className="text-gray-500 mt-1">{users?.totalCount ?? 0} users</p>
            </div>

            {/* 사용자 목록 */}
            <div className="space-y-4">
                {/* 헤더 레이블 */}
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] text-gray-400 text-sm px-4">
                    <span>Email</span>
                    <span>User name</span>
                    <span>Role</span>
                    <span>Signup Date</span>
                </div>

                {/* 유저 리스트 */}
                {users?.dtoList.map((user) => (
                    <div
                        key={user.email}
                        className="bg-white border border-gray-200 rounded shadow-sm p-4"
                    >
                        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] items-center gap-4">
                            {/* Email + Image */}
                            <div className="flex items-center gap-3">
                                <Image
                                    width={500}
                                    height={500}
                                    className="h-10 w-10 rounded-full object-cover"
                                    src="/images/mall/no_image.png"
                                    alt="user"
                                />
                                <span className="text-gray-800 font-semibold">{user.email}</span>
                            </div>

                            {/* Nickname */}
                            <div className="text-gray-800">{user.nickname}</div>

                            {/* Roles */}
                            <div className="text-gray-800">{user.roleNames.join(", ")}</div>

                            {/* Signup Date */}
                            <div className="text-gray-800">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserListView;
