package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

@Transactional
public interface DashboardService {
  CardResponseDTO getSalesCardList(ChartRequestDTO chartRequestDTO);

  ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO);

  ChartResponseDTO getOrderList(ChartRequestDTO chartRequestDTO);

  ChartResponseDTO getOrderAvgList(ChartRequestDTO chartRequestDTO);

}
