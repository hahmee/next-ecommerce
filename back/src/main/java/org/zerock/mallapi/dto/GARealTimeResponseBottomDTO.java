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
public class GARealTimeResponseBottomDTO {

  private List<SessionDTO<String>> recentVisitors;

  private List<SessionDTO<String>> devices;


}
