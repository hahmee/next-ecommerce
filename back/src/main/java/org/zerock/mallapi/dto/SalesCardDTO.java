package org.zerock.mallapi.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@Getter
public class SalesCardDTO {

  private List<Object[]> currentSales; // 현재 기간의 판매 데이터
  private List<Object[]> comparedSales; // 비교 기간의 판매 데이터


}
