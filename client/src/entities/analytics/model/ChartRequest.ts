import { ChartContext } from '@/entities/analytics';
import { ChartFilter } from '@/entities/analytics';

export interface ChartRequest {
  startDate: string;
  endDate: string;
  filter: ChartFilter;
  comparedStartDate: string;
  comparedEndDate: string;
  context: ChartContext;
}
