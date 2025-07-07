package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface DashboardService {

  CardResponseDTO getSalesCardList(ChartRequestDTO chartRequestDTO, String sellerEmail);

  ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO, String sellerEmail);

  ChartResponseDTO getOrderList(ChartRequestDTO chartRequestDTO, String sellerEmail);

  ChartResponseDTO getOrderAvgList(ChartRequestDTO chartRequestDTO, String sellerEmail);

  List<TopCustomerResponseDTO> getTopCustomerList(TopCustomerRequestDTO topCustomerRequestDTO, String sellerEmail);

  List<TopProductResponseDTO> getTopProductList(TopCustomerRequestDTO topCustomerRequestDTO, String sellerEmail);

  List<MapSalesResponseDTO> getByCountryList(TopCustomerRequestDTO topCustomerRequestDTO, String sellerEmail);

  GAResponseDTO getGoogleAnalytics(GARequestDTO gaRequestDTO);

  GAResponseTopDTO getGoogleAnalyticsTop(GARequestDTO gaRequestDTO);

  GAResponseMiddleDTO getGoogleAnalyticsMiddle(GARequestDTO gaRequestDTO);

  GAResponseBottomDTO getGoogleAnalyticsBottom(GARequestDTO gaRequestDTO);

  GARealTimeResponseTopDTO getRealtimeTop(GARequestDTO gaRequestDTO);

  GARealTimeResponseBottomDTO getRealtimeBottom(GARequestDTO gaRequestDTO);

}

