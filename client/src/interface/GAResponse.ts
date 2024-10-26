export interface GAResponse {
  sessions: string;
  uniqueVisitors: string;
  avgSessionDuration: string;
  sessionsCompared: string; // 숫자 or '-'
  uniqueVisitorsCompared: string;
  avgSessionDurationCompared: string;

  topPages: Array<SessionDTO>;
  topSources: Array<SessionDTO>;

  sessionChart: SessionChart;
  devices: Array<SessionDTO>;
  visitors: Array<SessionDTO>;
  countries: Array<CountryChartDTO>;


}

export interface SessionDTO {
  key: string;
  value: number;
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