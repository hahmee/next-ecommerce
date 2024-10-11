package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.OrderDTO;
import org.zerock.mallapi.dto.OrderRequestDTO;

import java.util.List;

@Transactional
public interface OrderService {

  void register(OrderRequestDTO orderRequestDTO, String email);

  List<OrderDTO> getList(String orderId);

}
