import { ChartFilter } from '@/entities/analytics/model/chartFilter';

export interface GARequest {
  startDate: string;
  endDate: string;
  comparedStartDate: string;
  comparedEndDate: string;
  filter: ChartFilter;
}
