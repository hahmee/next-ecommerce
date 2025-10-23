import { ChartFilter } from '@/entities/analytics';

export interface GARequest {
  startDate: string;
  endDate: string;
  comparedStartDate: string;
  comparedEndDate: string;
  filter: ChartFilter;
}
