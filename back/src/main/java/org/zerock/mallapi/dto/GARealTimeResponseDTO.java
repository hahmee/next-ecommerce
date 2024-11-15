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
public class GARealTimeResponseDTO {

  private List<SessionDTO> recentVisitors;

  private List<SessionDTO> activeVisitors;

  private SessionChartDTO activeVisitChart;


}
