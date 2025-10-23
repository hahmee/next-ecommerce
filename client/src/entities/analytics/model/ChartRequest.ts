import { ChartContext } from '@/entities/analytics/consts/ChartContext';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';

export interface ChartRequest {
  startDate: string;
  endDate: string;
  filter: ChartFilter;
  comparedStartDate: string;
  comparedEndDate: string;
  context: ChartContext;
}
