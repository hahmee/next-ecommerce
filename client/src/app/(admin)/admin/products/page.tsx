import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import ProductTable from "@/components/Admin/Tables/ProductTable";
import {getProductsByEmail} from "@/apis/adminAPI";
import {TableSkeleton} from "@/components/Skeleton/TableSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import {cookies} from "next/headers";


export default async function ProductsPage() {
  const cookieStore = cookies();
  //쿠키가 재설정되도 client에서만 쿠키가 갱신된 상태
  //서버는 아직 해당 요청을 받지 않음-> undefined
  //따라서 권장 구조: 서버에서는 인증 상태를 확인하지 않고 CSR에서 처리
  const accessToken = cookieStore.get("access_token")?.value;
  console.log('ProductsPage - accessToken: ',accessToken)

    const prefetchOptions =
        {
            queryKey: ['adminProducts', {page:1, size:10, search:""}],
            queryFn: () => getProductsByEmail({page: 1, size: 10, search:""}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Products"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<TableSkeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <ProductTable/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};