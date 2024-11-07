"use client";
import React, { KeyboardEvent, useEffect, useState, useRef } from "react";
import { useTagStore } from "@/store/tagStore";
import { ColorTag } from "@/interface/ColorTag";
import { HexColorPicker } from "react-colorful";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import ClickOutside from "@/components/ClickOutside";

interface DropdownProps {
    label: string;
    defaultOption: string;
    originalData: ColorTag[] | undefined;
}

const TagSelect: React.FC<DropdownProps> = ({ label, defaultOption, originalData }) => {
    const { tags, addTag, removeTag, setTagColor, clear } = useTagStore();
    const [inputValue, setInputValue] = useState("");
    const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
    const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (originalData && originalData.length > 0) {
            originalData.forEach((tag) => addTag(tag));
        }
        return () => clear();
    }, [originalData, addTag]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (inputValue.trim()) {
                const newTag = { text: inputValue.trim(), color: selectedColor };
                addTag(newTag);
                setInputValue("");
                setSelectedTagIndex(tags.length);
                setShowColorPicker(true);
            }
        }
    };

    const handleColorChange = (color: string) => {
        if (selectedTagIndex !== null) {
            setTagColor(selectedTagIndex, color);
            setSelectedColor(color);
        }
    };

    const openColorPicker = (index: number) => {
        const element = tagRefs.current[index];
        if (element) {
            const rect = element.getBoundingClientRect();
            setPickerPosition({
                top: rect.top + window.scrollY + rect.height + 8,  // 태그 바로 아래
                left: rect.left + window.scrollX,  // 태그의 왼쪽 위치
            });
        }
        setSelectedTagIndex(index);
        setSelectedColor(tags[index].color);
        setShowColorPicker(true);
    };

    const closeColorPicker = () => {
        setShowColorPicker(false);
        setSelectedTagIndex(null);
    };

    const clickColorPicker = () => {
        setShowColorPicker(false);
        setSelectedTagIndex(null);
    };

    return (
        <div className="relative z-40">
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

                <div className="text-gray-500 font-light text-sm mt-2">
                    옵션을 입력할 때마다 Enter 키를 클릭하거나 쉼표를 추가하세요.
                </div>

                {/* 태그와 색상 표시 */}
                <div className="flex flex-wrap mt-2 relative">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                tagRefs.current[index] = el;
                            }}
                            className="flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full py-1 px-3 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                openColorPicker(index);
                            }}
                        >
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{backgroundColor: tag.color}}
                            ></span>
                            <span>{tag.text}</span>
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTag(index);
                                }}
                                className="cursor-pointer text-blue-500 ml-2"
                            >
                                x
                            </span>
                        </div>
                    ))}
                </div>
            </div>


            {showColorPicker && (
                <ClickOutside onClick={() => setShowColorPicker(false)}>
                    <div
                        className="absolute mt-2 bg-white rounded-lg shadow-lg"
                        style={{
                            top: pickerPosition.top,
                            left: pickerPosition.left,
                        }}
                    >
                        <HexColorPicker color={selectedColor} onChange={handleColorChange}/>
                        <div className="py-3 px-3 flex w-full items-center justify-end gap-1">
                            <button onClick={closeColorPicker}>
                                <XCircleIcon className="h-8 w-8 text-blue-500"/>
                            </button>
                            <button onClick={clickColorPicker}>
                                <CheckCircleIcon className="h-8 w-8 text-blue-500"/>
                            </button>
                        </div>
                    </div>
                </ClickOutside>
            )}
        </div>
    );
};

export default TagSelect;
