// src/entities/analytics/model/CardResponse.ts

export interface CardResponse {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  avgOrders: number;
  totalSalesCompared: number;
  totalOrdersCompared: number;
  avgOrdersCompared: number;
}
