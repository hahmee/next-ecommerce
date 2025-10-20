// src/entities/order/model/Paging.ts

export interface Paging {
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
  prev: boolean;
  next: boolean;
  pageNumList: [number];
}
