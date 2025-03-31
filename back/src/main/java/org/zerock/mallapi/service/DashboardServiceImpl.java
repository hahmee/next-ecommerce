package org.zerock.mallapi.service;

import com.google.analytics.data.v1beta.*;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.bigquery.*;
import com.google.protobuf.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.domain.ChartFilter;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.MemberRepository;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
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

  @Value("${google.analytics.productId}")
  private String propertyId;

  @Value("${google.cloud.projectId}")
  private String projectId;

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

      Long pno = (Long) arr[0];                         // pno
      String pname = (String) arr[1];                   // pname
      String size = (String) arr[2];                    // size (arr[2]가 t.size)
      String colorName = (String) arr[3];                     // 색상의 경우, ID를 가져옴 (필요 시 별도로 ColorTag 조회)
      Long count = (Long) arr[4];                       // count (판매 건수)
      BigDecimal grossSalesDecimal = (BigDecimal) arr[5];  // gross (매출 합계)
      Long grossSales = grossSalesDecimal.longValue();
      String thumbnail = (String) arr[6];               // thumbnail_url
      BigDecimal percentOfTotalDecimal = (BigDecimal) arr[7];  // percent_of_total
      Long percentOfTotal = percentOfTotalDecimal.longValue();


      ColorTagDTO colorTagDTO = ColorTagDTO.builder()
              .text(colorName)
              .build();

      TopProductResponseDTO topCustomerResponseDTO = TopProductResponseDTO.builder()
              .pno(pno)
              .pname(pname)
              .size(size)
              .color(colorTagDTO)
              .quantity(count)
              .total(percentOfTotal)
              .thumbnail(thumbnail)
              .grossSales(grossSales)
//              .change()
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

  //original
  @Override
  public GAResponseDTO getGoogleAnalytics(GARequestDTO gaRequestDTO) {
    log.info("GARequestDTO..." + gaRequestDTO);

    try {
      CompletableFuture<GAResponseDTO> sessionsFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGASessions(gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });

      CompletableFuture<List<SessionDTO<String>>> topPagesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGATopPages(gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<SessionDTO<String>>> topSourcesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGATopSources(gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<SessionChartDTO> chartFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGAChart(gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<SessionDTO<String>>> devicesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGADevices(gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<SessionDTO<String>>> visitorsFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGAVisitors(gaRequestDTO);
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      });
      CompletableFuture<List<CountryChartDTO>> countriesFuture = CompletableFuture.supplyAsync(() -> {
          try {
              return getGACountries(gaRequestDTO);
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
              .avgSessionDurationCompared(sessionsFuture.get().getAvgSessionDurationCompared())
              .sessionsCompared(sessionsFuture.get().getSessionsCompared())
              .uniqueVisitorsCompared(sessionsFuture.get().getUniqueVisitorsCompared())
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
  public GAResponseTopDTO getGoogleAnalyticsTop(GARequestDTO gaRequestDTO) {
    log.info("GARequestDTO..." + gaRequestDTO);

    try {
      CompletableFuture<GAResponseDTO> sessionsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGASessions(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<SessionChartDTO> chartFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAChart(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      // 모든 작업이 완료될 때까지 기다림
      CompletableFuture.allOf(
              sessionsFuture, chartFuture
      ).join();

      // 최종 GAResponseDTO 구성 (각 작업 결과를 조합)
      GAResponseTopDTO finalResult = GAResponseTopDTO.builder()
              .sessions(sessionsFuture.get().getSessions())
              .uniqueVisitors(sessionsFuture.get().getUniqueVisitors())
              .avgSessionDuration(sessionsFuture.get().getAvgSessionDuration())
              .avgSessionDurationCompared(sessionsFuture.get().getAvgSessionDurationCompared())
              .sessionsCompared(sessionsFuture.get().getSessionsCompared())
              .uniqueVisitorsCompared(sessionsFuture.get().getUniqueVisitorsCompared())
              .sessionChart(chartFuture.get())
              .build();

      return finalResult;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;

  }


  @Override
  public GAResponseMiddleDTO getGoogleAnalyticsMiddle(GARequestDTO gaRequestDTO) {
    log.info("GARequestDTO..." + gaRequestDTO);

    try {

      CompletableFuture<List<SessionDTO<String>>> topPagesFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGATopPages(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });
      CompletableFuture<List<SessionDTO<String>>> topSourcesFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGATopSources(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> devicesFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGADevices(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });
      CompletableFuture<List<SessionDTO<String>>> visitorsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAVisitors(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      // 모든 작업이 완료될 때까지 기다림
      CompletableFuture.allOf(
              topPagesFuture, topSourcesFuture,
              devicesFuture, visitorsFuture
      ).join();

      // 최종 GAResponseMiddleDTO 구성 (각 작업 결과를 조합)
      GAResponseMiddleDTO finalResult = GAResponseMiddleDTO.builder()
              .topPages(topPagesFuture.get())
              .topSources(topSourcesFuture.get())
              .devices(devicesFuture.get())
              .visitors(visitorsFuture.get())
              .build();

      return finalResult;

    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
    return null;

  }


  @Override
  public GAResponseBottomDTO getGoogleAnalyticsBottom(GARequestDTO gaRequestDTO) {
    log.info("GARequestDTO..." + gaRequestDTO);

    try {

      CompletableFuture<List<CountryChartDTO>> countriesFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGACountries(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      // 모든 작업이 완료될 때까지 기다림
      CompletableFuture.allOf(
            countriesFuture
      ).join();


      // 최종 GAResponseDTO 구성 (각 작업 결과를 조합)
      GAResponseBottomDTO finalResult = GAResponseBottomDTO.builder()
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

    try {

      CompletableFuture<List<SessionDTO<String>>> recentVisitorsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGARecentUser(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> activeVisitorsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAActiveVisitors(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<SessionChartDTO> activeVisitChartFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAActiveVisitChart(gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> eventsFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGAEvents( gaRequestDTO);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });

      CompletableFuture<List<SessionDTO<String>>> devicesFuture = CompletableFuture.supplyAsync(() -> {
        try {
          return getGARealTimeDevices(gaRequestDTO);
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
  private List<SessionDTO<String>> getGARecentUser(GARequestDTO gaRequestDTO) throws Exception {

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


  private SessionChartDTO getGAActiveVisitChart(GARequestDTO gaRequestDTO) throws Exception {

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
  private List<SessionDTO<String>> getGAEvents(GARequestDTO gaRequestDTO) throws Exception {

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
  private List<SessionDTO<String>> getGARealTimeDevices(GARequestDTO gaRequestDTO) throws Exception {

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
  private List<SessionDTO<String>> getGAActiveVisitors(GARequestDTO gaRequestDTO) throws Exception {

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

  private List<CountryChartDTO> getGACountries(GARequestDTO gaRequestDTO) throws Exception {

    List<CountryChartDTO> countries = new ArrayList<>();

    // BigQuery 클라이언트 생성
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();

    // 날짜 범위 형식 (예: "YYYYMMDD")
    String startDate = formatDate(gaRequestDTO.getStartDate());
    String endDate = formatDate(gaRequestDTO.getEndDate());

    // BigQuery SQL 쿼리 작성
    // - geo.country 필드를 사용해 그룹화하고, event_name이 'session_start'인 이벤트의 개수를 집계합니다.
    String query = "SELECT " +
            "IFNULL(geo.country, 'Unknown') AS country, " +
            "COUNTIF(event_name = 'session_start') AS sessions " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE _TABLE_SUFFIX BETWEEN '" + startDate + "' " +
            "AND '" + endDate + "' " +
            "GROUP BY country " +
            "ORDER BY sessions DESC";

    QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();
    TableResult result = bigQuery.query(queryConfig);

    // 쿼리 결과 처리
    for (FieldValueList row : result.iterateAll()) {
      String countryName = (row.get("country") == null || row.get("country").isNull()) ? "Unknown" : row.get("country").getStringValue();
      String sessions = (row.get("sessions") == null || row.get("sessions").isNull()) ? "0" : row.get("sessions").getStringValue();

      // 예시: countryCode에 따른 좌표를 가져오는 메서드 호출
      List<Double> coordinates = getCountryData(countryName).getCoordinates();
      String svg = getCountryData(countryName).getSvg();

      // CountryChartDTO 객체 생성 (필드: country, sessions, coordinates)
      countries.add(new CountryChartDTO(countryName, sessions, coordinates, svg));
    }

    return countries;


//    // 결과 처리
//    List<CountryChartDTO> countries = new ArrayList<>();
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//      RunReportRequest request = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder()
//                      .setStartDate(gaRequestDTO.getStartDate())
//                      .setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
//              .addDimensions(Dimension.newBuilder().setName("countryId")) // 국가별 차원 추가
//              .addDimensions(Dimension.newBuilder().setName("cityId")) // 도시별 차원 추가
//              .build();
//
//
//      // 상위 페이지 보고서 실행
//      RunReportResponse response = analyticsData.runReport(request);
//
//      for (Row row : response.getRowsList()) {
//        String countryCode = row.getDimensionValues(0).getValue();
//        String cityCode = row.getDimensionValues(1).getValue();
//        String sessions = row.getMetricValues(0).getValue();
//
//        List<Double> coordinates = getCoordinates(countryCode);
//        countries.add(new CountryChartDTO(countryCode, sessions, coordinates));
//
//      }
//
//    }
//
//    return countries;

  }



  private List<SessionDTO<String>> getGAVisitors(GARequestDTO gaRequestDTO) throws Exception {


    List<SessionDTO<String>> visitors = new ArrayList<>();

    // BigQuery 클라이언트 생성
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();

    // 날짜 포맷 (예: YYYYMMDD 형식) - formatDate() 함수가 이를 반환한다고 가정합니다.
    String startDate = formatDate(gaRequestDTO.getStartDate());
    String endDate = formatDate(gaRequestDTO.getEndDate());

    // BigQuery SQL 쿼리 작성:
    // 1. WITH user_status: 사용자별로 'first_visit' 이벤트가 있는지 여부와 session_start 이벤트 수를 집계합니다.
    // 2. 메인 쿼리: 사용자별 집계 결과를 기반으로 신규(1) vs 기존(0) 방문자 그룹으로 나누고, 각 그룹의 세션 수 합계를 계산합니다.
    String query = "WITH user_status AS (\n" +
            "  SELECT \n" +
            "    user_pseudo_id,\n" +
            "    MAX(CASE WHEN event_name = 'first_visit' THEN 1 ELSE 0 END) AS is_new,\n" +
            "    COUNTIF(event_name = 'session_start') AS sessions\n" +
            "  FROM `" + projectId + ".analytics_" + propertyId + ".events_*`\n" +
            "  WHERE _TABLE_SUFFIX BETWEEN '" + startDate + "' AND '" + endDate + "'\n" +
            "  GROUP BY user_pseudo_id\n" +
            ")\n" +
            "SELECT \n" +
            "  CASE WHEN is_new = 1 THEN 'new' ELSE 'returning' END AS newVsReturning,\n" +
            "  SUM(sessions) AS sessions\n" +
            "FROM user_status\n" +
            "GROUP BY newVsReturning\n" +
            "ORDER BY sessions DESC\n" +
            "LIMIT 5";

    QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();
    TableResult result = bigQuery.query(queryConfig);

    for (FieldValueList row : result.iterateAll()) {
      String newVsReturning = (row.get("newVsReturning") == null || row.get("newVsReturning").isNull())
              ? "Unknown" : row.get("newVsReturning").getStringValue();
      String sessionsValue = (row.get("sessions") == null || row.get("sessions").isNull())
              ? "0" : row.get("sessions").getStringValue();
      visitors.add(new SessionDTO<>(newVsReturning, sessionsValue));
    }

    return visitors;

//    // 결과 처리
//    List<SessionDTO<String>> visitors = new ArrayList<>();
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//      RunReportRequest request = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder()
//                      .setStartDate(gaRequestDTO.getStartDate())
//                      .setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
//              .addDimensions(Dimension.newBuilder().setName("newVsReturning")) // 새로운 방문자 vs 기존 방문자
//              .build();
//
//
//      // 상위 페이지 보고서 실행
//      RunReportResponse response = analyticsData.runReport(request);
//
//      for (Row row : response.getRowsList()) {
//        String trafficSource = row.getDimensionValues(0).getValue();
//        String sessions = row.getMetricValues(0).getValue();
//
//
//        visitors.add(new SessionDTO(trafficSource, sessions));
//      }
//
//    }
//    return visitors;

  }



  private List<SessionDTO<String>> getGADevices(GARequestDTO gaRequestDTO) throws Exception {


    List<SessionDTO<String>> devices = new ArrayList<>();

    // BigQuery 클라이언트 생성
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();

    // SQL 쿼리 구성:
    // event_name이 'session_start'인 이벤트에서 device.category 값을 기준으로 세션 수를 집계
    String query = "SELECT " +
            "IFNULL(device.category, 'Unknown') AS deviceCategory, " +
            "COUNTIF(event_name = 'session_start') AS sessions " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE event_name = 'session_start' " +
            "AND _TABLE_SUFFIX BETWEEN '" + formatDate(gaRequestDTO.getStartDate()) + "' " +
            "AND '" + formatDate(gaRequestDTO.getEndDate()) + "' " +
            "GROUP BY deviceCategory " +
            "ORDER BY sessions DESC " +
            "LIMIT 5";

    QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();
    TableResult result = bigQuery.query(queryConfig);

    for (FieldValueList row : result.iterateAll()) {
      String deviceCategory = (row.get("deviceCategory") == null || row.get("deviceCategory").isNull())
              ? "Unknown" : row.get("deviceCategory").getStringValue();
      String sessions = (row.get("sessions") == null || row.get("sessions").isNull())
              ? "0" : row.get("sessions").getStringValue();
      devices.add(new SessionDTO<>(deviceCategory, sessions));
    }

    return devices;

//    // 결과 처리
//    List<SessionDTO<String>> devices = new ArrayList<>();
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//      RunReportRequest request = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder()
//                      .setStartDate(gaRequestDTO.getStartDate())
//                      .setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
//              .addDimensions(Dimension.newBuilder().setName("deviceCategory")) // 기기별 세션 보기
//              .build();
//
//
//      // 상위 페이지 보고서 실행
//      RunReportResponse response = analyticsData.runReport(request);
//
//      for (Row row : response.getRowsList()) {
//        String trafficSource = row.getDimensionValues(0).getValue();
//        String sessions = row.getMetricValues(0).getValue();
//
//
//        devices.add(new SessionDTO(trafficSource, sessions));
//      }
//
//    }
//    return devices;

  }

  /**
   * GARequestDTO의 날짜(예:"2024-03-01")를 BigQuery Export 테이블의 _TABLE_SUFFIX 형식(예:"20240301")으로 변환.
   */
  private String formatDate(String date) {
    return date.replace("-", "");
  }


  private GAResponseDTO getGASessions(GARequestDTO gaRequestDTO) throws Exception {

    // BigQuery 클라이언트 생성
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();

    // 메인 기간 쿼리 작성 (백틱(`)을 사용하여 테이블 참조)
    String mainQuery = "SELECT " +
            "COUNTIF(event_name = 'session_start') AS sessions, " +
            "COUNT(DISTINCT user_pseudo_id) AS activeUsers, " +
            "SUM(CAST((SELECT ep.value.int_value " +
            "     FROM UNNEST(event_params) AS ep " +
            "     WHERE ep.key = 'engagement_time_msec') AS INT64)) / 1000.0 AS userEngagementDuration " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE _TABLE_SUFFIX BETWEEN '" + formatDate(gaRequestDTO.getStartDate()) + "' " +
            "AND '" + formatDate(gaRequestDTO.getEndDate()) + "'";

    QueryJobConfiguration mainQueryConfig = QueryJobConfiguration.newBuilder(mainQuery).build();
    TableResult mainResult = bigQuery.query(mainQueryConfig);
    log.info("mainResult..." + mainResult);

    // 기본 값 설정
    String sessions = "0";
    String activeUsers = "0";
    String userEngagementDuration = "0";
    double avgSessionDuration = 0.0;

    // 첫 번째 행의 결과 파싱
    for (FieldValueList row : mainResult.iterateAll()) {
      sessions = (row.get("sessions") == null || row.get("sessions").isNull())
              ? "0" : row.get("sessions").getStringValue();
      activeUsers = (row.get("activeUsers") == null || row.get("activeUsers").isNull())
              ? "0" : row.get("activeUsers").getStringValue();
      userEngagementDuration = (row.get("userEngagementDuration") == null || row.get("userEngagementDuration").isNull())
              ? "0" : row.get("userEngagementDuration").getStringValue();

      double s = Double.parseDouble(sessions);
      double u = Double.parseDouble(userEngagementDuration);
      if (s != 0) {
        avgSessionDuration = u / s;
      }
      break; // 첫 번째 행만 사용
    }

    // 비교 기간 날짜 설정 (비교 날짜가 없다면 메인 기간과 동일하게 사용)
    String compareStartDate = (gaRequestDTO.getComparedStartDate() != null && !gaRequestDTO.getComparedStartDate().isEmpty())
            ? gaRequestDTO.getComparedStartDate() : gaRequestDTO.getStartDate();
    String compareEndDate = (gaRequestDTO.getComparedEndDate() != null && !gaRequestDTO.getComparedEndDate().isEmpty())
            ? gaRequestDTO.getComparedEndDate() : gaRequestDTO.getEndDate();

    // 비교 기간 쿼리 작성 (백틱(`) 사용)
    String compareQuery = "SELECT " +
            "COUNTIF(event_name = 'session_start') AS sessions, " +
            "COUNT(DISTINCT user_pseudo_id) AS activeUsers, " +
            "SUM(CAST((SELECT ep.value.int_value " +
            "     FROM UNNEST(event_params) AS ep " +
            "     WHERE ep.key = 'engagement_time_msec') AS INT64)) / 1000.0 AS userEngagementDuration " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE _TABLE_SUFFIX BETWEEN '" + formatDate(compareStartDate) + "' " +
            "AND '" + formatDate(compareEndDate) + "'";

    QueryJobConfiguration compareQueryConfig = QueryJobConfiguration.newBuilder(compareQuery).build();
    TableResult compareResult = bigQuery.query(compareQueryConfig);
    log.info("compareResult..." + compareResult);

    String sessionsCompared = "0";
    String activeUsersCompared = "0";
    String userEngagementDurationCompared = "0";
    double avgSessionDurationCompared = 0.0;

    for (FieldValueList row : compareResult.iterateAll()) {
      sessionsCompared = (row.get("sessions") == null || row.get("sessions").isNull())
              ? "0" : row.get("sessions").getStringValue();
      activeUsersCompared = (row.get("activeUsers") == null || row.get("activeUsers").isNull())
              ? "0" : row.get("activeUsers").getStringValue();
      userEngagementDurationCompared = (row.get("userEngagementDuration") == null || row.get("userEngagementDuration").isNull())
              ? "0" : row.get("userEngagementDuration").getStringValue();

      double s2 = Double.parseDouble(sessionsCompared);
      double u2 = Double.parseDouble(userEngagementDurationCompared);
      if (s2 != 0) {
        avgSessionDurationCompared = u2 / s2;
      }
      break;
    }

    // GAResponseDTO 생성
    GAResponseDTO gaResponseDTO = GAResponseDTO.builder()
            .sessions(sessions)
            .uniqueVisitors(activeUsers)
            .avgSessionDuration(Double.toString(avgSessionDuration))
            .sessionsCompared(calculatePercentageDifference(sessions, sessionsCompared))
            .uniqueVisitorsCompared(calculatePercentageDifference(activeUsers, activeUsersCompared))
            .avgSessionDurationCompared(calculatePercentageDifference(avgSessionDuration, avgSessionDurationCompared))
            .build();

      log.info("gaResponseDTO..." + gaResponseDTO);

    return gaResponseDTO;



//
//    GAResponseDTO gaResponseDTO = null; // 객체 초기화
//
//    String sellerEmail = gaRequestDTO.getSellerEmail();
//
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//
//      //첫번째 기간에 대한 요청
//      RunReportRequest request = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
//              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
//              .addMetrics(Metric.newBuilder().setName("userEngagementDuration")) // 사용자 참여도
////              .setDimensionFilter(filterByUserId)
//              .build();
//
//      // 첫번째 기간에 대한 Run the report
//      RunReportResponse response = analyticsData.runReport(request);
//
//      // 첫 번째 기간의 결과를 저장
//      String sessions = "0", uniqueVisitors = "0", userEngagementDuration = "0";
//
//      Double avgSessionDuration = 0.0;
//
//      if (!response.getRowsList().isEmpty()) {
//        Row row = response.getRows(0); // 첫 번째 행을 가져옴
//        sessions = row.getMetricValues(0).getValue(); //사이트 세션
//        uniqueVisitors = row.getMetricValues(1).getValue(); // 고유 방문자자
//        userEngagementDuration = row.getMetricValues(2).getValue(); //사용자 참여도
//        avgSessionDuration =  Double.parseDouble(userEngagementDuration) /  Double.parseDouble(sessions);  // avg.session duration
//      }
//
//
////////////////////////
//
//
//      // 두 번째 기간에 대한 요청
//      RunReportRequest compareRequest = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 사이트 세션
//              .addMetrics(Metric.newBuilder().setName("activeUsers")) // 고유 방문자
//              .addMetrics(Metric.newBuilder().setName("userEngagementDuration")) //사용자 참여도
//              .build();
//
//      // 두 번째 기간에 대한 보고서 실행
//      RunReportResponse compareResponse = analyticsData.runReport(compareRequest);
//
//      // 두 번째 기간의 결과를 저장
//      String sessionsCompared = "0", uniqueVisitorsCompared = "0", userEngagementDurationCompared = "0";
//
//      Double avgSessionDurationCompared = 0.0;
//
//      if (!compareResponse.getRowsList().isEmpty()) {
//        Row compareRow = compareResponse.getRows(0); // 첫 번째 행을 가져옴
//        sessionsCompared = compareRow.getMetricValues(0).getValue();
//        uniqueVisitorsCompared = compareRow.getMetricValues(1).getValue();
//        userEngagementDurationCompared = compareRow.getMetricValues(2).getValue(); //사용자 참여도
//        avgSessionDurationCompared =  Double.parseDouble(userEngagementDurationCompared) /  Double.parseDouble(sessionsCompared);  // avg.session duration
//
//      }
//
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
//    return gaResponseDTO; // 마지막 행의 객체 반환

  }


  private SessionChartDTO getGAChart(GARequestDTO gaRequestDTO) throws Exception {

    List<String> xaxis = new ArrayList<>();
    List<String> data = new ArrayList<>();

    ChartFilter filter = gaRequestDTO.getFilter();
    String dimensionExpression = "";

    // 필터에 따라 차원(날짜)를 결정합니다.
    if (filter == ChartFilter.DAY) {
      // event_date는 'YYYYMMDD' 형식이므로, 이를 'YYYY-MM-DD'로 포맷합니다.
      dimensionExpression = "FORMAT_DATE('%Y-%m-%d', PARSE_DATE('%Y%m%d', event_date))";
    } else if (filter == ChartFilter.WEEK) {
      // 주 단위: event_date를 날짜로 변환 후, 해당 주의 시작일(MONDAY 기준)로 변환
      dimensionExpression = "FORMAT_DATE('%Y-%m-%d', DATE_TRUNC(PARSE_DATE('%Y%m%d', event_date), WEEK(MONDAY)))";
    } else if (filter == ChartFilter.MONTH) {
      // 월 단위: event_date의 앞 6자리 (YYYYMM)
      dimensionExpression = "SUBSTR(event_date, 1, 6)";
    } else if (filter == ChartFilter.YEAR) {
      // 연 단위: event_date의 앞 4자리 (YYYY)
      dimensionExpression = "SUBSTR(event_date, 1, 4)";
    } else {
      // 기본값
      dimensionExpression = "event_date";
    }

    // BigQuery 쿼리 문자열 작성
    // 이 쿼리는 지정한 기간 내의 이벤트 테이블에서 event_name이 'session_start'인 행을 대상으로,
    // dimensionExpression으로 계산된 차원별 세션 수를 집계합니다.
    String query = "SELECT " + dimensionExpression + " AS chartDimension, " +
            "COUNTIF(event_name = 'session_start') AS sessions " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE _TABLE_SUFFIX BETWEEN '" + formatDate(gaRequestDTO.getStartDate()) + "' " +
            "AND '" + formatDate(gaRequestDTO.getEndDate()) + "' " +
            "GROUP BY chartDimension " +
            "ORDER BY chartDimension";

    // BigQuery 클라이언트 생성 및 쿼리 실행
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();
    QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();
    TableResult result = bigQuery.query(queryConfig);

    // 쿼리 결과 처리: 각 행에서 차원 값과 세션 수를 추출하여 xaxis와 data 리스트에 추가
    for (FieldValueList row : result.iterateAll()) {
      String chartDimension = row.get("chartDimension").getStringValue();
      String sessionsStr = row.get("sessions").getStringValue();
      xaxis.add(chartDimension);
      data.add(sessionsStr);
    }

    // SessionChartDTO 객체 생성하여 반환
    SessionChartDTO sessionChart = SessionChartDTO.builder()
            .xaxis(xaxis)
            .data(data)
            .build();

    return sessionChart;
//
//    List<String> xaxis = new ArrayList<>();
//    List<String> data = new ArrayList<>();
//
//    ChartFilter filter = gaRequestDTO.getFilter();
//
//    String filterString = "date";
//
//    if( filter != null) {
//      switch (filter) {
//
//        case DAY:
//          filterString = "date";
//          break;
//
//        case WEEK:
//          filterString = "week";
//          break;
//
//        case MONTH:
//          filterString = "month";
//          break;
//
//        case YEAR:
//          filterString = "year";
//          break;
//
//        default:
//          break;
//      }
//    }
//
//
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//      // 상위 페이지 요청
//      RunReportRequest.Builder requestBuilder = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
//              .addDimensions(Dimension.newBuilder().setName(filterString)); // day, week, month, year 세션 보기
//
//      // 필터가 WEEK 일 경우 'year' 차원 추가
//      if (filter == ChartFilter.WEEK) {
//        requestBuilder.addDimensions(Dimension.newBuilder().setName("year")); // year 세션 보기
//      }
//
//
//      // 날짜별 정렬 추가
//      requestBuilder.addOrderBys(OrderBy.newBuilder().setDimension(OrderBy.DimensionOrderBy.newBuilder().setDimensionName(filterString)).build());
//
//      RunReportRequest request = requestBuilder.build();
//
//      // 상위 페이지 보고서 실행
//      RunReportResponse response = analyticsData.runReport(request);
//
//
//      for (Row row : response.getRowsList()) {
//        String date = row.getDimensionValues(0).getValue(); //20240110 or 41 or 10 or 2024
//
//
//        String formattedDate = "";
//
//        //DAY라면
//        if(filter == ChartFilter.DAY) {
//
//          // yyyyMMdd 형식으로 LocalDate로 변환
//          DateTimeFormatter originalFormat = DateTimeFormatter.ofPattern("yyyyMMdd");
//          LocalDate yymmdd = LocalDate.parse(date, originalFormat);
//
//          // yyyy-MM-dd 형식으로 변환
//          DateTimeFormatter targetFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//          formattedDate = yymmdd.format(targetFormat);
//
//        } else if (filter == ChartFilter.WEEK) {
//          String year = row.getDimensionValues(1).getValue(); //20240110 or 41 or 10 or 2024
//
//          LocalDate weekStartDate = getWeekStartDate(Integer.parseInt(year), Integer.parseInt(date));
//          formattedDate = weekStartDate.toString();
//
//        } else {
//          formattedDate = date;
//        }
//
//
//        String sessions = row.getMetricValues(0).getValue();
//
//        xaxis.add(formattedDate);
//        data.add(sessions);
//
//      }
//
//    }
//
//
//    // sessionChart 객체 생성
//    SessionChartDTO sessionChart = SessionChartDTO.builder()
//            .xaxis(xaxis)  // xaxis 리스트 추가
//            .data(data)    // data 리스트 추가
//            .build();
//
//    return sessionChart;

  }



  private List<SessionDTO<String>> getGATopSources(GARequestDTO gaRequestDTO) throws Exception {

    List<SessionDTO<String>> topSources = new ArrayList<>();

    // BigQuery 클라이언트 생성
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();

    // 상위 소스 쿼리 작성
    // event_name이 'session_start'인 이벤트에서 traffic_source.source 필드를 기준으로 세션 수 집계
    String topSourcesQuery = "SELECT " +
            "IFNULL(traffic_source.source, 'Unknown') AS trafficSource, " +
            "COUNT(*) AS sessions " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE event_name = 'session_start' " +
            "AND _TABLE_SUFFIX BETWEEN '" + formatDate(gaRequestDTO.getStartDate()) + "' " +
            "AND '" + formatDate(gaRequestDTO.getEndDate()) + "' " +
            "GROUP BY trafficSource " +
            "ORDER BY sessions DESC " +
            "LIMIT 5";

    QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(topSourcesQuery).build();
    TableResult result = bigQuery.query(queryConfig);

    log.info("...result.." + result);
    for (FieldValueList row : result.iterateAll()) {
      String trafficSource = (row.get("trafficSource") == null || row.get("trafficSource").isNull())
              ? "Unknown" : row.get("trafficSource").getStringValue();
      String sessions = (row.get("sessions") == null || row.get("sessions").isNull())
              ? "0" : row.get("sessions").getStringValue();
      topSources.add(new SessionDTO<>(trafficSource, sessions));
    }

    return topSources;


//    // 결과 처리
//    List<SessionDTO<String>> topPages = new ArrayList<>();
//
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//
//      // 상위 페이지 요청
//      RunReportRequest topSourcesRequest = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDimensions(Dimension.newBuilder().setName("manualSource"))  // 트래픽 소스
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
//              .setLimit(5)
//              .build();
//
//      // 상위 페이지 보고서 실행
//      RunReportResponse topSourcesResponse = analyticsData.runReport(topSourcesRequest);
//
//      for (Row row : topSourcesResponse.getRowsList()) {
//        String trafficSource = row.getDimensionValues(0).getValue();
//        String sessions = row.getMetricValues(0).getValue();
//
//
//        topPages.add(new SessionDTO(trafficSource, sessions)); // TopPageDTO 객체 생성
//      }
//
//    }
//    return topPages;

  }


  private List<SessionDTO<String>> getGATopPages(GARequestDTO gaRequestDTO) throws Exception {

    List<SessionDTO<String>> topPages = new ArrayList<>();

    // BigQuery 클라이언트 생성
    BigQuery bigQuery = BigQueryOptions.getDefaultInstance().getService();

    // 상위 페이지 쿼리 작성
    // 각 페이지별 session_start 이벤트 수(세션 수)를 집계
    String topPagesQuery = "SELECT " +
            "IFNULL((SELECT ep.value.string_value " +
            "        FROM UNNEST(event_params) AS ep " +
            "        WHERE ep.key = 'page_location'), 'Unknown') AS pageLocation, " +
            "COUNT(*) AS sessions " +
            "FROM `" + projectId + ".analytics_" + propertyId + ".events_*` " +
            "WHERE event_name = 'page_view' " +
            "AND _TABLE_SUFFIX BETWEEN '" + formatDate(gaRequestDTO.getStartDate()) + "' " +
            "AND '" + formatDate(gaRequestDTO.getEndDate()) + "' " +
            "GROUP BY pageLocation " +
            "ORDER BY sessions DESC " +
            "LIMIT 5";

    QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(topPagesQuery).build();
    TableResult result = bigQuery.query(queryConfig);

    // 결과 처리
    for (FieldValueList row : result.iterateAll()) {
      String pagePath = row.get("pageLocation").getStringValue();
      String sessions = row.get("sessions").getStringValue();
      topPages.add(new SessionDTO<>(pagePath, sessions));
    }

    return topPages;



    //    // 결과 처리
//    List<SessionDTO<String>> topPages = new ArrayList<>();
//
//    BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
//            .setCredentialsProvider(() -> googleCredentials)
//            .build();
//
//    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create(settings)) {
//
//      // 상위 페이지 요청
//      RunReportRequest topPagesRequest = RunReportRequest.newBuilder()
//              .setProperty("properties/" + propertyId)
//              .addDimensions(Dimension.newBuilder().setName("pagePath")) // 페이지 경로 기준
//              .addDateRanges(DateRange.newBuilder().setStartDate(gaRequestDTO.getStartDate()).setEndDate(gaRequestDTO.getEndDate()))
//              .addMetrics(Metric.newBuilder().setName("sessions")) // 세션 수 기준
//              .setLimit(5)
//              .build();
//
//      // 상위 페이지 보고서 실행
//      RunReportResponse topPagesResponse = analyticsData.runReport(topPagesRequest);
//
//
//      for (Row row : topPagesResponse.getRowsList()) {
//        String pagePath = row.getDimensionValues(0).getValue();
//        String pageSessions = row.getMetricValues(0).getValue();
//        topPages.add(new SessionDTO(pagePath, pageSessions)); // TopPageDTO 객체 생성
//      }
//
//    }
//    return topPages;

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


  public CountryDataDTO getCountryData(String countryName) {
    try {

      String url = String.format("https://restcountries.com/v3.1/name/" + countryName + "?fullText=true");

      RestTemplate restTemplate = new RestTemplate();
      ResponseEntity<CountryResponseDTO[]> responseEntity = restTemplate.getForEntity(url, CountryResponseDTO[].class);
      CountryResponseDTO[] response = responseEntity.getBody();

      if (response != null && response.length > 0) {
        // flags가 존재하는 객체를 찾기
        Optional<CountryResponseDTO> validResponse = Arrays.stream(response)
                .filter(dto -> dto.getFlags() != null && dto.getFlags().getSvg() != null)
                .findFirst();

        if (validResponse.isPresent() && validResponse.get().getLatlng() != null) {
          return new CountryDataDTO(validResponse.get().getLatlng(), validResponse.get().getFlags().getSvg());
        }
      }
    } catch (Exception e) {
      System.out.println("Error fetching data for country: " + countryName + ". Returning default values.");
    }

    // 기본값 반환
    return new CountryDataDTO(Arrays.asList(0.0, 0.0), "");
  }

}
