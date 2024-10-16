package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.ChartRequestDTO;
import org.zerock.mallapi.dto.ChartResponseDTO;
import org.zerock.mallapi.dto.SeriesDTO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class DashboardServiceImpl implements DashboardService{


  private final OrderService orderService;


  @Override
  public ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO) {

    List<Object[]> results = orderService.getSalesOverview(chartRequestDTO);

    List<String> xaxisList = new ArrayList<>();

    List<Long> seriesData = new ArrayList<>();

    List<Long> seriesData2 = new ArrayList<>();

    List<SeriesDTO> series = new ArrayList<>();


    String seriesName = "Total Sales";
    String seriesName2 = "Total Revenue";

    log.info("orders.... " + results);

    for (Object[] result : results) {
      java.sql.Date sqlDate = (java.sql.Date) result[0];
      LocalDate date = sqlDate.toLocalDate(); // LocalDate로 변환

      Long totalSales = (Long) result[1];  // 총 매출

      Long totalRevenue = (Long) result[2];  // 총 레베뉴

      xaxisList.add(date.toString());
      seriesData.add(totalSales);
      seriesData2.add(totalRevenue);

    }


    SeriesDTO seriesDTO = SeriesDTO.builder()
            .name(seriesName)
            .data(seriesData)
            .build();

    SeriesDTO seriesDTO2 = SeriesDTO.builder()
            .name(seriesName2)
            .data(seriesData2)
            .build();

    series.add(seriesDTO);
    series.add(seriesDTO2);

    log.info("seriesData.... " + seriesDTO);




    ChartResponseDTO chartResponseDTO = ChartResponseDTO.builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .filter("day")
            .xaxis(xaxisList)
            .series(series)
            .build();




    return chartResponseDTO;
  }


}
