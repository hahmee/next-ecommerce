"use client";
import {useQuery} from "@tanstack/react-query";
import {Product} from "@/interface/Product";
import {useEffect, useState} from "react";
import ProductImages from "@/components/Home/Product/ProductImags";
import Reviews from "@/components/Home/Review/Reviews";
import {SalesStatus} from "@/types/salesStatus";
import OptionSelect from "@/components/Home/Product/OptionSelect";
import {ColorTag} from "@/interface/ColorTag";
import AddCart from "@/components/Home/Cart/AddCart";
import {Review} from "@/interface/Review";
import {getPublicProduct, getPublicReviews} from "@/apis/publicAPI";

interface Props {
    id: string;
}

const ProductSingle = ({id}: Props) => {

    const {isLoading, data:product, error} = useQuery<Product, Object, Product, [_1: string, _2: string]>({
        queryKey: ['productCustomerSingle', id],
        queryFn: getPublicProduct,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: !!id, // id가 존재할 때만 쿼리 요청 실행
    });

    const {data:reviews} = useQuery<Array<Review>, Object, Array<Review>, [_1: string, _2: string]>({
        queryKey: ['reviews', id],
        queryFn: () => getPublicReviews({queryKey: ['reviews', id]}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: !!id, // id가 존재할 때만 쿼리 요청 실행
    });

    //초기값 세팅
    const [color, setColor] = useState<ColorTag>({ id: 0, text: '', color: '' });
    const [size, setSize] = useState<string>("");

    useEffect(() => {
        if (product) {
            setColor(product.colorList[0]);
            setSize(product.sizeList[0]);
        }
    }, [product]);

    return (
        <div className="px-4 mt-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
            
            {/* IMG */}
            <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
                {
                   ( product?.uploadFileNames &&  product?.uploadFileNames.length > 0) &&
                    <ProductImages items={product.uploadFileNames}/>
                }
            </div>
            {/* TEXTS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-4xl font-medium">{product?.pname}</h1>
                {product?.pdesc && (
                    <div dangerouslySetInnerHTML={{__html: product.pdesc}} className="text-gray-500"/>
                )}
                <div className="h-[1px] bg-gray-100"/>

                <h2 className="font-medium text-2xl">{product?.price.toLocaleString()} 원</h2>

                <div className="h-[1px] bg-gray-100"/>
                {
                    (product && product.colorList && product.sizeList) &&
                    <OptionSelect colorList={product.colorList} sizeList={product.sizeList}
                                  size={size || product.sizeList[0]} setSize={setSize}
                                  color={color || product.colorList[0]} setColor={setColor}/>
                }
                <AddCart
                    pno={Number(id)}
                    salesStatus={product?.salesStatus || SalesStatus.ONSALE}
                    options={{size: size, color: color}}
                    sellerEmail={product?.owner.email || ""}
                />


                <div className="h-[1px] bg-gray-100"/>
                <div className="text-sm">
                    <h4 className="font-medium mb-4">교환정책</h4>
                    <p>{product?.changePolicy}</p>
                </div>
                <div className="text-sm">
                    <h4 className="font-medium mb-4">환불정책</h4>
                    <p>{product?.refundPolicy}</p>
                </div>
                <div className="h-[1px] bg-gray-100"/>
                {/* REVIEWS */}
                <h1 className="text-2xl">User Reviews</h1>
                {
                    product?.pno &&
                    <Reviews reviews={reviews}/>
                }
            </div>
        </div>
    );
};

export default ProductSingle;