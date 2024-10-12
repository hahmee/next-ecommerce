import Image from "next/image";
import React, {useState} from "react";
import {Product} from "@/interface/Product";
import {StarIcon} from "@heroicons/react/20/solid";
import Link from "next/link";
import {useCartStore} from "@/store/cartStore";
import {CartItemList} from "@/interface/CartItemList";
import {CartItem} from "@/interface/CartItem";
import {getCookie} from "cookies-next";
import {ColorTag} from "@/interface/ColorTag";
import {ShoppingCartIcon} from "@heroicons/react/24/outline";

type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const {cart, changeCart, isLoading, changeOpen} = useCartStore();
    // const [isAddedToCart, setIsAddedToCart] = useState(false); // 아이콘 상태 관리
    const [color, setColor] = useState<ColorTag>(product.colorList[0]);
    const memberInfo = getCookie('member');
    // const member = JSON.parse(memberInfo ? memberInfo : "");
    const member = memberInfo ? JSON.parse(memberInfo) : null;

    const handleClickAddCart = (pno:number,options: { color: ColorTag, size: string; }) => {
        changeOpen(true);
        const result = cart.filter((item: CartItemList) => item.size === options.size && item.color.id === options.color.id);
        //해당하는 cino 의 개수를 바꿔야함
            if (result && result.length > 0) { // 담겨있었음
                const cartItemChange: CartItem = {
                    email: member.email,
                    pno: pno,
                    qty: result[0].qty + 1,
                    color: options.color,
                    size: options.size,
                };
                changeCart(cartItemChange); // 수량만 추가
            }

            else { //아무것도 안담겨있었음
                const cartItem: CartItem = {
                    email: member.email,
                    pno: pno,
                    qty: 1,
                    color: options.color,
                    size: options.size,
                };
                changeCart(cartItem); //새로 담기
            }

            //스낵바 "장바구니 담겼습니다."



    }
    return (
        <Link href={`/product/${product.pno}`}>
            <div className="group relative transition-shadow duration-300">
                <div className="w-full overflow-hidden bg-gray-200 h-80 rounded-2xl">
                    <Image
                        src={
                            product.uploadFileNames && product.uploadFileNames.length > 0
                                ? product.uploadFileNames[0]?.file
                                : "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800"
                        }
                        width={500}
                        height={500}
                        className="object-cover w-full h-full bg-neutral-100 transition-transform duration-300 transform group-hover:scale-125"
                        alt={product.pname}
                    />

                    <div className="absolute top-4 right-4">
                        <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100" onClick={(e) => {
                            e.preventDefault(); // 페이지 이동 방지
                            e.stopPropagation();// 부모로의 이벤트 전파 방지
                            handleClickAddCart(product.pno, {color: color, size: product.sizeList[0]});
                        }}>
                            <ShoppingCartIcon className="h-6 w-6 group-open:hidden" />
                        </button>
                    </div>

                    <div
                        className="absolute bottom-42.5 flex justify-center items-center w-full flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        {/*사이즈 버튼 */}
                        {
                            product.sizeList.map((size, index) => (
                                <button key={index}
                                        className="content-center items-center justify-center flex w-11 h-11 font-bold text-sm bg-white rounded-xl shadow-2xl hover:bg-black2 hover:text-white"
                                        onClick={(e) => {
                                            e.preventDefault(); // 페이지 이동 방지
                                            e.stopPropagation();// 부모로의 이벤트 전파 방지
                                            handleClickAddCart(product.pno, {color: color, size: size});
                                        }}
                                >
                                    {size}
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="mt-4 px-4 pb-4">

                    <div className="flex mb-4.5" onClick={(e)=>{
                        e.preventDefault(); // 페이지 이동 방지
                        e.stopPropagation();// 부모로의 이벤트 전파 방지
                    }}>
                        {
                            product.colorList.map((value) => (
                                <div key={value.id}
                                    onClick={() => setColor(value)}
                                    className="w-5 h-5 rounded-full ring-gray-300 cursor-pointer relative mr-2"
                                    style={{backgroundColor: value.color}}>
                                    {
                                        value.id === color.id &&
                                        <div className="absolute w-6 h-6 rounded-full ring-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                    }
                                </div>
                            ))
                        }
                    </div>

                    <h3 className="text-base font-semibold text-gray-900">{product.pname}</h3>
                    <p className="mt-1 text-sm text-gray-500">다른설명</p>
                    <div className="flex justify-between items-center mt-2">
                        <div className="px-1.5 py-0.5 border-2 border-green-500 bg-white rounded-lg">
                            <p className="text-base text-green-500">${product.price}</p>
                        </div>
                        <div className="flex items-center">
                        <span className="text-yellow-500">
                            <StarIcon className="h-6 w-6 group-open:hidden"/>
                        </span>
                            <span className="ml-1 text-sm text-gray-500">{product.averageRating ? product.averageRating : "평점없음"} ({product.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );

};

export default ProductCard;
