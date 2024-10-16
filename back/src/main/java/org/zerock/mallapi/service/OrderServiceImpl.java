package org.zerock.mallapi.service;

import ch.qos.logback.classic.pattern.DateConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.controller.formatter.LocalDateFormatter;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.OrderRepository;
import org.zerock.mallapi.util.GeneralException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService{

  private final OrderRepository orderRepository;

  private final MemberService memberService;

  @Override
  public void register(OrderRequestDTO orderRequestDTO, String email) {

    //orderDTO의 carts만큼 저장되어야한다.

    log.info(".... " + orderRequestDTO);

    if (orderRequestDTO.getCarts() != null && !orderRequestDTO.getCarts().isEmpty()) {
      for (CartItemListDTO cartItem : orderRequestDTO.getCarts()) {

        // 주문 엔티티 생성
        Order order = dtoToEntity(orderRequestDTO, email, cartItem);

        //시간
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());


        orderRepository.save(order);

      }

    }
  }

  @Override
  public List<OrderDTO> getList(String orderId) {

    List<Order> orders = orderRepository.selectListByOrderId(orderId);

    // 리스트가 비어 있으면 예외를 발생시킨다.
    if (orders.isEmpty()) {
      throw new GeneralException("해당 주문번호에 해당하는 주문내역이 없습니다...,"); // throw new NoSuchElementException("해당 주문번호에 해당하는 주문내역이 없습니다..., " + paymentSuccessDTO.getOrderId());
   }

    List<OrderDTO> responseDTO = orders.stream().map(this::convertToDTO).collect(Collectors.toList());


    return responseDTO;
  }

  @Override
  public OrderDTO get(Long id) {

    //read
    Optional<Order> result = orderRepository.findById(id);

    Order order = result.orElseThrow();

    //dto 변환
    OrderDTO orderDTO = convertToDTO(order);

    return orderDTO;
  }

  @Override
  public List<Object[]> getSalesOverview(ChartRequestDTO chartRequestDTO) {

    log.info("chartRequestDTO................." + chartRequestDTO);

    DateTimeFormatter dateformatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDate startDate = LocalDate.parse(chartRequestDTO.getStartDate(), dateformatter);
    LocalDateTime startDateTime = startDate.atStartOfDay();//startDate의 끝시간 xx:00:00

    LocalDate endDate = LocalDate.parse(chartRequestDTO.getEndDate(), dateformatter);
    LocalDateTime endDateTime = endDate.atTime(23, 59, 59);    // endDate의 끝 시간을 xx:59:59으로 설정

    String sellerEmail = chartRequestDTO.getSellerEmail();

    ChartFilter filter = chartRequestDTO.getFilter();

    if (filter != null) {
      switch (filter) {
        case DAY:
          return orderRepository.findSalesSummaryByDay(sellerEmail, startDateTime, endDateTime);

        case WEEK:
          return orderRepository.findSalesSummaryByWeek(sellerEmail, startDateTime, endDateTime);

        case MONTH:
          return orderRepository.findSalesSummaryByMonth(sellerEmail, startDateTime, endDateTime);

        case YEAR:
          return orderRepository.findSalesSummaryByYear(sellerEmail, startDateTime, endDateTime);

        default:
          return null;

      }

    }

    return null;

  }

  @Override
  public List<Object[]> getOrderOverview(ChartRequestDTO chartRequestDTO) {

    log.info("chartRequestDTO................." + chartRequestDTO);

    DateTimeFormatter dateformatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDate startDate = LocalDate.parse(chartRequestDTO.getStartDate(), dateformatter);
    LocalDateTime startDateTime = startDate.atStartOfDay();//startDate의 끝시간 xx:00:00

    LocalDate endDate = LocalDate.parse(chartRequestDTO.getEndDate(), dateformatter);
    LocalDateTime endDateTime = endDate.atTime(23, 59, 59);    // endDate의 끝 시간을 xx:59:59으로 설정

    String sellerEmail = chartRequestDTO.getSellerEmail();

    ChartFilter filter = chartRequestDTO.getFilter();

    if (filter != null) {
      switch (filter) {
        case DAY:
          return orderRepository.findOrderSummaryByDay(sellerEmail, startDateTime, endDateTime);

        case WEEK:
          return orderRepository.findOrderSummaryByWeek(sellerEmail, startDateTime, endDateTime);

        case MONTH:
          return orderRepository.findOrderSummaryByMonth(sellerEmail, startDateTime, endDateTime);

        case YEAR:
          return orderRepository.findOrderSummaryByYear(sellerEmail, startDateTime, endDateTime);

        default:
          return null;

      }

    }

    return null;

  }


  private OrderDTO convertToDTO(Order order) {

    MemberDTO memberDTO = memberService.entityToDTO(order.getOwner());

    OrderDTO orderDTO = OrderDTO.builder()
            .id(order.getId())
            .orderId(order.getOrderId())
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus())
            .deliveryInfo(order.getDeliveryInfo())
            .productInfo(order.getProductInfo())
            .tax(order.getTax())
            .shippingFee(order.getShippingFee())
            .owner(memberDTO)
            .build();

    orderDTO.setCreatedAt(order.getCreatedAt());
    orderDTO.setUpdatedAt(order.getUpdatedAt());

    return orderDTO;

  }


  private Order dtoToEntity(OrderRequestDTO orderRequestDTO, String email, CartItemListDTO cartItem){

    Member member = Member.builder().email(email).build();

    Member seller = Member.builder().email(cartItem.getSellerEmail()).build();

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
            .thumbnailUrl(cartItem.getImageFile())
            .build();


    Order order = Order.builder()
            .orderId(orderRequestDTO.getOrderId())
            .totalAmount(orderRequestDTO.getTotalAmount())
            .status(orderRequestDTO.getStatus())
            .deliveryInfo(orderRequestDTO.getDeliveryInfo())
            .productInfo(productInfo)
            .owner(member)
            .shippingFee(orderRequestDTO.getShippingFee())
            .tax(orderRequestDTO.getTax())
            .seller(seller)
            .build();

    return order;

  }

}

