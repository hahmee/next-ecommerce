import {ChartFilter} from "@/types/chartFilter";

export interface ChartRequest {
  startDate: string;
  endDate: string;
  sellerEmail: string;
  filter: ChartFilter;
  comparedStartDate: string;
  comparedEndDate: string;
}
