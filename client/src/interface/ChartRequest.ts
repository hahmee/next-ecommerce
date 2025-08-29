import { ChartFilter } from '@/types/chartFilter';
import { ChartContext } from '@/types/chartContext';

export interface ChartRequest {
  startDate: string;
  endDate: string;
  filter: ChartFilter;
  comparedStartDate: string;
  comparedEndDate: string;
  context: ChartContext;
}
