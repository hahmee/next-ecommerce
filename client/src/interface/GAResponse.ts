export interface GAResponse {
  sessions: string;
  uniqueVisitors: string;
  avgSessionDuration: string;
  sessionsCompared: string; // 숫자 or '-'
  uniqueVisitorsCompared: string;
  avgSessionDurationCompared: string;

  topPages: Array<SessionDTO<number>>;
  topSources: Array<SessionDTO<number>>;

  sessionChart: SessionChart;
  devices: Array<SessionDTO<number>>;
  visitors: Array<SessionDTO<number>>;
  countries: Array<CountryChartDTO>;


}

export interface SessionDTO<T>{
  key: string;
  value: T;
}

export interface CountryChartDTO {
  key: string;
  value: number;
  latlng: Array<number>;
}
export interface SessionChart {
  xaxis: Array<string>;
  data: Array<number>;
}