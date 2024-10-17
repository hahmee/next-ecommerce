package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.ChartFilter;
import org.zerock.mallapi.dto.ChartRequestDTO;
import org.zerock.mallapi.dto.ChartResponseDTO;
import org.zerock.mallapi.dto.SeriesDTO;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
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

    ChartFilter filter = chartRequestDTO.getFilter();

    List<Object[]> results = orderService.getSalesOverview(chartRequestDTO);

    List<String> xaxisList = new ArrayList<>();

    String salesSeriesName = "Total Sales";

    List<Long> salesSeriesData = new ArrayList<>();

    String revenueSeriesName = "Total Revenue";

    List<Long> revenueSeriesData = new ArrayList<>();

    List<SeriesDTO> series = new ArrayList<>();


    log.info("orders.... " + results);

    if (filter != null) {
      switch (filter) {
        case DAY:
          for (Object[] result : results) {
            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate(); // LocalDate로 변환

            Long totalSales = (Long) result[1];  // 총 매출

            Long totalRevenue = (Long) result[2];  // 총 레베뉴

            xaxisList.add(date.toString());
            salesSeriesData.add(totalSales);
            revenueSeriesData.add(totalRevenue);
          }

          break;

        case WEEK:

          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR
            Integer month = (Integer) result[1]; // MONTH
            Integer yearWeek= (Integer) result[2]; // YEARWEEK
            String weekString = result[2].toString().substring(4);
            Integer week = Integer.parseInt(weekString); // 문자열을 정수로 변환

            LocalDate weekStartDate = getWeekStartDate(year, week);

            log.info("dddd startDateOfWeek " + year);
            log.info("dddd month " + month);
            log.info("dddd week " + yearWeek);
            log.info("dddd weekStartDate " + weekStartDate);

            LocalDate date =  weekStartDate; // LocalDate로 변환

            Long totalSales = (Long) result[3];  // 총 매출

            Long totalRevenue = (Long) result[4];  // 총 레베뉴

            xaxisList.add(date.toString());
            salesSeriesData.add(totalSales);
            revenueSeriesData.add(totalRevenue);
          }
          break;

        case MONTH:
          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR
            Integer month = (Integer) result[1]; // month

            String date = String.format("%d-%02d", year, month);

            Long totalSales = (Long) result[2];  // 총 매출

            Long totalRevenue = (Long) result[3];  // 총 레베뉴

            xaxisList.add(date);
            salesSeriesData.add(totalSales);
            revenueSeriesData.add(totalRevenue);
          }

          break;


        case YEAR:
          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR

            String date = String.format("%d", year);

            Long totalSales = (Long) result[1];  // 총 매출

            Long totalRevenue = (Long) result[2];  // 총 레베뉴

            xaxisList.add(date);
            salesSeriesData.add(totalSales);
            revenueSeriesData.add(totalRevenue);
          }
          break;

        default:
          break;

      }
    }


    SeriesDTO salesSeriesDTO = SeriesDTO.builder()
            .name(salesSeriesName)
            .data(salesSeriesData)
            .build();

    SeriesDTO revenueSeriesDTO = SeriesDTO.builder()
            .name(revenueSeriesName)
            .data(revenueSeriesData)
            .build();

    series.add(salesSeriesDTO);
    series.add(revenueSeriesDTO);

    log.info("seriesData.... " + salesSeriesDTO);

    ChartResponseDTO chartResponseDTO = ChartResponseDTO.builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .filter(ChartFilter.DAY)
            .xaxis(xaxisList)
            .series(series)
            .build();




    return chartResponseDTO;
  }

  @Override
  public ChartResponseDTO getOrderList(ChartRequestDTO chartRequestDTO) {


    ChartFilter filter = chartRequestDTO.getFilter();

    List<Object[]> results = orderService.getOrderOverview(chartRequestDTO);

    List<String> xaxisList = new ArrayList<>();

    String salesSeriesName = "Total Orders";

    List<Long> salesSeriesData = new ArrayList<>();

    List<SeriesDTO> series = new ArrayList<>();


    log.info("orders.... " + results);

    if (filter != null) {
      switch (filter) {
        case DAY:
          for (Object[] result : results) {

            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate(); // LocalDate로 변환

            Long totalOrders = (Long) result[1];  // Total Orders

            log.info("totalOrders....." + totalOrders);
            xaxisList.add(date.toString());
            salesSeriesData.add(totalOrders);
          }

          break;

        case WEEK:

          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR
            Integer month = (Integer) result[1]; // month
            Integer yearWeek= (Integer) result[2]; // YEARWEEK
            String weekString = result[2].toString().substring(4);
            Integer week = Integer.parseInt(weekString); // 문자열을 정수로 변환

            LocalDate weekStartDate = getWeekStartDate(year, week);

            log.info("dddd startDateOfWeek " + year);
            log.info("dddd month " + month);
            log.info("dddd week " + week);
            log.info("dddd weekStartDate " + weekStartDate);

            LocalDate date =  weekStartDate; // LocalDate로 변환

            Long totalOrders = (Long) result[3];  // 총 매출

            xaxisList.add(date.toString());
            salesSeriesData.add(totalOrders);
          }
          break;

        case MONTH:
          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR
            Integer month = (Integer) result[1]; // month

            String date = String.format("%d-%02d", year, month);

            Long totalOrders = (Long) result[2];  // 총 매출

            xaxisList.add(date);
            salesSeriesData.add(totalOrders);
          }

          break;


        case YEAR:
          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR

            String date = String.format("%d", year);

            Long totalOrders = (Long) result[1];  // 총 매출

            xaxisList.add(date);
            salesSeriesData.add(totalOrders);
          }
          break;

        default:
          break;

      }
    }


    SeriesDTO salesSeriesDTO = SeriesDTO.builder()
            .name(salesSeriesName)
            .data(salesSeriesData)
            .build();


    series.add(salesSeriesDTO);

    log.info("seriesData.... " + salesSeriesDTO);

    ChartResponseDTO chartResponseDTO = ChartResponseDTO.builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .filter(ChartFilter.DAY)
            .xaxis(xaxisList)
            .series(series)
            .build();




    return chartResponseDTO;
  }

  private LocalDate getWeekStartDate(Integer year, Integer week) { //2024 41주차
    log.info("year....." + year);
    log.info("week......" + week); //41

    // 연도의 첫 번째 날을 가져옴
    LocalDate firstDayOfYear = LocalDate.of(year, 1, 1);

    log.info("firstDayOfYear......" + firstDayOfYear);

    // 한국 로케일에 맞춰 첫 번째 주의 시작일을 계산 (월요일로 설정)
    WeekFields weekFields = WeekFields.of(DayOfWeek.MONDAY, 1); // 월요일 시작, 첫 주는 1일 이상 포함해야 첫 번째 주로 계산
    LocalDate firstMonday = firstDayOfYear.with(weekFields.dayOfWeek(), 1); // 월요일로 맞춤

    log.info("firstMonday......" + firstMonday);

    // 해당 주의 시작일 계산 (주의 시작일 + (주 번호 - 1) 주)
    LocalDate weekStartDate = firstMonday.plusWeeks(week - 1);

    log.info("weekStartDate......" + weekStartDate);

    return weekStartDate;

  }

}
