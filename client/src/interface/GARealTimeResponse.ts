import {SessionChart, SessionDTO} from "@/interface/GAResponse";

export interface GARealTimeResponse {
  recentVisitors: Array<SessionDTO<number>>;
  activeVisitors: Array<SessionDTO<number>>;
  activeVisitChart: SessionChart;
  pageRoutes: Array<SessionDTO<Array<SessionDTO<number>>>>;

}
