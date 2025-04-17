package org.zerock.mallapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.repository.OrderPaymentRepository;
import org.zerock.mallapi.repository.OrderRepository;
import org.zerock.mallapi.repository.PaymentRepository;
import org.zerock.mallapi.util.GeneralException;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
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

  private final CartService cartService;

  private final OrderService orderService;


  @Override
  public PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, String email) {

    //결제 승인 로직
    PaymentSuccessDTO paymentSuccessDTO = requestPaymentAccept(paymentRequestDTO);

    log.info("paymentSuccessDTO...." + paymentSuccessDTO);

    //DONE이라면
    if(paymentSuccessDTO.getStatus() == TossPaymentStatus.DONE) {

      //결제 객체의 정보 중 필요한 정보들을 서버에 저장한다.
      Payment payment = dtoToEntity(paymentSuccessDTO, email);

      log.info("최종..payment" + payment);

      //시간
      payment.setCreatedAt(LocalDateTime.now());
      payment.setUpdatedAt(LocalDateTime.now());

      //step1 read (order_id로 찾는다)
      List<Order> orders = orderRepository.selectListByOrderId(paymentSuccessDTO.getOrderId());

      //Payment와 Order 연결
      payment.getOrders().addAll(orders); // 여러 개의 Order를 추가

      paymentRepository.save(payment);

      //결제 결과를 바탕으로 주문의 상태에 반영한다.


      // 리스트가 비어 있으면 예외를 발생시킨다.
      if (orders.isEmpty()) {
        throw new GeneralException(ErrorCode.NOT_FOUND, "해당 주문번호에 해당하는 주문내역이 없습니다...,");
//        throw new NoSuchElementException("해당 주문번호에 해당하는 주문내역이 없습니다..., " + paymentSuccessDTO.getOrderId());
      }

      //step2 상태 변경 - for문
      for(Order order: orders) {

        //결제완료로 상태 변경
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


        //결제 완료된 상품들은 장바구니에서 삭제한다.- order의 pno 찾아서 해당 하는 사람의 cart item의 pno 삭제하기
        deleteCartItems(email, order.getProductInfo().getPno());

      }

    }


    return paymentSuccessDTO;
  }

  private void deleteCartItems(String email, Long pno){

        //1. 우선 카트아이템에서 찾기
        List<Long> cinos = cartService.getCartItemByEmailAndProductId(email, pno);


        //2. 삭제한다.
        for(Long cino: cinos) {
          cartService.remove(cino);
        }

  }

  private Payment dtoToEntity(PaymentSuccessDTO paymentSuccessDTO, String email){

    Member owner = Member.builder().email(email).build(); //구매자

    Payment payment = Payment.builder()
            .orderId(paymentSuccessDTO.getOrderId())
            .paymentKey(paymentSuccessDTO.getPaymentKey())
            .status(paymentSuccessDTO.getStatus())
            .method(paymentSuccessDTO.getMethod())
            .type(paymentSuccessDTO.getType())
            .totalAmount(paymentSuccessDTO.getTotalAmount())
            .orderName(paymentSuccessDTO.getOrderName())
            .owner(owner) //구매자
            .country(paymentSuccessDTO.getCountry())
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


    List<Payment> payments = paymentRepository.findByUserEmail(email);

    List<PaymentDTO> responseDTO = payments.stream().map(this::convertToDTO).collect(Collectors.toList());


    return responseDTO;
  }


  @Override
  public PaymentDTO getByPaymentKey(String paymentKey) {

    log.info("조회용 paymentKey: [" + paymentKey + "]");

    Optional<Payment> result = paymentRepository.findByPaymentKey(paymentKey);

    log.info("result.........???" + result);

    Payment payment = result.orElseThrow();// 없으면 에러

    log.info("payment.........???" + payment);

    PaymentDTO paymentDTO = convertToDTO(payment);

    return paymentDTO;
  }


  @Override
  public PaymentDTO getByEmailAndOrderId(String email, String orderId) {

    Optional<Payment> result = paymentRepository.findByEmailAndOrderId(email, orderId);

    Payment payment = result.orElseThrow();// 없으면 에러

    PaymentDTO paymentDTO = convertToDTO(payment);

    return paymentDTO;
  }


  @Override
  public PageResponseDTO<PaymentDTO> getSearchAdminPaymentList(SearchRequestDTO searchRequestDTO, String email) {


    Pageable pageable = PageRequest.of(
            searchRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            searchRequestDTO.getSize(),
            Sort.by("id").descending());

    String search = searchRequestDTO.getSearch();

    LocalDateTime startDateTime;
    LocalDateTime endDateTime;

    // 전체 기간 클릭 시 내용 X
    if (searchRequestDTO.getStartDate() == null  || searchRequestDTO.getStartDate().isEmpty()) {

      // 시작일: 데이터의 최소 날짜로 설정 (예: 1970-01-01)
      startDateTime = LocalDate.of(1970, 1, 1).atStartOfDay();
      // 종료일: 현재 날짜로 설정
      endDateTime = LocalDateTime.now();

    }else {

      //날짜 변환
      DateTimeFormatter dateformatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
      LocalDate startDate = LocalDate.parse(searchRequestDTO.getStartDate(), dateformatter);
      startDateTime = startDate.atStartOfDay();//startDate의 끝시간 xx:00:00

      LocalDate endDate = LocalDate.parse(searchRequestDTO.getEndDate(), dateformatter);
      endDateTime = endDate.atTime(23, 59, 59);    // endDate의 끝 시간을 xx:59:59으로 설정
    }


    log.info("--------------pageable      " + pageable);

    Page<Payment> payments = paymentRepository.searchAdminPaymentList(pageable, search, email, startDateTime, endDateTime);

    List<PaymentDTO> dtoList = payments.stream().map(payment -> {

      MemberDTO memberDTO = memberService.entityToDTO(payment.getOwner());

      PaymentDTO paymentDTO = PaymentDTO.builder()
              .id(payment.getId())
              .owner(memberDTO)
              .paymentKey(payment.getPaymentKey())
              .orderId(payment.getOrderId())
              .orderName(payment.getOrderName())
              .method(payment.getMethod())
              .totalAmount(payment.getTotalAmount())
              .status(payment.getStatus())
              .type(payment.getType())
              .build();

      paymentDTO.setCreatedAt(payment.getCreatedAt());
      paymentDTO.setUpdatedAt(payment.getUpdatedAt());

      return paymentDTO;

    }).collect(Collectors.toList());



    long totalCount = payments.getTotalElements();

    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(searchRequestDTO.getPage()).size(searchRequestDTO.getSize()).build();

    return PageResponseDTO.<PaymentDTO>withAll()
            .dtoList(dtoList)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();

  }

  //결제 승인
  private PaymentSuccessDTO requestPaymentAccept(PaymentRequestDTO paymentRequestDTO) {

    log.info("결제 승인 로직 한 번만 실행되어야함....");

    log.info("PaymentRequestDTO....." + paymentRequestDTO);

    RestTemplate restTemplate = new RestTemplate();
    restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

    //헤더 구성
    HttpHeaders headers = getHeaders();

    log.info("headers....." + headers);

    // 요청 객체 생성
    HttpEntity<PaymentRequestDTO> requestHttpEntity = new HttpEntity<>(paymentRequestDTO, headers);

    // ✅ JSON 응답을 `String`으로 먼저 받아서 로그 출력
    String responseBody = restTemplate.postForObject(tossConfirmUrl, requestHttpEntity, String.class);

    log.info("💡 Toss API Response (Raw JSON): " + responseBody);

    // ✅ ObjectMapper로 JSON을 직접 변환 (매핑 오류 확인)
    ObjectMapper objectMapper = new ObjectMapper();
    PaymentSuccessDTO result = null;

    try {
      result = objectMapper.readValue(responseBody, PaymentSuccessDTO.class);
      log.info("✅ JSON 매핑 성공: " + result);
    } catch (Exception e) {
      log.error("❌ JSON 매핑 오류 발생!", e);
    }

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


  //Sales-Overview
  @Override
  public List<Object[]> getSalesByCountry(TopCustomerRequestDTO topCustomerRequestDTO) {

    DateTimeFormatter dateformatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDate startDate = LocalDate.parse(topCustomerRequestDTO.getStartDate(), dateformatter);
    LocalDateTime startDateTime = startDate.atStartOfDay();//startDate의 끝시간 xx:00:00

    LocalDate endDate = LocalDate.parse(topCustomerRequestDTO.getEndDate(), dateformatter);
    LocalDateTime endDateTime = endDate.atTime(23, 59, 59);    // endDate의 끝 시간을 xx:59:59으로 설정

    String sellerEmail = topCustomerRequestDTO.getSellerEmail();


    return paymentRepository.findSalesByCountry(sellerEmail, startDateTime, endDateTime);

  }

  @Override
  public PaymentSummaryDTO getAdminPaymentOverview(SearchRequestDTO searchRequestDTO, String sellerEmail) {


    LocalDateTime startDateTime;
    LocalDateTime endDateTime;

    // 전체 기간 클릭 시
    if (searchRequestDTO.getStartDate() == null  || searchRequestDTO.getStartDate().isEmpty()) { // || searchRequestDTO.getStartDate().isEmpty()
      // 시작일: 데이터의 최소 날짜로 설정 (예: 1970-01-01)
      startDateTime = LocalDate.of(1970, 1, 1).atStartOfDay();
      // 종료일: 현재 날짜로 설정
      endDateTime = LocalDateTime.now();
    } else {

      // 날짜 변환
      DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
      LocalDate startDate = LocalDate.parse(searchRequestDTO.getStartDate(), dateFormatter);
      startDateTime = startDate.atStartOfDay(); // startDate의 시작 시간 xx:00:00
      LocalDate endDate = LocalDate.parse(searchRequestDTO.getEndDate(), dateFormatter);
      endDateTime = endDate.atTime(23, 59, 59); // endDate의 끝 시간을 xx:59:59으로 설정

//       startDateTime = searchRequestDTO.getStartDate().toLocalDate().atStartOfDay();//startDate의 끝시간 xx:00:00
//       endDateTime = searchRequestDTO.getEndDate().toLocalDate().atTime(23, 59, 59);    // endDate의 끝 시간을 xx:59:59으로 설정
//


    }


    PaymentSummaryDTO paymentSummaryDTO = paymentRepository.selectTotalPayments(sellerEmail, startDateTime, endDateTime);


    return paymentSummaryDTO;
  }

  @Override
  public PageResponseDTO<AdminOrderDTO> getSearchAdminOrders(SearchRequestDTO searchRequestDTO, String email) {

    Pageable pageable = PageRequest.of(
            searchRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            searchRequestDTO.getSize(),
            Sort.by("id").descending());

    String search = searchRequestDTO.getSearch();

    LocalDateTime startDateTime;
    LocalDateTime endDateTime;

    // 전체 기간 클릭 시
    if (searchRequestDTO.getStartDate() == null  || searchRequestDTO.getStartDate().isEmpty()) {
      // 시작일: 데이터의 최소 날짜로 설정 (예: 1970-01-01)
      startDateTime = LocalDate.of(1970, 1, 1).atStartOfDay();
      // 종료일: 현재 날짜로 설정
      endDateTime = LocalDateTime.now();
    } else {


      // 날짜 변환
      DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
      LocalDate startDate = LocalDate.parse(searchRequestDTO.getStartDate(), dateFormatter);
      startDateTime = startDate.atStartOfDay(); // startDate의 시작 시간 xx:00:00


      LocalDate endDate = LocalDate.parse(searchRequestDTO.getEndDate(), dateFormatter);
      endDateTime = endDate.atTime(23, 59, 59); // endDate의 끝 시간을 xx:59:59으로 설정


    }



    Page<Object[]> payments = paymentRepository.searchAdminOrders(pageable, search, email, startDateTime, endDateTime);

    List<AdminOrderDTO> dtoList = payments.get().map(arr -> {

      Payment payment = (Payment) arr[0]; // Payment
      Long itemCount = (Long) arr[1]; // sum

      MemberDTO memberDTO = memberService.entityToDTO(payment.getOwner());

      List<Order> orders = payment.getOrders();
      List<OrderDTO> orderDTOs = orders.stream().map(orderService::convertToDTO).collect(Collectors.toList());

      AdminOrderDTO adminOrderDTO = AdminOrderDTO.builder()
              .id(payment.getId())
              .owner(memberDTO)
              .paymentKey(payment.getPaymentKey())
              .orderId(payment.getOrderId())
              .orderName(payment.getOrderName())
              .method(payment.getMethod())
              .totalAmount(payment.getTotalAmount())
              .status(payment.getStatus())
              .type(payment.getType())
              .orders(orderDTOs)
              .itemLength(itemCount)
              .build();

      adminOrderDTO.setCreatedAt(payment.getCreatedAt());
      adminOrderDTO.setUpdatedAt(payment.getUpdatedAt());

      return adminOrderDTO;

    }).collect(Collectors.toList());


    log.info("dtoList.... " + dtoList);

    long totalCount = payments.getTotalElements();

    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(searchRequestDTO.getPage()).size(searchRequestDTO.getSize()).build();

    return PageResponseDTO.<AdminOrderDTO>withAll()
            .dtoList(dtoList)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();
  }


}
