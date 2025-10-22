// src/features/product/manage/consts/presets.ts



import { SalesStatus } from '@/entities/product/consts/SalesStatus';
import { Size } from '@/shared/constants/size';
import { Option } from '@/shared/model/Option';

// 드롭다운/라디오 등 선택지 모음
export const sizeOptions: Array<Option<string>> = [
  { id: Size.XS, content: 'XS' },
  { id: Size.S, content: 'S' },
  { id: Size.M, content: 'M' },
  { id: Size.L, content: 'L' },
  { id: Size.XL, content: 'XL' },
  { id: Size.XXL, content: '2XL' },
  { id: Size.XXXL, content: '3XL' },
  { id: Size.FREE, content: 'FREE' },
];

export const salesOptions: Array<Option<SalesStatus>> = [
  { id: SalesStatus.ONSALE, content: '판매중' },
  { id: SalesStatus.SOLDOUT, content: '재고없음' },
  { id: SalesStatus.STOPSALE, content: '판매중지' },
];

// 폼 공용 상수(선택)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_COUNT = 10; // 필요 시 조정
