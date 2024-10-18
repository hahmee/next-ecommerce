package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Order;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface OrderService {

  void register(OrderRequestDTO orderRequestDTO, String email);

  List<OrderDTO> getList(String orderId);

  OrderDTO get(Long id);

  //Dashboard사용
  SalesCardDTO getOverviewCards(ChartRequestDTO chartRequestDTO);

  List<Object[]> getSalesOverview(ChartRequestDTO chartRequestDTO);

  List<Object[]> getOrderOverview(ChartRequestDTO chartRequestDTO);

  List<Object[]> getOrderAvgOverview(ChartRequestDTO chartRequestDTO);

}
