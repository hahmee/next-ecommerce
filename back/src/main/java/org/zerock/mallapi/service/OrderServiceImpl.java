package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.ColorTag;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Order;
import org.zerock.mallapi.domain.OrderProductInfo;
import org.zerock.mallapi.dto.CartItemListDTO;
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

    //orderDTO의 carts만큼 저장되어야한다.

    log.info(".... " + orderDTO);

    if (orderDTO.getCarts() != null && !orderDTO.getCarts().isEmpty()) {
      for (CartItemListDTO cartItem : orderDTO.getCarts()) {

        // 주문 엔티티 생성
        Order order = dtoToEntity(orderDTO, email,cartItem);

        //시간
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());


        Order result = orderRepository.save(order);

      }

    }


    return null;
  }

  private Order dtoToEntity(OrderDTO orderDTO, String email, CartItemListDTO cartItem){

    Member member = Member.builder().email(email).build();

    ColorTag colorTag = ColorTag.builder()
            .id(cartItem.getColor().getId())
            .text(cartItem.getColor().getText())
            .color(cartItem.getColor().getColor())
            .build();

    OrderProductInfo productInfo = OrderProductInfo.builder()
            .pno(cartItem.getPno())
            .pname(cartItem.getPname())
            .price(cartItem.getPrice())
            .size(cartItem.getSize())
            .color(colorTag)
            .qty(cartItem.getQty())
            .build();


    Order order = Order.builder()
            .orderId(orderDTO.getOrderId())
            .totalAmount(orderDTO.getTotalAmount())
            .status(orderDTO.getStatus())
            .deliveryInfo(orderDTO.getDeliveryInfo())
            .productInfo(productInfo)
//            .productInfo(orderDTO.getProductInfo())
            .owner(member)
            .build();

    return order;

  }

}

