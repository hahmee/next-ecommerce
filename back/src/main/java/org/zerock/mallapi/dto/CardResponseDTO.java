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
public class CardResponseDTO<T> {

  private String startDate;

  private String endDate;

  private Long totalSales;  // 전체 매출

  private Long totalOrders; // 전체 주문

  private Double avgOrders;// 평균 주문 값

  private Long totalSalesCompared;

  private Long totalOrdersCompared;

  private Double avgOrdersCompared;

}
