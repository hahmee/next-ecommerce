package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.OrderDTO;

@Transactional
public interface OrderService {

  Long register(OrderDTO orderDTO, String email);


}
