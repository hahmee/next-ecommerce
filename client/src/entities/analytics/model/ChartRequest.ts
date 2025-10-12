import { ChartContext } from '@/entities/analytics/model/chartContext';
import { ChartFilter } from '@/entities/analytics/model/chartFilter';

export interface ChartRequest {
  startDate: string;
  endDate: string;
  filter: ChartFilter;
  comparedStartDate: string;
  comparedEndDate: string;
  context: ChartContext;
}
