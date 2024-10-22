package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoogleAnalyticsResponseDTO {

  private String sessions;

  private String uniqueVisitors;

  private String avgSessionDuration;

  private String sessionsCompared;

  private String uniqueVisitorsCompared;

  private String avgSessionDurationCompared;
}
