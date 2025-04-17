package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerock.mallapi.domain.ChartContext;
import org.zerock.mallapi.domain.ChartFilter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopCustomerRequestDTO {

  private String startDate;

  private String endDate;

  private String sellerEmail;

}
