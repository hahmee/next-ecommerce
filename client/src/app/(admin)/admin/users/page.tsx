import React, {Suspense} from "react";
import {getAdminStock, getAllMembers} from "@/apis/adminAPI";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loading from "@/app/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import UserDashbaord from "@/components/Admin/Users/UserDashbaord";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

const UserDashboardPage = () => {
    const prefetchOptions =
        {
            queryKey: ['members', {page: 1, size: 10, search: ""}],
            queryFn: () => getAllMembers({page: 1, size: 10, search: ""}),
        };

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Users"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <UserDashbaord/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );
};

export default UserDashboardPage;
