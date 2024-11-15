package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface DashboardService {

  CardResponseDTO getSalesCardList(ChartRequestDTO chartRequestDTO);

  ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO);

  ChartResponseDTO getOrderList(ChartRequestDTO chartRequestDTO);

  ChartResponseDTO getOrderAvgList(ChartRequestDTO chartRequestDTO);

  List<TopCustomerResponseDTO> getTopCustomerList(TopCustomerRequestDTO topCustomerRequestDTO);

  List<TopProductResponseDTO> getTopProductList(TopCustomerRequestDTO topCustomerRequestDTO);

  List<MapSalesResponseDTO> getByCountryList(TopCustomerRequestDTO topCustomerRequestDTO);

  GAResponseDTO getGoogleAnalytics(GARequestDTO gaRequestDTO);

  GARealTimeResponseDTO getRealtime(GARequestDTO gaRequestDTO);
}

