// src/features/product/manage/ui/ImageUploadForm.tsx

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDropzone } from 'react-dropzone';

import ImagePreview from '@/features/product/manage/ui/ImagePreview';
import { useProductImageStore } from '@/shared/store/productImageStore';

export interface ImageType {
  dataUrl: string; // blob or aws full path
  uploadKey?: string;
  file?: File;
  id: number;
  size?: number;
}

const ImageUploadForm = () => {
  const productImageStore = useProductImageStore();
  const [images, setImages] = useState<Array<ImageType>>([]);
  const [hoveredImg, setHoveredImg] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      const timestamp = Date.now();
      const newImages = acceptedFiles.map((file, index) => ({
        dataUrl: URL.createObjectURL(file),
        file,
        id: timestamp + index,
        size: file.size,
      }));
      setImages((prev) => [...prev, ...newImages]);
    },
  });

  const deleteImage = useCallback((dataUrl: string) => {
    setImages((prev) => prev.filter((img) => img.dataUrl !== dataUrl));
  }, []);

  const handleMouseOver = (image: string) => setHoveredImg(image);
  const handleMouseOut = () => setHoveredImg('');

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragged);
      return updated;
    });
  }, []);

  // 처음 한 번만 store에서 데이터를 받아와서 세팅
  useEffect(() => {
    if (!initialized && productImageStore.files.length > 0) {
      setImages(
        productImageStore.files.map((file, idx) => ({
          ...file,
          id: Date.now() + idx,
        })),
      );
      setInitialized(true);
    }
  }, [initialized, productImageStore.files]);

  useEffect(() => {
    productImageStore.setFiles(images);
  }, [images]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.file) URL.revokeObjectURL(image.dataUrl);
      });
      productImageStore.clear();
    };
  }, []);

  return (
    <div className="flex flex-col gap-7">
      {/* 상단 영역 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-shrink-0">
          <DndProvider backend={HTML5Backend}>
            {images[0] && (
              <ImagePreview
                key={images[0].id}
                moveImage={moveImage}
                id={images[0].id}
                index={0}
                image={images[0].dataUrl}
                deleteImage={deleteImage}
                hoveredImg={hoveredImg}
                handleMouseOver={handleMouseOver}
                handleMouseOut={handleMouseOut}
              />
            )}
          </DndProvider>
        </div>

        {/* 썸네일 */}
        <div className="flex flex-wrap gap-4">
          <DndProvider backend={HTML5Backend}>
            {images.slice(1).map((image, idx) => (
              <div key={image.id}>
                <ImagePreview
                  moveImage={moveImage}
                  id={image.id}
                  index={idx + 1}
                  image={image.dataUrl}
                  deleteImage={deleteImage}
                  hoveredImg={hoveredImg}
                  handleMouseOver={handleMouseOver}
                  handleMouseOut={handleMouseOut}
                />
              </div>
            ))}
          </DndProvider>
        </div>
      </div>

      {/* 파일 업로드 섹션 */}
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} data-testid="file-input" />
          <div className="flex flex-col items-center justify-center w-full h-64 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageUploadForm;
