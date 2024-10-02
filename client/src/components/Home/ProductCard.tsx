import Image from "next/image";
import React from "react";
import {Product} from "@/interface/Product";
import {ShoppingCartIcon} from "@heroicons/react/24/outline";
import {StarIcon} from "@heroicons/react/20/solid";
import Link from "next/link";

type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

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
                        <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                            <ShoppingCartIcon className="h-6 w-6 group-open:hidden"/>
                        </button>
                    </div>

                    <div className="absolute bottom-42.5 flex justify-center items-center w-full flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        {/*사이즈 버튼 */}
                        {
                            product.sizeList.map((size, index) => (
                                <button key={index} className="content-center items-center justify-center flex w-11 h-11 font-bold text-sm bg-white rounded-xl shadow-2xl hover:bg-black-2 hover:text-white">
                                    {size}
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="mt-4 px-4 pb-4">

                    <div className="flex mb-4.5">
                        {
                            product.colorList.map((color) => (
                                <button className="w-4.5 h-4.5 rounded-full mr-2" key={color.id}
                                        style={{backgroundColor: color.color}}></button>
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
                            <span className="ml-1 text-sm text-gray-500">4.4 (98 reviews)</span>
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );

};

export default ProductCard;
