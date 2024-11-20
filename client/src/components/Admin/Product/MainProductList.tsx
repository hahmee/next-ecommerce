"use client";

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
import {getCategories} from "@/api/adminAPI";

const MainProductList = () => {

    const {carts, changeCart, changeOpen} = useCartStore();
    const memberInfo = getCookie('member');
    const member = memberInfo ? JSON.parse(memberInfo) : null;

    const {data: newProducts, isFetched, isLoading, isError, isFetching} = useQuery<DataResponse<Array<Product>>, Object, Array<Product>>({
        queryKey: ['new-products'],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        select: (data) => {
            return data.data;
        }
    });

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

    if (isLoading || isFetching) {
        return <div>Loading...</div>; // 로딩 상태 표시
    }

    return (
        <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
            {newProducts?.map((product: Product) => (
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
                                            src={product.uploadFileNames[0]?.file || "/product.png"}
                                            alt="product"
                                            fill
                                            sizes="25vw"
                                            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                                        />
                                        <Image
                                            src={product.uploadFileNames[1]?.file || "/product.png"}
                                            alt=""
                                            fill
                                            sizes="25vw"
                                            className="absolute object-cover rounded-md"
                                        />
                                    </>
                                )

                            }

                        </div>
                        <div className="flex justify-between">
                        <span
                            className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{product.pname}</span>
                            <span className="font-semibold">{product.price?.toLocaleString()} 원</span>
                        </div>
                        {product.pdesc && (
                            <div
                                className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap"
                                dangerouslySetInnerHTML={{__html: product.pdesc}}
                            ></div>
                        )}
                        <button
                            disabled={product.salesStatus != SalesStatus.ONSALE}
                            className="rounded-2xl ring-1 ring-ecom text-ecom w-max py-2 px-4 text-xs hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
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
                </Link>))
            }
        </div>
    );

};

export default MainProductList;