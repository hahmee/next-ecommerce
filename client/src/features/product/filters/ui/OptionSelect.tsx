// src/features/product/filters/ui/OptionSelect.tsx



'use client';

import { ColorTag } from '@/shared/model/ColorTag';

interface Props {
  colorList: Array<ColorTag>;
  sizeList: Array<string>;
  size: string;
  setSize: (value: string) => void;
  color: ColorTag;
  setColor: (value: ColorTag) => void;
}
const OptionSelect = ({ colorList, sizeList, size, setSize, color, setColor }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* COLOR */}
        <h4 className="font-medium">Choose a color: {color?.text}</h4>
        <ul className="flex items-center gap-3">
          {colorList.map((value, index) => {
            return (
              <li
                key={index}
                onClick={() => setColor(value)}
                className="w-8 h-8 rounded-full ring-gray-300 cursor-pointer relative"
                style={{ backgroundColor: value.color }}
              >
                {value.id === color.id && (
                  <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </li>
            );
          })}
        </ul>

        {/* SIZE */}
        <h4 className="font-medium">Choose a size: {size}</h4>
        <ul className="flex items-center gap-3">
          {sizeList.map((value, index) => (
            <li
              key={index}
              onClick={() => setSize(value)}
              className={`ring-1 ring-ecom rounded-md py-1 px-4 text-sm cursor-pointer ${value === size ? 'text-white bg-ecom' : 'text-ecom'}`}
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptionSelect;
