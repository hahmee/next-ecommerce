import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';

export interface GARequest {
  startDate: string;
  endDate: string;
  comparedStartDate: string;
  comparedEndDate: string;
  filter: ChartFilter;
}
