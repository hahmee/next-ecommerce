package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
  @GetMapping("/salesOverviewCard")
  public DataResponseDTO<CardResponseDTO> salesCardList(ChartRequestDTO chartRequestDTO, @AuthenticationPrincipal MemberDTO memberDTO) {

    String sellerEmail = memberDTO.getEmail(); // JWT에서 복원된 사용자 정보

    return DataResponseDTO.of(dashboardService.getSalesCardList(chartRequestDTO, sellerEmail));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
  @GetMapping("/salesOverviewChart")
  public DataResponseDTO<ChartResponseDTO> salesList(ChartRequestDTO chartRequestDTO, @AuthenticationPrincipal MemberDTO memberDTO) {

    String sellerEmail = memberDTO.getEmail(); // JWT에서 복원된 사용자 정보

    ChartContext context = chartRequestDTO.getContext();

    switch (context) {
      case TOPSALES:
        return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO, sellerEmail));

      case ORDERS:
        return DataResponseDTO.of(dashboardService.getOrderList(chartRequestDTO, sellerEmail));

      case AVGORDERS:
        return DataResponseDTO.of(dashboardService.getOrderAvgList(chartRequestDTO, sellerEmail));

      case TOTALVIEWS:
        return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO, sellerEmail));

      default:
        break;

    }

    return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO, sellerEmail));
  }


  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
  @GetMapping("/salesCustomers")
  public DataResponseDTO<List<TopCustomerResponseDTO>> topCustomerList(TopCustomerRequestDTO topCustomerRequestDTO,  @AuthenticationPrincipal MemberDTO memberDTO) {

    String sellerEmail = memberDTO.getEmail(); // JWT에서 복원된 사용자 정보

    return DataResponseDTO.of(dashboardService.getTopCustomerList(topCustomerRequestDTO, sellerEmail));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
  @GetMapping("/salesProducts")
  public DataResponseDTO<List<TopProductResponseDTO>> topProductList(TopCustomerRequestDTO topCustomerRequestDTO, @AuthenticationPrincipal MemberDTO memberDTO) {

    String sellerEmail = memberDTO.getEmail(); // JWT에서 복원된 사용자 정보
    return DataResponseDTO.of(dashboardService.getTopProductList(topCustomerRequestDTO, sellerEmail));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
  @GetMapping("/salesByCountry")
  public DataResponseDTO<List<MapSalesResponseDTO>> getByCountryList(TopCustomerRequestDTO topCustomerRequestDTO, @AuthenticationPrincipal MemberDTO memberDTO) {

    String sellerEmail = memberDTO.getEmail();
    return DataResponseDTO.of(dashboardService.getByCountryList(topCustomerRequestDTO, sellerEmail));
  }

  //original
  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/traffic")
  public DataResponseDTO<GAResponseDTO> getAnalytics(GARequestDTO gaRequestDTO) {
    long startTime = System.currentTimeMillis();


    GAResponseDTO gaResponseDTO = dashboardService.getGoogleAnalytics(gaRequestDTO);

    long endTime = System.currentTimeMillis();
    long duration = endTime - startTime;

    return DataResponseDTO.of(gaResponseDTO);

  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/trafficTop")
  public DataResponseDTO<GAResponseTopDTO> getAnalyticsTop(GARequestDTO gaRequestDTO) {
    GAResponseTopDTO gaResponseTopDTO = dashboardService.getGoogleAnalyticsTop(gaRequestDTO);

    return DataResponseDTO.of(gaResponseTopDTO);
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/trafficMiddle")
  public DataResponseDTO<GAResponseMiddleDTO> getAnalyticsMiddle(GARequestDTO gaRequestDTO) {
    GAResponseMiddleDTO gaResponseMiddleDTO = dashboardService.getGoogleAnalyticsMiddle(gaRequestDTO);
    return DataResponseDTO.of(gaResponseMiddleDTO);
  }



  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/trafficBottom")
  public DataResponseDTO<GAResponseBottomDTO> getAnalyticsBottom(GARequestDTO gaRequestDTO) {

    GAResponseBottomDTO gaResponseBottomDTO = dashboardService.getGoogleAnalyticsBottom(gaRequestDTO);


    return DataResponseDTO.of(gaResponseBottomDTO);
  }



  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/real-time-top")
  public DataResponseDTO<String> gaRealTimeTop(GARequestDTO gaRequestDTO) {


    GARealTimeResponseTopDTO gaRealTimeResponseTopDTO = dashboardService.getRealtimeTop(gaRequestDTO);

//    return DataResponseDTO.of(gaRealTimeResponseTopDTO);
    return DataResponseDTO.of("SUCCESS");

  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/real-time-bottom")
  public DataResponseDTO<GARealTimeResponseBottomDTO> gaRealTimeBottom(GARequestDTO gaRequestDTO) {

    GARealTimeResponseBottomDTO gaRealTimeResponseBottomDTO = dashboardService.getRealtimeBottom(gaRequestDTO);


    return DataResponseDTO.of(gaRealTimeResponseBottomDTO);

  }


}


