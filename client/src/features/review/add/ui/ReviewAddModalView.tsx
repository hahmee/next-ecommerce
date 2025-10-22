// src/features/review/add/ui/ReviewAddModalView.tsx



'use client';

import { StarIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React, { useState } from 'react';

import type { Order } from '@/entities/order/model/types';

interface Props {
  order: Order;
  orderId: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { rating: number; content: string }) => void;
}

export function ReviewAddModalView({ order, orderId, isSubmitting, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [content, setContent] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || content.trim().length < 1) return;
    onSubmit({ rating, content: content.trim() });
  };

  // 별 인덱스는 1~5로 맞춰 비교를 단순화
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <XMarkIcon className="w-7 h-7 cursor-pointer" onClick={onClose} />
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">리뷰쓰기</h2>

        <form onSubmit={handleSave}>
          {/* 상품 요약 */}
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={order.productInfo.thumbnailUrl || '/images/mall/no_image.png'}
              alt="상품 대표이미지"
              width={500}
              height={500}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <p className="text-gray-600 text-sm">{order.productInfo.pname}</p>
              <p className="text-gray-500 text-xs">{order.productInfo.price.toLocaleString()} 원</p>
              <p className="text-gray-500 text-xs">{order.productInfo.qty} 개</p>
              <p className="text-gray-500 text-xs">{order.productInfo.size}</p>
              <p className="text-gray-500 text-xs">{order.productInfo.color.text}</p>
            </div>
          </div>

          {/* 별점 */}
          <div className="mb-6">
            <p className="font-medium">별점 평가</p>
            <div className="mt-2">
              <label className="text-gray-700 text-sm">별점</label>
              <div className="flex space-x-2">
                {stars.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${s}점`}
                  >
                    {(hover || rating) >= s ? (
                      <StarIcon className="w-9 h-9 text-ecom" />
                    ) : (
                      <StarIcon className="w-9 h-9 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">리뷰 작성</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-2 border rounded-md text-sm"
              placeholder="자세하고 솔직한 리뷰는 다른 고객에게 도움이 됩니다. (최소 10자 이상)"
              rows={4}
            />
          </div>

          {/* 액션 */}
          <div className="flex">
            <button
              className="w-full px-4 py-2 bg-ecom text-white rounded-md text-sm hover:bg-ecomHigh disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중…' : '완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
