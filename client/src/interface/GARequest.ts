import {ChartFilter} from "@/types/chartFilter";

export interface GARequest {
  startDate: string;
  endDate: string;
  sellerEmail: string;
  comparedStartDate: string;
  comparedEndDate: string;
  filter: ChartFilter;
}
