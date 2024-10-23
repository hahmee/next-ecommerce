package org.zerock.mallapi.service;

import com.google.analytics.data.v1beta.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.ChartFilter;
import org.zerock.mallapi.domain.ColorTag;
import org.zerock.mallapi.dto.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class DashboardServiceImpl implements DashboardService{

  @Autowired
  private Environment environment;

  private final OrderService orderService;

  private final PaymentService paymentService;

  @Override
  public CardResponseDTO getSalesCardList(ChartRequestDTO chartRequestDTO) {

    SalesCardDTO cardDTO = orderService.getOverviewCards(chartRequestDTO);

    log.info("cardDTO: {}", cardDTO);

    List<Object[]> currentSales = cardDTO.getCurrentSales();
    List<Object[]> comparedSales = cardDTO.getComparedSales();

    log.info("currentSales: {}", currentSales);
    log.info("comparedSales: {}", comparedSales); // []

    // 데이터가 없는 경우를 처리
    if (currentSales.isEmpty() && comparedSales.isEmpty()) {
      log.warn("No sales data available for the selected periods.");
      return null;
    }


    if (currentSales.isEmpty()) {
      log.warn("No current sales data available.");
      // 필요에 따라 기본값 설정
      Long currentTotalSales = 0L;
      Long currentTotalQty = 0L;
      Double currentAvgQty = 0.0;

      // 비교 기간의 집계 결과
      Long comparedTotalSales = (Long) comparedSales.get(0)[0];
      Long comparedTotalQty = (Long) comparedSales.get(0)[1];
      Double comparedAvgQty = (Double) comparedSales.get(0)[2];


      // 차이 계산
      Long salesDifferencePercentage = -100L; // 현재 매출이 없으므로 -100% 차이
      Long qtyDifferencePercentage = ((currentTotalQty - comparedTotalQty)/comparedTotalQty) * 100;
      Double avgQtyDifferencePercentage = ((currentAvgQty - comparedAvgQty) / comparedAvgQty) * 100;

      // 결과를 CardResponseDTO에 설정
      CardResponseDTO cardResponseDTO = CardResponseDTO.builder()
              .startDate(chartRequestDTO.getStartDate())
              .endDate(chartRequestDTO.getEndDate())
              .totalSales(currentTotalSales)
              .totalOrders(currentTotalQty)
              .avgOrders(currentAvgQty)
              .totalSalesCompared(salesDifferencePercentage)
              .totalOrdersCompared(qtyDifferencePercentage)
              .avgOrdersCompared(avgQtyDifferencePercentage)
              .build();

      return cardResponseDTO;
    }


    if (comparedSales.isEmpty()) {
      log.warn("No compared sales data available.");
      // 현재 기간의 집계 결과
      Long currentTotalSales = (Long) currentSales.get(0)[0];
      Long currentTotalQty = (Long) currentSales.get(0)[1];
      Double currentAvgQty = (Double) currentSales.get(0)[2];


      // 차이 계산
      Long salesDifferencePercentage = 100L; // 비교 데이터가 없으므로 100% 차이
      Long qtyDifferencePercentage = 100L; // 판매 수량도 100% 차이
      Double avgQtyDifferencePercentage = 100.0; // 평균 수량도 100% 차이



      // 결과를 CardResponseDTO에 설정
      // 결과를 CardResponseDTO에 설정
      CardResponseDTO cardResponseDTO = CardResponseDTO.builder()
              .startDate(chartRequestDTO.getStartDate())
              .endDate(chartRequestDTO.getEndDate())
              .totalSales(currentTotalSales)
              .totalOrders(currentTotalQty)
              .avgOrders(currentAvgQty)
              .totalSalesCompared(salesDifferencePercentage)
              .totalOrdersCompared(qtyDifferencePercentage)
              .avgOrdersCompared(avgQtyDifferencePercentage)
              .build();

      return cardResponseDTO;
    }

    // 현재 기간의 집계 결과
    Long currentTotalSales = (Long) currentSales.get(0)[0];
    Long currentTotalQty = (Long) currentSales.get(0)[1];
    Double currentAvgQty = (Double) currentSales.get(0)[2];

    // 비교 기간의 집계 결과
    Long comparedTotalSales = (Long) comparedSales.get(0)[0];
    Long comparedTotalQty = (Long) comparedSales.get(0)[1];
    Double comparedAvgQty = (Double) comparedSales.get(0)[2];

    log.info("currentTotalSales...." + currentTotalSales);
    log.info("currentTotalQty...." + currentTotalQty);
    log.info("currentAvgQty...." + currentAvgQty);
    log.info("comparedTotalSales...." + comparedTotalSales);
    log.info("comparedTotalQty...." + comparedTotalQty);
    log.info("comparedAvgQty...." + comparedAvgQty);

    // 차이 계산
    Long salesDifferencePercentage = ((currentTotalSales - comparedTotalSales) / comparedTotalSales) * 100;
    Long qtyDifferencePercentage = ((currentTotalQty - comparedTotalQty ) /comparedTotalQty) * 100;
    Double avgQtyDifferencePercentage = ((currentAvgQty - comparedAvgQty) / comparedAvgQty) * 100;

    log.info("qtyDifferencePercentage...." + qtyDifferencePercentage);

    // 결과를 CardResponseDTO에 설정
    CardResponseDTO cardResponseDTO = CardResponseDTO.builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .totalSales(currentTotalSales)
            .totalOrders(currentTotalQty)
            .avgOrders(currentAvgQty)
            .totalSalesCompared(salesDifferencePercentage)
            .totalOrdersCompared(qtyDifferencePercentage)
            .avgOrdersCompared(avgQtyDifferencePercentage)
            .build();

    return cardResponseDTO;
  }

  @Override
  public ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO) {

    ChartFilter filter = chartRequestDTO.getFilter();

    List<Object[]> results = orderService.getSalesOverview(chartRequestDTO);

    List<String> xaxisList = new ArrayList<>();

    String salesSeriesName = "Total Sales";

    List<Long> salesSeriesData = new ArrayList<>();

    String revenueSeriesName = "Total Revenue";

    List<Long> revenueSeriesData = new ArrayList<>();

    List<SeriesDTO<Long>> series = new ArrayList<>();


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


    SeriesDTO<Long> salesSeriesDTO = SeriesDTO.<Long>builder()
            .name(salesSeriesName)
            .data(salesSeriesData)
            .build();

    SeriesDTO<Long> revenueSeriesDTO = SeriesDTO.<Long>builder()
            .name(revenueSeriesName)
            .data(revenueSeriesData)
            .build();

    series.add(salesSeriesDTO);
    series.add(revenueSeriesDTO);

    log.info("seriesData.... " + salesSeriesDTO);

    ChartResponseDTO<Long> chartResponseDTO = ChartResponseDTO.<Long>builder()
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

    List<SeriesDTO<Long>> series = new ArrayList<>();


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


    SeriesDTO<Long> salesSeriesDTO = SeriesDTO.<Long>builder()
            .name(salesSeriesName)
            .data(salesSeriesData)
            .build();


    series.add(salesSeriesDTO);

    log.info("seriesData.... " + salesSeriesDTO);

    ChartResponseDTO<Long> chartResponseDTO = ChartResponseDTO.<Long>builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .filter(ChartFilter.DAY)
            .xaxis(xaxisList)
            .series(series)
            .build();



    return chartResponseDTO;
  }

  @Override
  public ChartResponseDTO getOrderAvgList(ChartRequestDTO chartRequestDTO) {


    ChartFilter filter = chartRequestDTO.getFilter();

    List<Object[]> results = orderService.getOrderAvgOverview(chartRequestDTO);

    List<String> xaxisList = new ArrayList<>();

    String salesSeriesName = "Avg Orders";

    List<Double> salesSeriesData = new ArrayList<>();

    List<SeriesDTO<Double>> series = new ArrayList<>();

    log.info("orders.... " + results);

    if (filter != null) {
      switch (filter) {
        case DAY:
          for (Object[] result : results) {

            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate(); // LocalDate로 변환

            Double avgOrders = (Double) result[1];  // Avg Orders

            log.info("avgOrders....." + avgOrders);
            xaxisList.add(date.toString());
            salesSeriesData.add(avgOrders);
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

            Double avgOrders = (Double) result[3];  // 총 매출

            xaxisList.add(date.toString());
            salesSeriesData.add(avgOrders);
          }
          break;

        case MONTH:
          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR
            Integer month = (Integer) result[1]; // month

            String date = String.format("%d-%02d", year, month);

            Double avgOrders = (Double) result[2];  // 총 매출

            xaxisList.add(date);
            salesSeriesData.add(avgOrders);
          }

          break;


        case YEAR:
          for (Object[] result : results) {
            Integer year = (Integer) result[0]; // YEAR

            String date = String.format("%d", year);

            Double avgOrders = (Double) result[1];  // 총 매출

            xaxisList.add(date);
            salesSeriesData.add(avgOrders);
          }
          break;

        default:
          break;

      }
    }


    SeriesDTO<Double> salesSeriesDTO = SeriesDTO.<Double>builder()
            .name(salesSeriesName)
            .data(salesSeriesData)
            .build();


    series.add(salesSeriesDTO);

    log.info("seriesData.... " + salesSeriesDTO);

    ChartResponseDTO<Double> chartResponseDTO = ChartResponseDTO.<Double>builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .filter(ChartFilter.DAY)
            .xaxis(xaxisList)
            .series(series)
            .build();



    return chartResponseDTO;

  }

  @Override
  public List<TopCustomerResponseDTO> getTopCustomerList(TopCustomerRequestDTO topCustomerRequestDTO) {

    //TOP 5
    List<Object[]> results = orderService.getTopCustomers(topCustomerRequestDTO);
    List<TopCustomerResponseDTO> topCustomerResponseDTOS = new ArrayList<>();

    for (Object[] result : results) {

      String email = (String) result[0]; // email
      Long count = (Long) result[1]; // count
      Long sum = (Long) result[2]; // sum

      TopCustomerResponseDTO topCustomerResponseDTO = TopCustomerResponseDTO.builder()
              .email(email)
              .orderCount(count)
              .payment(sum)
              .build();

      log.info("email.... " + email);
      log.info("count.... " + count);
      log.info("sum.... " + sum);

      topCustomerResponseDTOS.add(topCustomerResponseDTO);

    }

    return topCustomerResponseDTOS;
  }

  @Override
  public List<TopProductResponseDTO> getTopProductList(TopCustomerRequestDTO topCustomerRequestDTO) {

    //TOP 5
    List<Object[]> results = orderService.getTopProducts(topCustomerRequestDTO);


    List<TopProductResponseDTO> dtoList = results.stream().map(arr -> {

      Long pno = (Long) arr[0]; //pno
      String pname = (String) arr[1]; // pname
      ColorTag color = (ColorTag) arr[2]; // color
      String size = (String) arr[3]; // size
      Long count = (Long) arr[4]; // count
      Long total = (Long) arr[5]; // total
      String thumbnail = (String) arr[6]; // total


      log.info("color................ " + color);

      ColorTagDTO colorTagDTO = ColorTagDTO.builder()
              .color(color.getColor())
              .text(color.getText())
              .id(color.getId())
              .build();

      TopProductResponseDTO topCustomerResponseDTO = TopProductResponseDTO.builder()
              .pno(pno)
              .pname(pname)
              .size(size)
              .color(colorTagDTO)
              .quantity(count)
              .total(total)
              .thumbnail(thumbnail)
              .build();

      return topCustomerResponseDTO;


    }).collect(Collectors.toList());


    return dtoList;
  }

  @Override
  public List<MapSalesResponseDTO> getByCountryList(TopCustomerRequestDTO topCustomerRequestDTO) {


    //TOP 5
    List<Object[]> results = paymentService.getSalesByCountry(topCustomerRequestDTO);

    List<MapSalesResponseDTO> dtoList = results.stream().map(arr -> {

      String country = (String) arr[0];
      Long totalSales = (Long) arr[1];

      MapSalesResponseDTO mapSalesResponseDTO = MapSalesResponseDTO.builder()
              .country(country)
              .totalSales(totalSales)
              .build();

      return mapSalesResponseDTO;


    }).collect(Collectors.toList());


    return dtoList;
  }

  @Override
  public GAResponseDTO getGoogleAnalytics(GARequestDTO GARequestDTO) {

    String propertyId = environment.getProperty("google.analytics.productId");

    try {
      GAResponseDTO gaResponseDTO =  getGASessions(propertyId, GARequestDTO);

      List<TopPageDTO> topPages =  getGATopPages(propertyId, GARequestDTO);

      gaResponseDTO.setTopPages(topPages);


      return gaResponseDTO;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;

  }


  private GAResponseDTO getGASessions(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    GAResponseDTO GAResponseDTO = null; // 객체 초기화

    String sellerEmail = gaRequestDTO.getSellerEmail();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

      // 사용자의 ID로 필터링 설정 (맞춤 차원으로 필터링)
      FilterExpression filterByUserId = FilterExpression.newBuilder()
              .setFilter(Filter.newBuilder()
                      .setFieldName("customUser:seller_id") // 사용자 유형 기반으로 필터링
                      .setStringFilter(Filter.StringFilter.newBuilder()
                              .setMatchType(Filter.StringFilter.MatchType.EXACT)
                              .setValue(sellerEmail)
                      ))
              .build();
      
      //첫번째 기간에 대한 요청
      RunReportRequest request = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("pagePath")) // 페이지 경로 등 추가 가능
              .addDimensions(Dimension.newBuilder().setName("country")) //국가
              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
              .addMetrics(Metric.newBuilder().setName("averageSessionDuration")) // 평균 세션 지속 시간
//              .setDimensionFilter(filterByUserId)
              .build();
      
      // 첫번째 기간에 대한 Run the report
      RunReportResponse response = analyticsData.runReport(request);

      // 첫 번째 기간의 결과를 저장
      String sessions = "0", uniqueVisitors = "0", avgSessionDuration = "0";

      if (!response.getRowsList().isEmpty()) {
        var row = response.getRows(0); // 첫 번째 행을 가져옴
        sessions = row.getMetricValues(0).getValue();
        uniqueVisitors = row.getMetricValues(1).getValue();
        avgSessionDuration = row.getMetricValues(2).getValue();
      }


      // 두 번째 기간에 대한 요청
      RunReportRequest compareRequest = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("country")) // 국가별로 구분
              .addDateRanges(DateRange.newBuilder()
                      .setStartDate(gaRequestDTO.getComparedStartDate())
                      .setEndDate(gaRequestDTO.getComparedEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
              .addMetrics(Metric.newBuilder().setName("averageSessionDuration")) // 평균 세션 지속 시간
              .build();

      // 두 번째 기간에 대한 보고서 실행
      RunReportResponse compareResponse = analyticsData.runReport(compareRequest);

      // 두 번째 기간의 결과를 저장
      String sessionsCompared = "0", uniqueVisitorsCompared = "0", avgSessionDurationCompared = "0";


      if (!compareResponse.getRowsList().isEmpty()) {
        Row compareRow = compareResponse.getRows(0); // 첫 번째 행을 가져옴
        sessionsCompared = compareRow.getMetricValues(0).getValue();
        uniqueVisitorsCompared = compareRow.getMetricValues(1).getValue();
        avgSessionDurationCompared = compareRow.getMetricValues(2).getValue();
      }

      GAResponseDTO = GAResponseDTO.builder()
              .sessions(sessions)
              .uniqueVisitors(uniqueVisitors)
              .avgSessionDuration(avgSessionDuration)
              .sessionsCompared(calculatePercentageDifference(sessions, sessionsCompared))
              .uniqueVisitorsCompared(calculatePercentageDifference(uniqueVisitors, uniqueVisitorsCompared))
              .avgSessionDurationCompared(calculatePercentageDifference(avgSessionDuration, avgSessionDurationCompared))
              .build();
    }

    return GAResponseDTO; // 마지막 행의 객체 반환

  }


  private List<TopPageDTO> getGATopPages(String propertyId, GARequestDTO GARequestDTO) throws Exception {

    // 결과 처리
    List<TopPageDTO> topPages = new ArrayList<>();




    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {


      // 상위 페이지 요청
      RunReportRequest topPagesRequest = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("pagePath")) // 페이지 경로 기준
              .addDateRanges(DateRange.newBuilder().setStartDate(GARequestDTO.getStartDate()).setEndDate(GARequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .setLimit(5)
              .build();

      // 상위 페이지 보고서 실행
      RunReportResponse topPagesResponse = analyticsData.runReport(topPagesRequest);


      for (var row : topPagesResponse.getRowsList()) {
        String pagePath = row.getDimensionValues(0).getValue();
        String pageSessions = row.getMetricValues(0).getValue();
        topPages.add(new TopPageDTO(pagePath, pageSessions)); // TopPageDTO 객체 생성
      }

    }
    return topPages;

  }



  // 비율 차이 계산 메서드
  private String calculatePercentageDifference(String currentValue, String comparedValue) {
    try {
      double current = Double.parseDouble(currentValue);
      double compared = Double.parseDouble(comparedValue);

      if (compared == 0) return current == 0 ? "0%" : "∞%"; // 비교 값이 0일 때 처리

      double difference = ((current - compared) / compared) * 100;
      return String.format("%.2f%%", difference);
    } catch (NumberFormatException e) {
      return "0%"; // 숫자 형식이 아닐 경우 기본값
    }
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
