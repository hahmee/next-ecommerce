"use client";

import {useState} from "react";
import {ColorTag} from "@/interface/ColorTag";

const OptionSelect = ({colorList, sizeList}:{colorList: Array<ColorTag> ; sizeList: Array<string>}) => {

    const [color, setColor] = useState<ColorTag>();
    const [size, setSize] = useState<string>();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                {/* COLOR */}
                <h4 className="font-medium">Choose a color: {color?.text}</h4>
                <ul className="flex items-center gap-3">
                    {
                        colorList.map((color, index) => {
                            return (
                                <li key={index}
                                    className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative"
                                    style={{backgroundColor: color.color}}>
                                    {
                                        index === 0 &&
                                        <div
                                            className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                    }
                                </li>);
                        })
                    }
                </ul>

                {/* SIZE */}
                <h4 className="font-medium">Choose a size:{size}</h4>
                <ul className="flex items-center gap-3">
                    {
                        sizeList.map((size, index) => <li key={index} className={`ring-1 ring-lama rounded-md py-1 px-4 text-sm cursor-pointer ${index ===0 ? 'text-white bg-lama' :'text-lama'} `}>{size}</li>)
                    }

                </ul>
            </div>
        </div>
    );
};

export default OptionSelect;
