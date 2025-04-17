package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopProductResponseDTO {

  private Long pno;

  private String pname;

  private String size;

  private ColorTagDTO color;

  private Long quantity;

  private Long total;

  private Long change;

  private Long grossSales;

  private String thumbnail;

}
