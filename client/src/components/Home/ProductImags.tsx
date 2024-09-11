"use client";

import Image from "next/image";
import { useState } from "react";
import {FileDTO} from "@/interface/FileDTO";


const ProductImages = ({ items }: { items: Array<FileDTO<string>> }) => {
    const [index, setIndex] = useState(0);
    console.log('items', items);

    return (

        <div className="">
            <div className="h-[500px] relative">
                <Image
                    src={items[index].file}
                    alt=""
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
                        <Image
                            src={item.file}
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
