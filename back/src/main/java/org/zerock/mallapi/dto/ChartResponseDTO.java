package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChartResponseDTO {

  private String startDate;

  private String endDate;

  private String filter;  //day, week, ...

//  private Long totalSales;  // 전체 매출

//  private Long totalOrders; // 전체 주문

//  private Double avgOrderSale;// 평균 주문 값

  private List<String> xaxis; //가로축

  private List<SeriesDTO> series; //값

}
