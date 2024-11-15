import {SessionDTO} from "@/interface/GAResponse";

export interface GARealTimeResponse {
  recentVisitors: Array<SessionDTO>;
  activeVisitors: Array<SessionDTO>;



}
