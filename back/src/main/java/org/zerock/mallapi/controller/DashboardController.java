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

    log.info("salesOverviewCard.." + chartRequestDTO);

    return DataResponseDTO.of(dashboardService.getSalesCardList(chartRequestDTO));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesOverviewChart")
  public DataResponseDTO<ChartResponseDTO> salesList(ChartRequestDTO chartRequestDTO) {

    log.info("ChartRequestDTO.." + chartRequestDTO);

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

    log.info("ChartRequestDTO.." + topCustomerRequestDTO);


    return DataResponseDTO.of(dashboardService.getTopCustomerList(topCustomerRequestDTO));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesProducts")
  public DataResponseDTO<List<TopProductResponseDTO>> topProductList(TopCustomerRequestDTO topCustomerRequestDTO) {

    log.info("ChartRequestDTO.." + topCustomerRequestDTO);


    return DataResponseDTO.of(dashboardService.getTopProductList(topCustomerRequestDTO));
  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesByCountry")
  public DataResponseDTO<List<MapSalesResponseDTO>> getByCountryList(TopCustomerRequestDTO topCustomerRequestDTO) {

    log.info("ChartRequestDTO.." + topCustomerRequestDTO);


    return DataResponseDTO.of(dashboardService.getByCountryList(topCustomerRequestDTO));
  }


  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @GetMapping("/traffic")
  public DataResponseDTO<GAResponseDTO> getAnalytics(GARequestDTO gaRequestDTO) {

    log.info("googleAnalyticsRequestDTO " + gaRequestDTO);

//    return DataResponseDTO.of(dashboardService.test(gaRequestDTO));

    return DataResponseDTO.of(dashboardService.getGoogleAnalytics(gaRequestDTO));

  }


}


