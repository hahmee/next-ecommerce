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
public class GAResponseDTO {

  private String sessions;

  private String uniqueVisitors;

  private String avgSessionDuration;

  private String sessionsCompared;

  private String uniqueVisitorsCompared;

  private String avgSessionDurationCompared;


  ///////////////////////////////////////////
  private List<SessionDTO<String>> topPages;

  private List<SessionDTO<String>> topSources;

  private SessionChartDTO sessionChart;

  private List<SessionDTO<String>> devices;

  private List<SessionDTO<String>> visitors;

  private List<CountryChartDTO> countries;

}
