"use client";

import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {getUserServer} from "@/app/(home)/profile/_lib/getUserServer";
import {Member} from "@/interface/Member";
import Image from "next/image";

const UserProfile = () => {

    const {data: user, isLoading} = useQuery<DataResponse<Member>, Object, Member>({
        queryKey: ['user'],
        queryFn: getUserServer,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: false,
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });
    return (
        <aside className="w-full lg:w-1/3 bg-white p-6">
            <h2 className="text-2xl mb-4">Profile</h2>
            <div className="flex items-center mb-4">
                <Image
                    src="https://via.placeholder.com/100"
                    alt="User Profile"
                    className="rounded-full w-24 h-24"
                    width={500}
                    height={500}
                />
                <div className="ml-4">
                    <p className="text-xl font-bold">{user?.nickname}</p>
                    <p className="text-gray-500">{user?.email}</p>
                    <p className="text-gray-500">{user?.roleNames}</p>
                </div>
            </div>

            <button
                className="bg-ecom w-full text-white p-2 rounded-md cursor-pointer disabled:bg-pink-200 disabled:cursor-not-allowed">
                Edit Profile
            </button>

        </aside>
    );
};

export default UserProfile;