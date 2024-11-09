import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Profile from "@/components/Admin/Profile";
import {getUserInfo} from "@/api/mallAPI";
import {getCookie} from "@/utils/cookie";

export async function generateMetadata() {

    const member = await getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}

export default async function ProfilePage() {

    const prefetchOptions = {
            queryKey: ['user'],
            queryFn: () => getUserInfo,
    }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Profile"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <Profile/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};