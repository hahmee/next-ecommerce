package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.zerock.mallapi.domain.ChartFilter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GARequestDTO {

  private String startDate;

  private String endDate;

  private String sellerEmail;

  private String comparedStartDate;

  private String comparedEndDate;

  private ChartFilter filter;



}
