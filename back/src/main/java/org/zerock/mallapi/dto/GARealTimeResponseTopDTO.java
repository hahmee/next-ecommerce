package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GARealTimeResponseTopDTO {


  private List<SessionDTO<String>> activeVisitors;

  private SessionChartDTO activeVisitChart;

  private List<SessionDTO<String>> events;



}
