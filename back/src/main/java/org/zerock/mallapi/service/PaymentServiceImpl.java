package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.OrderPaymentRepository;
import org.zerock.mallapi.repository.OrderRepository;
import org.zerock.mallapi.repository.PaymentRepository;
import org.zerock.mallapi.util.GeneralException;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService{

  @Value("${payment.toss.secret.key}")
  private String tossSecretKey;

  @Value("${payment.toss.confirm.url}")
  private String tossConfirmUrl;

  private final PaymentRepository paymentRepository;

  private final OrderRepository orderRepository;

  private final OrderPaymentRepository orderPaymentRepository;

  private final MemberService memberService;


  @Override
  public PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, String email) {
    log.info("이게 언제 불러와질까? ");

    //결제 승인 로직
    PaymentSuccessDTO paymentSuccessDTO = requestPaymentAccept(paymentRequestDTO);

    log.info("===paymentSuccessDTO === " + paymentSuccessDTO);

    //DONE이라면
    if(paymentSuccessDTO.getStatus() == TossPaymentStatus.DONE) {

      //결제 객체의 정보 중 필요한 정보들을 서버에 저장한다.
      Payment payment = dtoToEntity(paymentSuccessDTO, email);

      //시간
      payment.setCreatedAt(LocalDateTime.now());
      payment.setUpdatedAt(LocalDateTime.now());

      paymentRepository.save(payment);

      //결제 결과를 바탕으로 주문의 상태에 반영한다.

      //step1 read (order_id로 찾는다)
      List<Order> orders = orderRepository.selectListByOrderId(paymentSuccessDTO.getOrderId());

      // 리스트가 비어 있으면 예외를 발생시킨다.
      if (orders.isEmpty()) {
        throw new GeneralException("해당 주문번호에 해당하는 주문내역이 없습니다...,");
//        throw new NoSuchElementException("해당 주문번호에 해당하는 주문내역이 없습니다..., " + paymentSuccessDTO.getOrderId());
      }

      //step2 상태 변경 - for문
      for(Order order: orders) {

        order.changeStatus(OrderStatus.PAYMENT_CONFIRMED);

        //시간도 변경
        order.setUpdatedAt(LocalDateTime.now());

        //step3 저장
        orderRepository.save(order);


        //각 주문들에 결제 정보를 기록해둔다.
        OrderPayment orderPayment = OrderPayment.builder()
                .orderId(order.getId())
                .paymentId(payment.getId())
                .build();

        orderPaymentRepository.save(orderPayment);

      }

    }


    return paymentSuccessDTO;
  }

  private Payment dtoToEntity(PaymentSuccessDTO paymentSuccessDTO, String email){

    Member member = Member.builder().email(email).build();

    Payment payment = Payment.builder()
            .orderId(paymentSuccessDTO.getOrderId())
            .paymentKey(paymentSuccessDTO.getPaymentKey())
            .status(paymentSuccessDTO.getStatus())
            .method(paymentSuccessDTO.getMethod())
            .type(paymentSuccessDTO.getType())
            .totalAmount(paymentSuccessDTO.getTotalAmount())
            .orderName(paymentSuccessDTO.getOrderName())
            .owner(member)
            .build();

    return payment;

  }

  @Override
  public PaymentFailDTO tossPaymentFail(PaymentRequestDTO paymentRequestDTO) {



    return null;
  }

  @Override
  public List<PaymentDTO> getList() {

    // 현재 인증된 사용자 정보 가져오기
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    UserDetails userDetails = (UserDetails)principal;
    String email = userDetails.getUsername();

    log.info("....email?? " + email);


    List<Payment> payments = paymentRepository.findByUserEmail(email);

    List<PaymentDTO> responseDTO = payments.stream().map(this::convertToDTO).collect(Collectors.toList());

    log.info("===============responseDTO "  + responseDTO);


    return responseDTO;
  }


  //결제 승인
  private PaymentSuccessDTO requestPaymentAccept(PaymentRequestDTO paymentRequestDTO) {

    RestTemplate restTemplate = new RestTemplate();


    //헤더 구성
    HttpHeaders headers = getHeaders();

    // 요청 객체 생성
      HttpEntity<PaymentRequestDTO> requestHttpEntity = new HttpEntity<>(paymentRequestDTO, headers);

    //응답 객체 TossPayment객체로 결제 응답받기
    PaymentSuccessDTO result = restTemplate.postForObject(tossConfirmUrl, requestHttpEntity, PaymentSuccessDTO.class);


    log.info("______ result + 이게 안나오네..." + result);



    return result;

  }

private PaymentDTO convertToDTO(Payment payment){


  MemberDTO memberDTO = memberService.entityToDTO(payment.getOwner());

  PaymentDTO paymentDTO = PaymentDTO.builder()
          .id(payment.getId())
          .paymentKey(payment.getPaymentKey())
          .status(payment.getStatus())
          .type(payment.getType())
          .orderName(payment.getOrderName())
          .orderId(payment.getOrderId())
          .totalAmount(payment.getTotalAmount())
          .method(payment.getMethod())
          .owner(memberDTO)
          .build();

  paymentDTO.setCreatedAt(payment.getCreatedAt());
  payment.setUpdatedAt(payment.getUpdatedAt());

    return paymentDTO;
  }


  private HttpHeaders getHeaders() {
    HttpHeaders headers = new HttpHeaders();

    //인증키 base64 인코딩
    String authorization = new String(Base64.getEncoder().encode((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8)));

    log.info("------ API 전송 요청 -------" + authorization);

    //헤더 구성
    headers.add("Authorization", "Basic " + authorization);

    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);

    return headers;
  }


}
