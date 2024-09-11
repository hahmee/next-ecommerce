"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Product} from "@/interface/Product";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";
import {useCallback} from "react";
import ProductImages from "@/components/Home/ProductImags";
import Add from "@/components/Home/Add";

interface Props {
    id: string;
}

const ProductSingle = ({id}: Props) => {
    const {isLoading, data, error} = useQuery<DataResponse<Product>, Object, DataResponse<Product>, [_1: string, _2: string]>({
        queryKey: ['productCustomerSingle', id],
        queryFn: getProduct,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        enabled: !!id, // id가 존재할 때만 쿼리 요청 실행

    });


    const product = data?.data;


    return (
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
            {/* IMG */}
            <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
                {

                    product?.uploadFileNames &&
                    <ProductImages items={product.uploadFileNames}/>

                }
            </div>
            {/* TEXTS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-4xl font-medium">{product?.pname}</h1>
                {product?.pdesc && (
                    <div dangerouslySetInnerHTML={{__html: product.pdesc}} className="text-gray-500"/>
                )}
                <div className="h-[2px] bg-gray-100"/>


                <h2 className="font-medium text-2xl">${product?.price}</h2>

                <div className="h-[2px] bg-gray-100"/>

                <Add
                    productId={product?.pno!}
                    variantId="00000000-0000-0000-0000-000000000000"
                    stockNumber={0}
                />


                <div className="h-[2px] bg-gray-100"/>
                <div className="text-sm">
                    <h4 className="font-medium mb-4">교환정책</h4>
                    <p>{product?.changePolicy}</p>
                </div>
                <div className="text-sm">
                    <h4 className="font-medium mb-4">환불정책</h4>
                    <p>{product?.refundPolicy}</p>
                </div>
                <div className="h-[2px] bg-gray-100"/>
                {/* REVIEWS */}
                <h1 className="text-2xl">User Reviews</h1>
                {/*<Suspense fallback="Loading...">*/}
                {/*    <Reviews productId={product._id!}/>*/}
                {/*</Suspense>*/}
            </div>
        </div>
    );
};

export default ProductSingle;