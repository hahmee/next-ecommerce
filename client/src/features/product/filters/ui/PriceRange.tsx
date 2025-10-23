// src/features/product/filters/ui/PriceRange.tsx

import React, { useState } from 'react';
import { Range } from 'react-range';

type PriceRangeProps = {
  min: number;
  max: number;
  onChange: (values: number[]) => void;
};

const PriceRange: React.FC<PriceRangeProps> = ({ min, max, onChange }) => {
  const [values, setValues] = useState([min, max]);

  const handleRangeChange = (newValues: number[]) => {
    setValues(newValues);
    onChange(newValues); // 부모 컴포넌트로 값 전달
  };

  return (
    <div>
      <Range
        step={1000}
        min={min}
        max={max}
        values={values}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1.5 bg-gray-200 rounded-full"
            style={{
              background: `linear-gradient(to right, #eeeeee ${((values[0] - min) / (max - min)) * 100}%, #FF6766 ${((values[0] - min) / (max - min)) * 100}%, #FF6766 ${((values[1] - min) / (max - min)) * 100}%, #eeeeee ${((values[1] - min) / (max - min)) * 100}%)`,
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-4 h-4 bg-white rounded-full shadow-lg border-2 border-ecom "
            key={props.key}
          />
        )}
      />
      <div className="flex justify-between mt-2">
        <div className="flex flex-col justify-between gap-2 mt-5">
          <div className="text-sm text-neutral-800">Min price</div>
          <div className="border-stroke rounded-3xl border py-2 w-28 flex justify-evenly items-center">
            <span>{values[0].toLocaleString()}</span>
            <span className="text-sm text-neutral-500">원</span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 mt-5">
          <div className="text-sm text-neutral-800">Max price</div>
          <div className="border-stroke rounded-3xl border py-2 w-28 flex justify-evenly items-center">
            <span>{values[1].toLocaleString()}</span>
            <span className="text-sm text-neutral-500">원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
