export interface GAResponse {
  sessions: string;
  uniqueVisitors: string;
  avgSessionDuration: string;
  sessionsCompared: string;
  uniqueVisitorsCompared: string;
  avgSessionDurationCompared: string;
  ////////////////
  topPages: Array<TopPageDTO>
}

export interface TopPageDTO {
  pagePath: string;
  pageSessions: string;
}