import Image from "next/image";
import React from "react";
import {Product} from "@/interface/Product";
import {HeartIcon} from "@heroicons/react/24/outline";
import {StarIcon} from "@heroicons/react/20/solid";
import Link from "next/link";

type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    return (
        <Link href={`/product/${product.pno}`}>
            <div className="group relative transition-shadow duration-300">
                <div className="w-full overflow-hidden bg-gray-200 group-hover:opacity-75 h-80 rounded-2xl">
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
                        <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                            <HeartIcon className="h-6 w-6 group-open:hidden"/>
                        </button>
                    </div>
                </div>
                <div className="mt-4 px-4 pb-4">
                    <h3 className="text-base font-medium text-gray-900">{product.pname}</h3>
                    <p className="mt-1 text-sm text-gray-500">다른설명</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-lg font-semibold text-gray-900">${product.price}</p>
                        <div className="flex items-center">
                        <span className="text-yellow-500">
                            <StarIcon className="h-6 w-6 group-open:hidden"/>
                        </span>
                            <span className="ml-1 text-sm text-gray-500">4.4 (98 reviews)</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between px-4 mb-4">
                    {/* 색상 선택을 위한 버튼들 */}
                    <button className="w-8 h-8 rounded-full border border-gray-400 bg-blue-500"></button>
                    <button className="w-8 h-8 rounded-full border border-gray-400 bg-gray-600"></button>
                    <button className="w-8 h-8 rounded-full border border-gray-400 bg-black"></button>
                </div>
            </div>
        </Link>
    );

};

export default ProductCard;
