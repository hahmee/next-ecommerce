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
public class CountryChartDTO {
  String key;
  String value;
  List<Double> latlng; // 위도와 경도를 담는 리스트
  String svg; // 국가 이미지
}
