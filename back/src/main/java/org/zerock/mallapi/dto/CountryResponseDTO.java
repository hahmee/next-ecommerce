package org.zerock.mallapi.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CountryResponseDTO {
    private List<Double> latlng; // 위도와 경도를 담는 리스트

}
