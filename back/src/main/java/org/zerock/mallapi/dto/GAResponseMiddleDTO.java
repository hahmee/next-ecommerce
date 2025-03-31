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
public class GAResponseMiddleDTO {

  private List<SessionDTO<String>> topPages;

  private List<SessionDTO<String>> topSources;

  private List<SessionDTO<String>> devices;

  private List<SessionDTO<String>> visitors;

}
