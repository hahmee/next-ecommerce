'use client';

import { XCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { ColorTag } from '@/entities/common/model/ColorTag';
import { useTagStore } from '@/features/common/store/tagStore';
import ClickOutside from '@/widgets/common/ui/ClickOutside';

interface DropdownProps {
  label: string;
  defaultOption: string;
  originalData: ColorTag[] | undefined;
}

const ColorSelector: React.FC<DropdownProps> = ({ label, defaultOption, originalData }) => {
  const { tags, addTag, removeTag, setTagColor, clear } = useTagStore();
  const [inputValue, setInputValue] = useState('');
  const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (originalData && originalData.length > 0) {
      originalData.forEach((tag) => addTag(tag));
    }
    return () => clear();
  }, [originalData, addTag]);

  useEffect(() => {
    const updatePickerPosition = () => {
      if (showColorPicker && selectedTagIndex !== null) {
        const element = tagRefs.current[selectedTagIndex];
        if (element) {
          const rect = element.getBoundingClientRect();
          setPickerPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX, // 태그의 왼쪽 위치
          });
        }
      }
    };

    // 초기 위치 설정 및 리사이즈 이벤트 리스너 추가
    updatePickerPosition();
    window.addEventListener('resize', updatePickerPosition);

    return () => {
      window.removeEventListener('resize', updatePickerPosition);
    };
  }, [showColorPicker, selectedTagIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        const newTag = { text: inputValue.trim(), color: selectedColor };
        addTag(newTag);
        setInputValue('');
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
    <div className="relative">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label} <span className="text-meta-1">*</span>
      </label>
      <div>
        <input
          data-testid="color-input"
          type="text"
          placeholder={defaultOption}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowColorPicker(false);
          }}
          onBlur={() => setInputValue('')} // 포커스 해제 시 inputValue 초기화
          onKeyDown={handleKeyDown}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />

        <div className="text-gray-500 font-light text-sm mt-2 dark:text-white">
          옵션을 입력할 때마다 Enter 키를 클릭하거나 쉼표를 추가하세요.
        </div>

        {/* 태그와 색상 표시 */}
        <div className="flex flex-wrap mt-4 gap-2 relative" data-testid="color-add">
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
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
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

          {showColorPicker && (
            <ClickOutside onClick={() => setShowColorPicker(false)}>
              <div
                className={`z-99999 absolute mt-2 bg-white rounded-lg shadow-lg dark:bg-gray-500 left-${pickerPosition.left} bottom-0`}
              >
                <HexColorPicker
                  color={selectedColor}
                  onChange={handleColorChange}
                  style={{ width: '18.75rem' }}
                />
                <div className="py-3 px-3 flex w-full items-center justify-between gap-1">
                  <div className="text-sm text-blue-500 dark:text-white">{selectedColor}</div>
                  <div className="flex items-center">
                    <button onClick={closeColorPicker} data-testid="color-close">
                      <XCircleIcon className="h-8 w-8 text-blue-500 dark:text-white" />
                    </button>
                    <button onClick={clickColorPicker} data-testid="color-submit">
                      <CheckCircleIcon className="h-8 w-8 text-blue-500 dark:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </ClickOutside>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
