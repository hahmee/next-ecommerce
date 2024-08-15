"use client";
import UpdateButton from "@/components/UpdateButton";
import {useQuery} from "@tanstack/react-query";
import {getUserServer} from "@/app/(home)/profile/_lib/getUserServer";

const UserInfo = () => {
    const {data, error} = useQuery({
        queryKey: ['users'],
        queryFn: () => getUserServer(),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
    });
    // console.log('data---------', data);
    const user = data?.result;
    // console.log('user', user);
    return (
        <div
            className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <div className="w-full md:w-1/2">
                <h1 className="text-2xl">Profile</h1>
                <form className="mt-12 flex flex-col gap-4">
                    <input type="text" hidden name="id"/>
                    <label className="text-sm text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder={user?.email}
                        className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
                    />
                    <label className="text-sm text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
                    />
                    <label className="text-sm text-gray-700">Surname</label>
                    <input
                        type="text"
                        name="lastName"
                        className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
                    />
                    <label className="text-sm text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
                    />
                    <label className="text-sm text-gray-700">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
                    />
                    <UpdateButton/>
                </form>
            </div>
            <div className="w-full md:w-1/2">
                <h1 className="text-2xl">Orders</h1>
            </div>
        </div>
    );
};

export default UserInfo;