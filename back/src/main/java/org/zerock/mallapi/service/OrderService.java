package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Order;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface OrderService {

  void register(OrderRequestDTO orderRequestDTO, String email);

  List<OrderDTO> getList(String orderId);

  OrderDTO get(Long id);

  //Dashboard사용
  SalesCardDTO getOverviewCards(ChartRequestDTO chartRequestDTO, String sellerEmail);

  List<Object[]> getSalesOverview(ChartRequestDTO chartRequestDTO, String sellerEmail);

  List<Object[]> getOrderOverview(ChartRequestDTO chartRequestDTO, String sellerEmail);

  List<Object[]> getOrderAvgOverview(ChartRequestDTO chartRequestDTO, String sellerEmail);

  List<Object[]> getTopCustomers(TopCustomerRequestDTO topCustomerRequestDTO, String sellerEmail);

  List<Object[]> getTopProducts(TopCustomerRequestDTO topCustomerRequestDTO, String sellerEmail);

  OrderDTO convertToDTO(Order order);

  Member getByOrderId(String orderId); // 주문 ID는 중복 가능

}
