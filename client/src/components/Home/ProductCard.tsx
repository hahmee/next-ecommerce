import Image from "next/image";
import React from "react";
import {Product} from "@/interface/Product";

type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="group relative border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            <div
                className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75">
                {
                    (product.uploadFileNames && product.uploadFileNames.length > 0) &&
                    <Image
                        src={product.uploadFileNames[0]?.file}
                        width={500}
                        height={500}
                        style={{objectFit: "contain", height: "100%"}}
                        alt="Product"
                    />
                }
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <a href={`/product/${product.pno}`}>
                            <span aria-hidden="true" className="absolute inset-0"/>
                            {product.pname}
                        </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.pdesc}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
