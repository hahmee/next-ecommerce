// src/entities/analytics/model/GAResponse.ts

export interface GAResponseTop {
  // 상단 데이터
  sessions: string;
  uniqueVisitors: string;
  avgSessionDuration: string;
  sessionsCompared: string; // 숫자 or '-'
  uniqueVisitorsCompared: string;
  avgSessionDurationCompared: string;
  sessionChart: SessionChart;
}

export interface GAResponseMiddle {
  // 중간 데이터
  topPages: Array<SessionDTO<number>>;
  topSources: Array<SessionDTO<number>>;
  devices: Array<SessionDTO<number>>;
  visitors: Array<SessionDTO<number>>;
  countries: Array<CountryChartDTO>;
}

export interface GAResponseBottom {
  // 하단 데이터
  countries: Array<CountryChartDTO>;
}

// original
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

export interface SessionDTO<T> {
  key: string;
  value: T;
}

export interface CountryChartDTO {
  key: string;
  value: number;
  latlng: Array<number>;
  svg: string;
}
export interface SessionChart {
  xaxis: Array<string>;
  data: Array<number>;
}
