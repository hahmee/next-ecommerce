package org.zerock.mallapi.service;

import com.google.analytics.data.v1beta.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.domain.ChartFilter;
import org.zerock.mallapi.domain.ColorTag;
import org.zerock.mallapi.dto.*;

import javax.swing.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
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


    if (filter != null) {
      switch (filter) {
        case DAY:
          for (Object[] result : results) {

            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate(); // LocalDate로 변환

            Long totalOrders = (Long) result[1];  // Total Orders

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


    if (filter != null) {
      switch (filter) {
        case DAY:
          for (Object[] result : results) {

            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate(); // LocalDate로 변환

            Double avgOrders = (Double) result[1];  // Avg Orders

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

    log.info("....topCustomerRequestDTO " + topCustomerRequestDTO);

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
  public GAResponseDTO getGoogleAnalytics(GARequestDTO gaRequestDTO) {


    String propertyId = environment.getProperty("google.analytics.productId");


    try {

      GAResponseDTO gaResponseDTO =  getGASessions(propertyId, gaRequestDTO);

      List<SessionDTO> topPages =  getGATopPages(propertyId, gaRequestDTO);

      List<SessionDTO> topSources =  getGATopSources(propertyId, gaRequestDTO);

      SessionChartDTO sessionChart = getGAChart(propertyId, gaRequestDTO);

      List<SessionDTO> devices = getGADevices(propertyId, gaRequestDTO);

      List<SessionDTO> visitors = getGAVisitors(propertyId, gaRequestDTO);

      List<CountryChartDTO> countries = getGACountries(propertyId, gaRequestDTO);

      gaResponseDTO.setTopPages(topPages);
      gaResponseDTO.setTopSources(topSources);
      gaResponseDTO.setSessionChart(sessionChart);
      gaResponseDTO.setDevices(devices);
      gaResponseDTO.setVisitors(visitors);
      gaResponseDTO.setCountries(countries);

      return gaResponseDTO;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;

  }

  @Override
  public List<SessionDTO> getRealtimeUser(GARequestDTO gaRequestDTO) {

    String propertyId = environment.getProperty("google.analytics.productId");

    try {

      List<SessionDTO> gaResponseDTO =  getGARecentUser(propertyId, gaRequestDTO);

      return gaResponseDTO;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;
  }

  //실시간 보고서 - 최근 방문자
  private List<SessionDTO> getGARecentUser(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO> recentUsers = new ArrayList<>();

    try (BetaAnalyticsDataClient realTimeDataClient = BetaAnalyticsDataClient.create()) {

      // Real Time Report 요청
      RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("customUser:custom_user_id"))
              .addMetrics(Metric.newBuilder().setName("activeUsers"))  // 활성 사용자
              .build();

      // 실시간 보고서 실행
      RunRealtimeReportResponse response = realTimeDataClient.runRealtimeReport(request);

      // 응답 처리
      for (Row row : response.getRowsList()) {
        String pagePath = row.getDimensionValues(0).getValue();
        String activeUsers = row.getMetricValues(0).getValue();
        System.out.println("Page: " + pagePath + " - Active Users: " + activeUsers);
      }




//      RunReportRequest request = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDimensions(Dimension.newBuilder().setName("customUser:custom_user_id"))
//              .addMetrics(Metric.newBuilder().setName("activeUsers"))
//              .addMetrics(Metric.newBuilder().setName("eventCount")) // eventCount 사용
//              .addDateRanges(DateRange.newBuilder()
//                      .setStartDate("7daysAgo")
//                      .setEndDate("today")
//                      .build()).build();
//
//      RunReportResponse response = analyticsData.runReport(request);
//
//
//      for (Row row : response.getRowsList()) {
//        String userId = row.getDimensionValues(0).getValue(); //user_id
//        String activeUsers = row.getMetricValues(0).getValue();// activeUsers
//        String eventCount = row.getMetricValues(1).getValue();// eventCount
//
//        log.info("userId..." + userId);
//        log.info("activeUsers..." + activeUsers);
//        log.info("eventCount..." + eventCount);
//        recentUsers.add(null); // TopPageDTO 객체 생성
//
////        recentUsers.add(new SessionDTO(trafficSource, sessions)); // TopPageDTO 객체 생성
//
//      }

    }

    return recentUsers;

  }



  private List<CountryChartDTO> getGACountries(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<CountryChartDTO> countries = new ArrayList<>();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

      RunReportRequest request = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDateRanges(DateRange.newBuilder()
                      .setStartDate(gaRequestDTO.getStartDate())
                      .setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .addDimensions(Dimension.newBuilder().setName("countryId")) // 국가별 차원 추가
              .addDimensions(Dimension.newBuilder().setName("cityId")) // 도시별 차원 추가
              .build();


      // 상위 페이지 보고서 실행
      RunReportResponse response = analyticsData.runReport(request);

      for (Row row : response.getRowsList()) {
        String countryCode = row.getDimensionValues(0).getValue();
        String cityCode = row.getDimensionValues(1).getValue();
        String sessions = row.getMetricValues(0).getValue();

        log.info("citt..." + cityCode);

        List<Double> coordinates = getCoordinates(countryCode);

        countries.add(new CountryChartDTO(countryCode, sessions, coordinates));

      }



    }
    log.info("countries.." + countries);

    return countries;

  }



  private List<SessionDTO> getGAVisitors(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO> visitors = new ArrayList<>();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

      RunReportRequest request = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDateRanges(DateRange.newBuilder()
                      .setStartDate(gaRequestDTO.getStartDate())
                      .setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .addDimensions(Dimension.newBuilder().setName("newVsReturning")) // 새로운 방문자 vs 기존 방문자
              .build();


      // 상위 페이지 보고서 실행
      RunReportResponse response = analyticsData.runReport(request);

      for (Row row : response.getRowsList()) {
        String trafficSource = row.getDimensionValues(0).getValue();
        String sessions = row.getMetricValues(0).getValue();


        visitors.add(new SessionDTO(trafficSource, sessions));
      }

    }
    return visitors;

  }



  private List<SessionDTO> getGADevices(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO> devices = new ArrayList<>();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

      RunReportRequest request = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDateRanges(DateRange.newBuilder()
                      .setStartDate(gaRequestDTO.getStartDate())
                      .setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .addDimensions(Dimension.newBuilder().setName("deviceCategory")) // 기기별 세션 보기
              .build();


      // 상위 페이지 보고서 실행
      RunReportResponse response = analyticsData.runReport(request);

      for (Row row : response.getRowsList()) {
        String trafficSource = row.getDimensionValues(0).getValue();
        String sessions = row.getMetricValues(0).getValue();


        devices.add(new SessionDTO(trafficSource, sessions));
      }

    }
    return devices;

  }



  private GAResponseDTO getGASessions(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    GAResponseDTO gaResponseDTO = null; // 객체 초기화

    String sellerEmail = gaRequestDTO.getSellerEmail();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

//      // 사용자의 ID로 필터링 설정 (맞춤 차원으로 필터링)
//      FilterExpression filterByUserId = FilterExpression.newBuilder()
//              .setFilter(Filter.newBuilder()
//                      .setFieldName("customUser:seller_id") // 사용자 유형 기반으로 필터링
//                      .setStringFilter(Filter.StringFilter.newBuilder()
//                              .setMatchType(Filter.StringFilter.MatchType.EXACT)
//                              .setValue(sellerEmail)
//                      ))
//              .build();
      
      //첫번째 기간에 대한 요청
      RunReportRequest request = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
              .addMetrics(Metric.newBuilder().setName("userEngagementDuration")) // 사용자 참여도
//              .setDimensionFilter(filterByUserId)
              .build();
      
      // 첫번째 기간에 대한 Run the report
      RunReportResponse response = analyticsData.runReport(request);

      // 첫 번째 기간의 결과를 저장
      String sessions = "0", uniqueVisitors = "0", userEngagementDuration = "0";

      Double avgSessionDuration = 0.0;

      if (!response.getRowsList().isEmpty()) {
        Row row = response.getRows(0); // 첫 번째 행을 가져옴
        sessions = row.getMetricValues(0).getValue(); //사이트 세션
        uniqueVisitors = row.getMetricValues(1).getValue(); // 고유 방문자자
        userEngagementDuration = row.getMetricValues(2).getValue(); //사용자 참여도
        avgSessionDuration =  Double.parseDouble(userEngagementDuration) /  Double.parseDouble(sessions);  // avg.session duration
      }

      log.info("sessions", sessions);
      log.info("uniqueVisitors", uniqueVisitors);
      log.info("userEngagementDuration", userEngagementDuration);
      log.info("avgSessionDuration", avgSessionDuration);

//////////////////////


      // 두 번째 기간에 대한 요청
      RunReportRequest compareRequest = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
              .addMetrics(Metric.newBuilder().setName("userEngagementDuration")) //사용자 참여도
              .build();

      // 두 번째 기간에 대한 보고서 실행
      RunReportResponse compareResponse = analyticsData.runReport(compareRequest);

      // 두 번째 기간의 결과를 저장
      String sessionsCompared = "0", uniqueVisitorsCompared = "0", userEngagementDurationCompared = "0";

      Double avgSessionDurationCompared = 0.0;

      if (!compareResponse.getRowsList().isEmpty()) {
        Row compareRow = compareResponse.getRows(0); // 첫 번째 행을 가져옴
        sessionsCompared = compareRow.getMetricValues(0).getValue();
        uniqueVisitorsCompared = compareRow.getMetricValues(1).getValue();
        userEngagementDurationCompared = compareRow.getMetricValues(2).getValue(); //사용자 참여도
        avgSessionDurationCompared =  Double.parseDouble(userEngagementDurationCompared) /  Double.parseDouble(sessionsCompared);  // avg.session duration

      }

      log.info("sessionsCompared", sessionsCompared);
      log.info("uniqueVisitorsCompared", uniqueVisitorsCompared);
      log.info("userEngagementDurationCompared", userEngagementDurationCompared);
      log.info("avgSessionDurationCompared", avgSessionDurationCompared);


      gaResponseDTO = gaResponseDTO.builder()
              .sessions(sessions)
              .uniqueVisitors(uniqueVisitors)
              .avgSessionDuration(avgSessionDuration.toString())
              .sessionsCompared(calculatePercentageDifference(sessions, sessionsCompared))
              .uniqueVisitorsCompared(calculatePercentageDifference(uniqueVisitors, uniqueVisitorsCompared))
              .avgSessionDurationCompared(calculatePercentageDifference(avgSessionDuration, avgSessionDurationCompared))
              .build();
    }


    log.info("asdfasdfgaResponseDTO + " + gaResponseDTO);

    return gaResponseDTO; // 마지막 행의 객체 반환

  }


  private SessionChartDTO getGAChart(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    List<String> xaxis = new ArrayList<>();
    List<String> data = new ArrayList<>();

    ChartFilter filter = gaRequestDTO.getFilter();

    String filterString = "date";

    if( filter != null) {
      switch (filter) {

        case DAY:
          filterString = "date";
          break;

        case WEEK:
          filterString = "week";
          break;

        case MONTH:
          filterString = "month";
          break;

        case YEAR:
          filterString = "year";
          break;

        default:
          break;
      }
    }


    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

      // 상위 페이지 요청
      RunReportRequest.Builder requestBuilder = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .addDimensions(Dimension.newBuilder().setName(filterString)); // day, week, month, year 세션 보기

      // 필터가 WEEK 일 경우 'year' 차원 추가
      if (filter == ChartFilter.WEEK) {
        requestBuilder.addDimensions(Dimension.newBuilder().setName("year")); // year 세션 보기
      }


      // 날짜별 정렬 추가
      requestBuilder.addOrderBys(OrderBy.newBuilder().setDimension(OrderBy.DimensionOrderBy.newBuilder().setDimensionName(filterString)).build());

      RunReportRequest request = requestBuilder.build();

      // 상위 페이지 보고서 실행
      RunReportResponse response = analyticsData.runReport(request);


      for (Row row : response.getRowsList()) {
        String date = row.getDimensionValues(0).getValue(); //20240110 or 41 or 10 or 2024

        log.info("date...." + date);

        String formattedDate = "";

        //DAY라면
        if(filter == ChartFilter.DAY) {

          // yyyyMMdd 형식으로 LocalDate로 변환
          DateTimeFormatter originalFormat = DateTimeFormatter.ofPattern("yyyyMMdd");
          LocalDate yymmdd = LocalDate.parse(date, originalFormat);

          // yyyy-MM-dd 형식으로 변환
          DateTimeFormatter targetFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
          formattedDate = yymmdd.format(targetFormat);

        } else if (filter == ChartFilter.WEEK) {
          String year = row.getDimensionValues(1).getValue(); //20240110 or 41 or 10 or 2024

          LocalDate weekStartDate = getWeekStartDate(Integer.parseInt(year), Integer.parseInt(date));
          formattedDate = weekStartDate.toString();

        } else {
          formattedDate = date;
        }


        String sessions = row.getMetricValues(0).getValue();

        xaxis.add(formattedDate);
        data.add(sessions);

      }

    }


    // sessionChart 객체 생성
    SessionChartDTO sessionChart = SessionChartDTO.builder()
            .xaxis(xaxis)  // xaxis 리스트 추가
            .data(data)    // data 리스트 추가
            .build();
//
    log.info("sessionChart..." + sessionChart);
    return sessionChart;

  }



  private List<SessionDTO> getGATopSources(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO> topPages = new ArrayList<>();


    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {


      // 상위 페이지 요청
      RunReportRequest topSourcesRequest = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("manualSource"))  // 트래픽 소스
              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .setLimit(5)
              .build();

      // 상위 페이지 보고서 실행
      RunReportResponse topSourcesResponse = analyticsData.runReport(topSourcesRequest);

      for (Row row : topSourcesResponse.getRowsList()) {
        String trafficSource = row.getDimensionValues(0).getValue();
        String sessions = row.getMetricValues(0).getValue();


        topPages.add(new SessionDTO(trafficSource, sessions)); // TopPageDTO 객체 생성
      }

    }
    return topPages;

  }


  private List<SessionDTO> getGATopPages(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO> topPages = new ArrayList<>();




    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {


      // 상위 페이지 요청
      RunReportRequest topPagesRequest = RunReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("pagePath")) // 페이지 경로 기준
              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
              .setLimit(5)
              .build();

      // 상위 페이지 보고서 실행
      RunReportResponse topPagesResponse = analyticsData.runReport(topPagesRequest);


      for (Row row : topPagesResponse.getRowsList()) {
        String pagePath = row.getDimensionValues(0).getValue();
        String pageSessions = row.getMetricValues(0).getValue();
        topPages.add(new SessionDTO(pagePath, pageSessions)); // TopPageDTO 객체 생성
      }

    }
    return topPages;

  }

  // 비율 차이 계산 메서드
  private String calculatePercentageDifference(Double currentValue, Double comparedValue) {
    log.info("currentValue???" + currentValue);
    log.info("comparedValue???" + comparedValue);


    //-100% : 비교 데이터 값이 있는데, 기준 데이터가 없을 때
    // 100% : 비교 데이터 값은 없음 (0), 기준 데이터값은 있음

    if (comparedValue == null || currentValue == null) {
      return "-"; // 비교 데이터 또는 기준 데이터가 없을 때
    }

    if (comparedValue == 0) {
      return "100"; // 기준 데이터가 0일 때는 100% 상승으로 처리
    }

    double difference = ((currentValue - comparedValue) / comparedValue) * 100;

    log.info("???" + difference);
    return String.format("%.2f", difference);
  }

  // 오버로딩된 메서드
  private String calculatePercentageDifference(String currentValue, String comparedValue) {

    log.info("currentValue....." + currentValue);
    log.info("comparedValue......" + comparedValue); //계속 0 이 나와

    if (currentValue == null || comparedValue == null) {
      return "-"; // 비교 데이터 또는 기준 데이터가 없을 때
    }

    try {
      double current = Double.parseDouble(currentValue);
      double compared = Double.parseDouble(comparedValue);
      return calculatePercentageDifference(current, compared);
    } catch (NumberFormatException e) {
      return "-"; // 숫자 형식이 아닐 경우
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


  //국가 코드로 좌표 구하기(마커때문에)
  public List<Double> getCoordinates(String countryCode) {
    String url = String.format("https://restcountries.com/v3.1/alpha/%s", countryCode);

    RestTemplate restTemplate = new RestTemplate();

    ResponseEntity<CountryResponseDTO[]> responseEntity = restTemplate.getForEntity(url, CountryResponseDTO[].class);
    CountryResponseDTO[] response = responseEntity.getBody();

    if (response != null && response.length > 0 && response[0].getLatlng() != null) {
      return response[0].getLatlng();
    }

    // 기본값을 반환하기 위해 ArrayList를 사용
    return new ArrayList<>(Arrays.asList(0.0, 0.0)); // 기본값
  }

}
