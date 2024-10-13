import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import ProductTable from "@/components/Tables/ProductTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import toast from "react-hot-toast";


export default async function ProductsPage(
    // {params, searchParams}: {
    // params: { slug: string },
    // searchParams: { [key: string]: string } //{ [key: string]: string | string[] | undefined }
    // }
) {


    // const queryClient = new QueryClient({
    //     queryCache: new QueryCache({
    //         onError: (error, query) => queryErrorHandler,
    //     }),
    // });

    // const {page, size, search} = searchParams;

    const pageNumber = Number(page);
    const sizeNumber = Number(size);

    const prefetchOptions =
        {
            queryKey: ['adminProducts', {page, size, search}],
            queryFn: () => getProductsByEmail({page: pageNumber, size: sizeNumber, search}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Products"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ProductTable page={pageNumber} size={sizeNumber}/>
                    </PrefetchBoundary>
                </Suspense>

                {/*<Suspense fallback={<Loading/>}>*/}
                {/*    <ProductTableSuspense page = {Number(searchParams.page)} size={Number(searchParams.size)}/>*/}
                {/*</Suspense>*/}
            </div>
        </div>
    );

};