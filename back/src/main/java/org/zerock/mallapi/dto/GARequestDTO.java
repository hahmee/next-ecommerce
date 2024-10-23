package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GARequestDTO {

  private String startDate;

  private String endDate;

  private String sellerEmail;

  private String comparedStartDate;

  private String comparedEndDate;

}
