"use client";
import React, {KeyboardEvent, useEffect, useState} from "react";
import { ChromePicker } from "react-color";
import {useTagStore} from "@/store/tagStore";
import {ColorTag} from "@/interface/ColorTag";

interface DropdownProps {
    label: string;
    defaultOption: string;
    originalData: ColorTag[] | undefined;
}

const TagSelect: React.FC<DropdownProps> = ({label, defaultOption, originalData}) => {
    const {tags, addTag, removeTag, setTagColor, clear} = useTagStore();
    const [inputValue, setInputValue] = useState('');
    const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (originalData && originalData.length > 0) {
            originalData.forEach((tag) => addTag(tag));
        }
        return () => clear();
    }, [originalData, addTag]);

    // Handle tag addition on Enter or Comma key press
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (inputValue.trim()) {
                const newTag = {text: inputValue.trim(), color: '#000000'}; // Default color is black
                addTag(newTag);
                setInputValue('');
                setSelectedTagIndex(tags.length); // Select the new tag for color picker
                setShowColorPicker(true);
            }
        }
    };

    // Handle color change for the selected tag
    const handleColorChange = (color: any) => {
        if (selectedTagIndex !== null) {
            setTagColor(selectedTagIndex, color.hex);
            setSelectedColor(color.hex);
        }
    };

    // Handle closing the color picker
    const closeColorPicker = () => {
        setShowColorPicker(false);
        setSelectedTagIndex(null);
    };

    return (
        <div className="relative z-50">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                {label} <span className="text-meta-1">*</span>
            </label>
            <div>
                <input
                    type="text"
                    placeholder={defaultOption}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowColorPicker(false);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />

                {/* Display the tags with colors */}
                <div className="flex flex-wrap space-x-2 mt-2">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full py-1 px-3"
                        >
              <span
                  className="w-4 h-4 rounded-full"
                  style={{backgroundColor: tag.color}}
              ></span>
                            <span>{tag.text}</span>
                            <span
                                onClick={() => removeTag(index)}
                                className="cursor-pointer text-blue-500 ml-2"
                            >
                x
              </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Picker */}
            {showColorPicker && selectedTagIndex !== null && (
                <div className="relative inline-block z-50">
                    <div className="absolute top-0 left-0 bg-white p-4 shadow-lg rounded-lg">
                        <ChromePicker color={selectedColor} onChange={handleColorChange}/>
                        <div className="flex justify-between mt-2">
                            <button
                                onClick={closeColorPicker}
                                className="bg-gray-300 text-gray-700 py-1 px-4 rounded-lg hover:bg-gray-400"
                            >
                                닫기
                            </button>
                            <button
                                onClick={closeColorPicker}
                                className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600"
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagSelect;
