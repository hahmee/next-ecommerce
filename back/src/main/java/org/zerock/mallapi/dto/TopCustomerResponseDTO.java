package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerock.mallapi.domain.ChartFilter;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopCustomerResponseDTO {

  private String email;

  private Long orderCount;

  private Long payment; //가로축

}
