package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.config.TossPaymentConfig;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.CategoryClosureRepository;
import org.zerock.mallapi.repository.ProductRepository;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
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


  @Override
  public PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO) {

    //Payment payment = verifyPayment(orderId, amount);



    //결제 승인 로직
    PaymentSuccessDTO paymentSuccessDTO = requestPaymentAccept(paymentRequestDTO);

    log.info("===paymentSuccessDTO === " + paymentSuccessDTO);

    //결제 정보 db 저장






    return null;
  }


  @Override
  public PaymentFailDTO tossPaymentFail(PaymentRequestDTO paymentRequestDTO) {



    return null;
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


    log.info("______ result + " + result);



    return result;

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
