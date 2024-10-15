package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.ChartRequestDTO;
import org.zerock.mallapi.dto.ChartResponseDTO;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.service.DashboardService;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/salesOverview")
  public DataResponseDTO<ChartResponseDTO> salesList(ChartRequestDTO chartRequestDTO) {

    log.info("ChartRequestDTO.." + chartRequestDTO);

    return DataResponseDTO.of(dashboardService.getSalesList(chartRequestDTO));
  }

}

