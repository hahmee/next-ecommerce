export interface GAResponse {
  sessions: string;
  uniqueVisitors: string;
  avgSessionDuration: string;
  sessionsCompared: string;
  uniqueVisitorsCompared: string;
  avgSessionDurationCompared: string;

  topPages: Array<SessionDTO>;
  topSources: Array<SessionDTO>;

  sessionChart: SessionChart;
  devices: Array<SessionDTO>;
  visitors: Array<SessionDTO>;


}

export interface SessionDTO {
  key: string;
  value: number;
}

export interface SessionChart {
  xaxis: Array<string>;
  data: Array<number>;
}