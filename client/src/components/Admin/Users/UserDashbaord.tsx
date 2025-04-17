"use client";
import React, {useState} from "react";
import TestChart from "@/components/Admin/Dashboard/Charts/TestChart";
import UserListView from "@/components/Admin/Users/UserListVeiw";
import HeatmapChart from "@/components/Admin/Dashboard/Charts/HeatmapChart";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {PageResponse} from "@/interface/PageResponse";
import {getAllMembers} from "@/apis/adminAPI";
import {Member} from "@/interface/Member";
import {useRouter} from "next/navigation";

const UserDashboard = () => {
    // 예시 데이터 (실제 데이터로 교체)
    const stats = {
        total: "12,345",
        active: "10,987",
        newSignups: "234",
    };

// 예시 데이터: 실제 프로젝트에서는 API나 상태관리 라이브러리에서 받아온 데이터를 사용하세요.
//     const users = [
    //     {
    //         id: 1,
    //         name: "홍길동",
    //         email: "hong@example.com",
    //         avatarUrl: "https://via.placeholder.com/150",
    //         role: "Admin",
    //         active: true,
    //     },
    //     {
    //         id: 2,
    //         name: "김철수",
    //         email: "kim@example.com",
    //         avatarUrl: "https://via.placeholder.com/150",
    //         role: "User",
    //         active: false,
    //     },
    //     // 더 많은 사용자...
    // ];

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const router = useRouter();

    const { isFetched, isFetching, data:users, error, isError} = useQuery<DataResponse<PageResponse<Member>>, Object, PageResponse<Member>, [_1: string, _2: Object]>({
        queryKey: ['adminMembers', {page, size, search}],
        queryFn: () => getAllMembers({page, size, search}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        throwOnError: true,
        select: (data) => {
            return data.data;
        }
    });

    console.log(users);
    return (
        <div className="p-6 bg-white shadow rounded-lg">
            {/* 통계 카드 영역 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-700">총 사용자 수</h3>
                    <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-700">활성 사용자</h3>
                    <p className="text-3xl font-bold mt-2">{stats.active}</p>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-700">오늘 가입자</h3>
                    <p className="text-3xl font-bold mt-2">{stats.newSignups}</p>
                </div>
            </div>

            {/* 사용자 성장 추세 차트 영역 */}
            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                <div className="mt-6 col-span-12 xl:col-span-6">
                    {/*<h4 className="text-xl font-semibold text-gray-700 mb-2">사용자 성장 추세</h4>*/}
                    <TestChart/>
                </div>
                <div className="mt-6 col-span-12 xl:col-span-6">
                    {/*<h4 className="text-xl font-semibold text-gray-700 mb-2">사용자 성장 추세</h4>*/}
                    <HeatmapChart/>
                </div>
            </div>

            <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">User List</h4>
                <UserListView users={users} onPageChange={(page) => {
                    // router.push(`/admin/user?page=${page}`);
                }} />
            </div>

        </div>
    );
};

export default UserDashboard;
