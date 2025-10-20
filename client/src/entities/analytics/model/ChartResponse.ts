// src/entities/analytics/model/ChartResponse.ts

export interface ChartResponse {
  startDate: string;
  endDate: string;
  filter: string;
  xaxis: Array<string>;
  series: Array<Series>;
}

interface Series {
  name: string;
  data: Array<number>;
}
