import { ChartContext } from '@/types/chartContext';
import { ChartFilter } from '@/types/chartFilter';

export interface ChartRequest {
  startDate: string;
  endDate: string;
  filter: ChartFilter;
  comparedStartDate: string;
  comparedEndDate: string;
  context: ChartContext;
}
