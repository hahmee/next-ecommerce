// src/entities/order/model/PageParam.ts

export interface PageParam {
  page?: number;
  size?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}
