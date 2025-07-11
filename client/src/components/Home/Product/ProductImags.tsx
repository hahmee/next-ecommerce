"use client";

import {useState} from "react";
import {FileDTO} from "@/interface/FileDTO";
import FallbackImage from "@/components/Common/FallbackImage";


const ProductImages = ({ items }: { items: Array<FileDTO<string>> }) => {
  const [index, setIndex] = useState(0);
  const fallbackSrc = "/images/mall/product.png";

  return (
    <div className="">
      <div className="h-[500px] relative">
        <FallbackImage
          key={items[index]?.file}
          src={items[index]?.file}
          fallbackSrc={fallbackSrc}
          alt="Main image"
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item, i) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            key={i}
            onClick={() => setIndex(i)}
          >
            <FallbackImage
              src={item.file}
              fallbackSrc={fallbackSrc}
              alt=""
              fill
              sizes="30vw"
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
