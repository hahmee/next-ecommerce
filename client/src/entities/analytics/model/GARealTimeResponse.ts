// src/entities/analytics/model/GARealTimeResponse.ts

﻿// src/entities/analytics/model/GARealTimeResponse.ts

import { SessionChart, SessionDTO } from '@/entities/analytics/model/GAResponse';

export interface GARealTimeResponse {
  recentVisitors: Array<SessionDTO<number>>;
  activeVisitors: Array<SessionDTO<number>>;
  activeVisitChart: SessionChart;
  events: Array<SessionDTO<number>>;
  devices: Array<SessionDTO<number>>;
}

export interface GARealTimeResponseTop {
  activeVisitors: Array<SessionDTO<number>>;
  events: Array<SessionDTO<number>>;
  activeVisitChart: SessionChart;
}

export interface GARealTimeResponseBottom {
  recentVisitors: Array<SessionDTO<number>>;
  devices: Array<SessionDTO<number>>;
}
