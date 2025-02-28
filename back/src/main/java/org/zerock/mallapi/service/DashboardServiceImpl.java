package org.zerock.mallapi.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.analytics.data.v1beta.*;
import com.google.protobuf.Timestamp;
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
import org.zerock.mallapi.repository.MemberRepository;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
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

  private final MemberRepository memberRepository;

  private final GoogleCredentials googleCredentials;


  @Override
  public CardResponseDTO getSalesCardList(ChartRequestDTO chartRequestDTO) {

    SalesCardDTO cardDTO = orderService.getOverviewCards(chartRequestDTO);


    List<Object[]> currentSales = cardDTO.getCurrentSales();
    List<Object[]> comparedSales = cardDTO.getComparedSales();

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


    // 차이 계산
    Long salesDifferencePercentage = ((currentTotalSales - comparedTotalSales) / comparedTotalSales) * 100;
    Long qtyDifferencePercentage = ((currentTotalQty - comparedTotalQty ) /comparedTotalQty) * 100;
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
      CompletableFuture<GAResponseDTO> sessionsFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGASessions(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });

      CompletableFuture<List<SessionDTO<String>>> topPagesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGATopPages(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<SessionDTO<String>>> topSourcesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGATopSources(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<SessionChartDTO> chartFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGAChart(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<SessionDTO<String>>> devicesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGADevices(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<SessionDTO<String>>> visitorsFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGAVisitors(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<CountryChartDTO>> countriesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGACountries(propertyId, gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });

    // 모든 작업이 완료될 때까지 기다림
        CompletableFuture.allOf(
                sessionsFuture, topPagesFuture, topSourcesFuture, chartFuture,
                devicesFuture, visitorsFuture, countriesFuture
        ).join();


      // 최종 GAResponseDTO 구성 (각 작업 결과를 조합)
      GAResponseDTO finalResult = GAResponseDTO.builder()
              .sessions(sessionsFuture.get().getSessions())
              .uniqueVisitors(sessionsFuture.get().getUniqueVisitors())
              .avgSessionDuration(sessionsFuture.get().getAvgSessionDuration())
              .topPages(topPagesFuture.get())
              .topSources(topSourcesFuture.get())
              .sessionChart(chartFuture.get())
              .devices(devicesFuture.get())
              .visitors(visitorsFuture.get())
              .countries(countriesFuture.get())
              .build();

      return finalResult;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;

  }

  @Override
  public GARealTimeResponseDTO getRealtime(GARequestDTO gaRequestDTO) {

    String propertyId = environment.getProperty("google.analytics.productId");

    try {

      CompletableFuture<List<SessionDTO<String>>> recentVisitorsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGARecentUser(propertyId, gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> activeVisitorsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAActiveVisitors(propertyId, gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<SessionChartDTO> activeVisitChartFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAActiveVisitChart(propertyId, gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> eventsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAEvents(propertyId, gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> devicesFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGARealTimeDevices(propertyId, gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      // 모든 병렬 작업이 완료될 때까지 기다림
      CompletableFuture.allOf(
              recentVisitorsFuture,
              activeVisitorsFuture,
              activeVisitChartFuture,
              eventsFuture,
              devicesFuture
      ).join();

      GARealTimeResponseDTO gaRealTimeResponseDTO = GARealTimeResponseDTO.builder()
              .recentVisitors(recentVisitorsFuture.get())
              .activeVisitors(activeVisitorsFuture.get())
              .activeVisitChart(activeVisitChartFuture.get())
              .events(eventsFuture.get())
              .devices(devicesFuture.get())
              .build();

      return gaRealTimeResponseDTO;


//      List<SessionDTO<String>> recentVisitors = getGARecentUser(propertyId, gaRequestDTO);
//
//      List<SessionDTO<String>> activeVisitors = getGAActiveVisitors(propertyId, gaRequestDTO);
//
//      SessionChartDTO activeVisitChart = getGAActiveVisitChart(propertyId, gaRequestDTO);
//
//      List<SessionDTO<String>> events = getGAEvents(propertyId, gaRequestDTO);
//
//      List<SessionDTO<String>> devices = getGARealTimeDevices(propertyId, gaRequestDTO);
//
//      //보낼데이터
//      GARealTimeResponseDTO gaRealTimeResponseDTO = GARealTimeResponseDTO.builder().recentVisitors(recentVisitors).activeVisitors(activeVisitors).activeVisitChart(activeVisitChart).events(events).devices(devices).build();

//      return gaRealTimeResponseDTO;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;
  }

  //실시간 보고서 - 최근 방문자
  private List<SessionDTO<String>> getGARecentUser(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> recentUsers = new ArrayList<>();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();


    try (BetaAnalyticsDataClient realTimeDataClient = BetaAnalyticsDataClient.create(settings)) {

      // Real Time Report 요청
      RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("customUser:custom_user_id"))
              .addMetrics(Metric.newBuilder().setName("activeUsers"))  // 활성 사용자
              .setLimit(5) // 가장 최근 사용자 5명만 가져오기
              .build();

      // 실시간 보고서 실행
      RunRealtimeReportResponse response = realTimeDataClient.runRealtimeReport(request);

      // 응답 처리
      for (Row row : response.getRowsList()) {
        String custom_user_id = row.getDimensionValues(0).getValue();
        String activeUsers = row.getMetricValues(0).getValue();
        System.out.println(" - custom_user_id: " + custom_user_id);
        System.out.println(" - activeUsers: " + activeUsers);

        recentUsers.add(new SessionDTO(custom_user_id, activeUsers));

        // 이메일 찾기

        //read
        if (custom_user_id != null) {

//          Optional<Member> result = memberRepository.findByEncryptedId(custom_user_id);
//
//          System.out.println(" - result: " + result);
//
//          Member member = result.orElseThrow();

//          System.out.println(" - member: " + member);
//
//          recentUsers.add(new SessionDTO(member.getEmail(), activeUsers));

        }
      }
    }
    System.out.println(" - recentUsers recentUsers: " + recentUsers);


    return recentUsers;

  }


  private SessionChartDTO getGAActiveVisitChart(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    ArrayList<String> xaxis = new ArrayList<>(31); //0분에서 30분까지
    List<String> data = new ArrayList<>(31);

    // 0분부터 30분까지 -00분 ~ -30분 까지 기본 값으로 넣기
    for (int i = 0; i < 31; i++) {
      xaxis.add((30 - i)+"");
      data.add("0"); // 데이터는 처음에 0으로 채움
    }

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();


    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

      // 1분 동안의 실시간 데이터 요청
      RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("minutesAgo")) //실시간 몇 분 전
              .addMetrics(Metric.newBuilder().setName("activeUsers"))
              .addOrderBys(OrderBy.newBuilder()
                      .setDesc(true)
                      .setDimension(OrderBy.DimensionOrderBy.newBuilder()
                              .setDimensionName("minutesAgo")
                              .build())
                      .build())
              .setLimit(31) //31개 제한
              .build();

      // 실시간 데이터 요청
      RunRealtimeReportResponse response = analyticsData.runRealtimeReport(request);


      for (Row row : response.getRowsList()) {

        String minutesAgo = row.getDimensionValues(0).getValue();
        String activeUsers = row.getMetricValues(0).getValue();


        // "minutesAgo" 값은 -0분 ~ -30분 사이로 나오므로, 그 값에 맞는 인덱스를 찾음
        int index = 30 - Integer.parseInt(minutesAgo); // 0분부터 30분까지의 순서

        // 해당 index에 데이터 넣기
        xaxis.set(index, minutesAgo);
        data.set(index, activeUsers);  // 해당 분에 대한 activeUsers 값 설정

      }

    }


    // sessionChart 객체 생성
    SessionChartDTO sessionChart = SessionChartDTO.builder()
            .xaxis(xaxis)  // xaxis 리스트 추가
            .data(data)    // data 리스트 추가
            .build();
//
    return sessionChart;

  }



  //실시간 보고서 -
  private List<SessionDTO<String>> getGAEvents(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> results = new ArrayList<>();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();


    try (BetaAnalyticsDataClient realTimeDataClient = BetaAnalyticsDataClient.create(settings)) {

      // Real Time Report 요청
      RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("eventName")) // 이벤트명
              .addMetrics(Metric.newBuilder().setName("eventCount")) // 이벤트 카운트
              .setLimit(100) // 최대 100개 데이터
              .build();

      // 실시간 보고서 실행
      RunRealtimeReportResponse response = realTimeDataClient.runRealtimeReport(request);

      // 응답 처리
      for (Row row : response.getRowsList()) {
        String eventName = row.getDimensionValues(0).getValue();
        String eventCount = row.getMetricValues(0).getValue();


        System.out.println(" - eventName: " + eventName);
        System.out.println(" - eventCount: " + eventCount);

        results.add(new SessionDTO(eventName, eventCount));

      }
    }
    System.out.println(" - results: " + results);


    return results;

  }




  //실시간 보고서 -
  private List<SessionDTO<String>> getGARealTimeDevices(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> results = new ArrayList<>();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient realTimeDataClient = BetaAnalyticsDataClient.create(settings)) {

      // Real Time Report 요청
      RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addDimensions(Dimension.newBuilder().setName("deviceCategory"))
              .addMetrics(Metric.newBuilder().setName("activeUsers"))
              .build();

      // 실시간 보고서 실행
      RunRealtimeReportResponse response = realTimeDataClient.runRealtimeReport(request);

      // 응답 처리
      for (Row row : response.getRowsList()) {
        String deviceCategory = row.getDimensionValues(0).getValue();
        String activeUsers = row.getMetricValues(0).getValue();


        System.out.println(" - deviceCategory: " + deviceCategory);
        System.out.println(" - activeUsers: " + activeUsers);

        results.add(new SessionDTO(deviceCategory, activeUsers));

      }
    }
    System.out.println(" - results: " + results);


    return results;

  }




  //실시간 보고서 - 지난 30분 동안의 활성 사용자 & 조회수
  private List<SessionDTO<String>> getGAActiveVisitors(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> result = new ArrayList<>();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient realTimeDataClient = BetaAnalyticsDataClient.create(settings)) {


      // Real Time Report 요청
      RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
              .setProperty("properties/" + propertyId)
              .addMetrics(Metric.newBuilder().setName("activeUsers"))
              .addMetrics(Metric.newBuilder().setName("screenPageViews")) // 페이지 조회수
              .setLimit(1000) // 충분히 많은 데이터를 요청하여 합산
              .build();


      // 보고서 실행
      RunRealtimeReportResponse response = realTimeDataClient.runRealtimeReport(request);


      // 응답 처리
      for (Row row : response.getRowsList()) {
        // 활성 사용자 수
        String activeUsers = row.getMetricValues(0).getValue();
        // 조회수
        String pageViews = row.getMetricValues(1).getValue();

        System.out.println(" - real-time activeUsers: " + activeUsers);
        System.out.println(" - real-time pageViews: " + pageViews);

        result.add(new SessionDTO("activeUsers", activeUsers));
        result.add(new SessionDTO("pageViews", pageViews));

      }


      return result;

    }

  }

  // Timestamp 형식으로 변환
  private String formatTimestamp(Instant instant) {
    Timestamp timestamp = Timestamp.newBuilder()
            .setSeconds(instant.getEpochSecond())
            .setNanos(instant.getNano())
            .build();
    return timestamp.toString();
  }

  private List<CountryChartDTO> getGACountries(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<CountryChartDTO> countries = new ArrayList<>();
    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

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


        List<Double> coordinates = getCoordinates(countryCode);

        countries.add(new CountryChartDTO(countryCode, sessions, coordinates));

      }

    }

    return countries;

  }



  private List<SessionDTO<String>> getGAVisitors(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> visitors = new ArrayList<>();
    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

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



  private List<SessionDTO<String>> getGADevices(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> devices = new ArrayList<>();
    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();
    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

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


  //original
  private GAResponseDTO getGASessions(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    GAResponseDTO gaResponseDTO = null; // 객체 초기화

    String sellerEmail = gaRequestDTO.getSellerEmail();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

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


      gaResponseDTO = gaResponseDTO.builder()
              .sessions(sessions)
              .uniqueVisitors(uniqueVisitors)
              .avgSessionDuration(avgSessionDuration.toString())
              .sessionsCompared(calculatePercentageDifference(sessions, sessionsCompared))
              .uniqueVisitorsCompared(calculatePercentageDifference(uniqueVisitors, uniqueVisitorsCompared))
              .avgSessionDurationCompared(calculatePercentageDifference(avgSessionDuration, avgSessionDurationCompared))
              .build();
    }

    return gaResponseDTO; // 마지막 행의 객체 반환

  }


//  //CompletableFuture 으로 병렬 요청하여 시간 단축
//  private GAResponseDTO getGASessions(String propertyId, GARequestDTO gaRequestDTO) throws Exception {
//
//    GAResponseDTO gaResponseDTO = null; // 객체 초기화
//
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//      //첫번째 기간에 대한 요청
//      RunReportRequest request = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
//              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
//              .addMetrics(Metric.newBuilder().setName("userEngagementDuration")) // 사용자 참여도
//              .build();
//
//      // 두 번째 기간의 요청 생성 (예: 비교 기간, 실제로 다른 날짜 범위를 설정해야 함)
//      RunReportRequest compareRequest = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
//              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
//              .addMetrics(Metric.newBuilder().setName("userEngagementDuration")) //사용자 참여도
//              .build();
//
//      // 병렬로 두 요청 실행
//      CompletableFuture<RunReportResponse> future1 = CompletableFuture.supplyAsync(() -> analyticsData.runReport(request));
//      CompletableFuture<RunReportResponse> future2 = CompletableFuture.supplyAsync(() -> analyticsData.runReport(compareRequest));
//
//
//      RunReportResponse response = future1.get();
//      RunReportResponse compareResponse = future2.get();
//
//
//      // 첫 번째 기간의 결과를 저장
//      String sessions = "0", uniqueVisitors = "0", userEngagementDuration = "0";
//
//      Double avgSessionDuration = 0.0;
//
//
//      if (!response.getRowsList().isEmpty()) {
//        Row row = response.getRows(0); // 첫 번째 행을 가져옴
//        sessions = row.getMetricValues(0).getValue(); //사이트 세션
//        uniqueVisitors = row.getMetricValues(1).getValue(); // 고유 방문자자
//        userEngagementDuration = row.getMetricValues(2).getValue(); //사용자 참여도
//        avgSessionDuration =  Double.parseDouble(userEngagementDuration) /  Double.parseDouble(sessions);  // avg.session duration
//      }
//
//      // 두 번째 기간 데이터 처리
//      String sessionsCompared = "0", uniqueVisitorsCompared = "0", userEngagementDurationCompared = "0";
//      Double avgSessionDurationCompared = 0.0;
//      if (!compareResponse.getRowsList().isEmpty()) {
//        Row compareRow = compareResponse.getRows(0);
//        sessionsCompared = compareRow.getMetricValues(0).getValue();
//        uniqueVisitorsCompared = compareRow.getMetricValues(1).getValue();
//        userEngagementDurationCompared = compareRow.getMetricValues(2).getValue();
//        avgSessionDurationCompared = Double.parseDouble(userEngagementDurationCompared) / Double.parseDouble(sessionsCompared);
//      }
//
//      gaResponseDTO = gaResponseDTO.builder()
//              .sessions(sessions)
//              .uniqueVisitors(uniqueVisitors)
//              .avgSessionDuration(avgSessionDuration.toString())
//              .sessionsCompared(calculatePercentageDifference(sessions, sessionsCompared))
//              .uniqueVisitorsCompared(calculatePercentageDifference(uniqueVisitors, uniqueVisitorsCompared))
//              .avgSessionDurationCompared(calculatePercentageDifference(avgSessionDuration, avgSessionDurationCompared))
//              .build();
//    }
//
//    return gaResponseDTO;
//  }


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


    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();


    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

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
    return sessionChart;

  }



  private List<SessionDTO<String>> getGATopSources(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> topPages = new ArrayList<>();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {


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


  private List<SessionDTO<String>> getGATopPages(String propertyId, GARequestDTO gaRequestDTO) throws Exception {

    // 결과 처리
    List<SessionDTO<String>> topPages = new ArrayList<>();

    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
            .setCredentialsProvider(() -> googleCredentials)
            .build();

    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {

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


    //-100% : 비교 데이터 값이 있는데, 기준 데이터가 없을 때
    // 100% : 비교 데이터 값은 없음 (0), 기준 데이터값은 있음

    if (comparedValue == null || currentValue == null) {
      return "-"; // 비교 데이터 또는 기준 데이터가 없을 때
    }

    if (comparedValue == 0) {
      return "100"; // 기준 데이터가 0일 때는 100% 상승으로 처리
    }

    double difference = ((currentValue - comparedValue) / comparedValue) * 100;

    return String.format("%.2f", difference);
  }

  // 오버로딩된 메서드
  private String calculatePercentageDifference(String currentValue, String comparedValue) {


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

    // 연도의 첫 번째 날을 가져옴
    LocalDate firstDayOfYear = LocalDate.of(year, 1, 1);


    // 한국 로케일에 맞춰 첫 번째 주의 시작일을 계산 (월요일로 설정)
    WeekFields weekFields = WeekFields.of(DayOfWeek.MONDAY, 1); // 월요일 시작, 첫 주는 1일 이상 포함해야 첫 번째 주로 계산
    LocalDate firstMonday = firstDayOfYear.with(weekFields.dayOfWeek(), 1); // 월요일로 맞춤


    // 해당 주의 시작일 계산 (주의 시작일 + (주 번호 - 1) 주)
    LocalDate weekStartDate = firstMonday.plusWeeks(week - 1);


    return weekStartDate;

  }


  // 국가 코드로 좌표 구하기(마커때문에)
  public List<Double> getCoordinates(String countryCode) {
    String url = String.format("https://restcountries.com/v3.1/alpha/%s", countryCode);
    RestTemplate restTemplate = new RestTemplate();

    try {
      ResponseEntity<CountryResponseDTO[]> responseEntity = restTemplate.getForEntity(url, CountryResponseDTO[].class);
      CountryResponseDTO[] response = responseEntity.getBody();

      if (response != null && response.length > 0 && response[0].getLatlng() != null) {
        return response[0].getLatlng();
      }
    } catch (Exception e) {
      // 좌표 조회 중 예외 발생 시 기본값 반환
      System.out.println("Error fetching coordinates for country code: " + countryCode + ". Returning default coordinates.");
    }

    // 기본값 반환
    return Arrays.asList(0.0, 0.0);
  }

}
