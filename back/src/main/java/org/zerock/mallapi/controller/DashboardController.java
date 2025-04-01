package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.domain.ChartContext;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.DashboardService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesOverviewCard")
  public DataResponseDTO<CardResponseDTO> salesCardList(ChartRequestDTO chartRequestDTO) {

    return DataResponseDTO.of(dashboardService.getSalesCardList(chartRequestDTO));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesOverviewChart")
  public DataResponseDTO<ChartResponseDTO> salesList(ChartRequestDTO chartRequestDTO) {

    ChartContext context = chartRequestDTO.getContext();

    switch (context) {
      case TOPSALES:
        return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO));

      case ORDERS:
        return DataResponseDTO.of(dashboardService.getOrderList(chartRequestDTO));

      case AVGORDERS:
        return DataResponseDTO.of(dashboardService.getOrderAvgList(chartRequestDTO));

      case TOTALVIEWS:
        return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO));

      default:
        break;

    }

    return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO));
  }


  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesCustomers")
  public DataResponseDTO<List<TopCustomerResponseDTO>> topCustomerList(TopCustomerRequestDTO topCustomerRequestDTO) {

    return DataResponseDTO.of(dashboardService.getTopCustomerList(topCustomerRequestDTO));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesProducts")
  public DataResponseDTO<List<TopProductResponseDTO>> topProductList(TopCustomerRequestDTO topCustomerRequestDTO) {

    return DataResponseDTO.of(dashboardService.getTopProductList(topCustomerRequestDTO));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesByCountry")
  public DataResponseDTO<List<MapSalesResponseDTO>> getByCountryList(TopCustomerRequestDTO topCustomerRequestDTO) {

    return DataResponseDTO.of(dashboardService.getByCountryList(topCustomerRequestDTO));
  }

  //original
  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/traffic")
  public DataResponseDTO<GAResponseDTO> getAnalytics(GARequestDTO gaRequestDTO) {
    long startTime = System.currentTimeMillis();


    GAResponseDTO gaResponseDTO = dashboardService.getGoogleAnalytics(gaRequestDTO);

    long endTime = System.currentTimeMillis();
    long duration = endTime - startTime;

    return DataResponseDTO.of(gaResponseDTO);

  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/trafficTop")
  public DataResponseDTO<GAResponseTopDTO> getAnalyticsTop(GARequestDTO gaRequestDTO) {

    GAResponseTopDTO gaResponseTopDTO = dashboardService.getGoogleAnalyticsTop(gaRequestDTO);

    return DataResponseDTO.of(gaResponseTopDTO);
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/trafficMiddle")
  public DataResponseDTO<GAResponseMiddleDTO> getAnalyticsMiddle(GARequestDTO gaRequestDTO) {
    GAResponseMiddleDTO gaResponseMiddleDTO = dashboardService.getGoogleAnalyticsMiddle(gaRequestDTO);
    return DataResponseDTO.of(gaResponseMiddleDTO);
  }



  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/trafficBottom")
  public DataResponseDTO<GAResponseBottomDTO> getAnalyticsBottom(GARequestDTO gaRequestDTO) {

    GAResponseBottomDTO gaResponseBottomDTO = dashboardService.getGoogleAnalyticsBottom(gaRequestDTO);


    return DataResponseDTO.of(gaResponseBottomDTO);
  }



  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/real-time-top")
  public DataResponseDTO<String> gaRealTimeTop(GARequestDTO gaRequestDTO) {

    GARealTimeResponseTopDTO gaRealTimeResponseTopDTO = dashboardService.getRealtimeTop(gaRequestDTO);

    log.info("gaRealTimeResponseTopDTO....." + gaRealTimeResponseTopDTO);
//
//    return DataResponseDTO.of(gaRealTimeResponseTopDTO);
    return DataResponseDTO.of("SUCCESS");

  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/real-time-bottom")
  public DataResponseDTO<GARealTimeResponseBottomDTO> gaRealTimeBottom(GARequestDTO gaRequestDTO) {

    GARealTimeResponseBottomDTO gaRealTimeResponseBottomDTO = dashboardService.getRealtimeBottom(gaRequestDTO);


    return DataResponseDTO.of(gaRealTimeResponseBottomDTO);

  }


}


