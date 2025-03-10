"use client";
import {StarIcon} from "@heroicons/react/20/solid";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Product} from "@/interface/Product";
import Link from "next/link";
import Image from "next/image";
import {ColorTag} from "@/interface/ColorTag";
import {CartItemList} from "@/interface/CartItemList";
import {CartItem} from "@/interface/CartItem";
import {useCartStore} from "@/store/cartStore";
import {getCookie} from "cookies-next";
import {SalesStatus} from "@/types/salesStatus";
import toast from "react-hot-toast";
import {getFeaturedProducts, getNewProducts} from "@/apis/adminAPI";
import Skeleton from "@/components/Skeleton/Skeleton";
import React, {useEffect, useState} from "react";

const MainProductList = ({type}: {type:"new" | "featured"}) => {

    const {carts, changeCart, changeOpen} = useCartStore();
    const memberInfo = getCookie('member');
    const [data, setData] = useState<Product[] | undefined>(undefined);
    const member = memberInfo ? JSON.parse(memberInfo) : null;

    const {data: newProducts, isFetched, isLoading, isError, isFetching} = useQuery<DataResponse<Array<Product>>, Object, Array<Product>>({
        queryKey: ['new-products'],
        queryFn: () => getNewProducts(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: type === "new",
        select: (data) => {
            return data.data;
        },
    });

    const {data: featuredProducts,} = useQuery<DataResponse<Array<Product>>, Object, Array<Product>>({
        queryKey: ['featured-products'],
        queryFn: () => getFeaturedProducts(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: type === "featured",
        select: (data) => {
            return data.data;
        }
    });

    useEffect(() => {
        if(type === "featured") {
            setData(featuredProducts);
        }else {
            setData(newProducts);
        }
    }, [data]);

    const handleClickAddCart = (pno: number, sellerEmail: string, options: { color: ColorTag, size: string; }) => {
        changeOpen(true);
        const result = carts.filter((item: CartItemList) => item.size === options.size && item.color.id === options.color.id);
        //해당하는 cino 의 개수를 바꿔야함
        if (result && result.length > 0) { // 담겨있었음
            const cartItemChange: CartItem = {
                email: member.email,
                pno: pno,
                qty: result[0].qty + 1,
                color: options.color,
                size: options.size,
                sellerEmail
            };
            changeCart(cartItemChange); // 수량만 추가
        } else { //아무것도 안담겨있었음
            const cartItem: CartItem = {
                email: member.email,
                pno: pno,
                qty: 1,
                color: options.color,
                size: options.size,
                sellerEmail
            };
            changeCart(cartItem); //새로 담기
        }

        toast.success('장바구니에 담겼습니다.');

    };

    // if (isLoading || isFetching) {
    //     // return <div>Loading...</div>; // 로딩 상태 표시
    //     return <Skeleton/>
    // }

    if(!newProducts || !featuredProducts) {
        return <Skeleton/>;
    }

    return (
        <div className="mt-20 w-full m-auto flex justify-center">
            <div className="flex justify-center gap-x-4 gap-y-5 flex-wrap w-270">
                {data?.map((product: Product) => (
                    <Link
                        href={"/product/" + product.pno}
                        className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-60"
                        key={product.pno}
                    >
                        <div>
                            <div className="relative w-full h-65">
                                {(product.uploadFileNames && product.uploadFileNames.length > 0) &&
                                    (
                                        <>
                                            <Image
                                                src={product.uploadFileNames[0]?.file || "/images/mall/product.png"}
                                                alt="product"
                                                fill
                                                sizes="25vw"
                                                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                                            />
                                            <Image
                                                src={product.uploadFileNames[1]?.file || "/images/mall/product.png"}
                                                alt=""
                                                fill
                                                sizes="25vw"
                                                className="absolute object-cover rounded-md"
                                            />
                                        </>
                                    )
                                }
                            </div>
                            <div className="flex mt-1.5 flex-col items-center">
                                {
                                    product.averageRating !== 0 ?
                                        <div className="flex gap-1 my-3">
                                            {Array.from({length: product.averageRating || 0}).map((_, index) => (
                                                <StarIcon key={index} className="w-4.5 h-4.5 text-ecom"/>
                                            ))}
                                        </div>
                                        :
                                        <div className="flex gap-1 my-3 text-xs text-gray-600">평점 없음</div>

                                }
                                <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 text-sm">{product.pname}</span>
                                <span className="font-semibold text-gray-600">{product.price?.toLocaleString()} 원</span>
                                <button
                                    disabled={product.salesStatus != SalesStatus.ONSALE}
                                    className="mt-3 rounded-2xl ring-1 ring-ecom text-ecom w-max py-2 px-4 text-xs hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
                                    onClick={(e) => {
                                        e.preventDefault(); // 페이지 이동 방지
                                        e.stopPropagation();// 부모로의 이벤트 전파 방지
                                        handleClickAddCart(product.pno, product.owner.email, {
                                            color: product.colorList[0],
                                            size: product.sizeList[0]
                                        });
                                    }}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </Link>))
                }
            </div>
        </div>
    );

};

export default MainProductList;