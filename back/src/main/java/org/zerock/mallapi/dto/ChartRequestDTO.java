package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartRequestDTO {

  private String startDate;

  private String endDate;

  private String sellerEmail;

  private String filter; // day, week, month, year String -> type으로 나중에 바꿔

}
