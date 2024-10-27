import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import Profile from "@/components/Admin/Profile";
import {getCookie} from "@/utils/getCookieUtil";


export async function generateMetadata() {

    const member = getCookie("member");

    return {
        title: `${member?.nickname} (${member?.email})`,
        description: `${member?.nickname} (${member?.email}) 프로필`,
    }
}

export default async function ProfilePage() {

    const member = getCookie("member");

    if(!member) {
        return <></>;
    }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Profile"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    {/*<PrefetchBoundary prefetchOptions={prefetchOptions}>*/}
                        <Profile member={member}/>
                    {/*</PrefetchBoundary>*/}
                </Suspense>
            </div>
        </div>
    );

};