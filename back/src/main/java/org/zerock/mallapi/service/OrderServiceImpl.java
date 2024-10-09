package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Order;
import org.zerock.mallapi.dto.OrderDTO;
import org.zerock.mallapi.repository.OrderRepository;

import java.time.LocalDateTime;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService{

  private final OrderRepository orderRepository;

  @Override
  public Long register(OrderDTO orderDTO, String email) {


    Order order = dtoToEntity(orderDTO,email);

    //시간
    order.setCreatedAt(LocalDateTime.now());
    order.setUpdatedAt(LocalDateTime.now());

    Order result = orderRepository.save(order);


    return result.getId();
  }

  private Order dtoToEntity(OrderDTO orderDTO, String email){

    Member member = Member.builder().email(email).build();

    Order order = Order.builder().orderId(orderDTO.getOrderId())
            .totalAmount(orderDTO.getTotalAmount())
            .status(orderDTO.getStatus())
            .deliveryInfo(orderDTO.getDeliveryInfo())
            .owner(member)
            .build();

    return order;

  }

}

