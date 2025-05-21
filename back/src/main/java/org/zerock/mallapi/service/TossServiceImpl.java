package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.dto.ConfirmRequestDTO;

import java.util.HashMap;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class TossServiceImpl implements TossService {

  @Value("${payment.toss.secret.key}")
  private String tossSecretKey;

  private final RestTemplate restTemplate = new RestTemplate();


  @Override
  public ResponseEntity<?> confirmPayment(ConfirmRequestDTO confirmRequestDTO) {
    String paymentKey = confirmRequestDTO.getPaymentKey();
    String orderId = confirmRequestDTO.getOrderId();
    long amount = confirmRequestDTO.getAmount();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBasicAuth(tossSecretKey, "");

    Map<String, Object> body = new HashMap<>();
    body.put("orderId", orderId);
    body.put("amount", amount);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

    try {
      ResponseEntity<String> response = restTemplate.postForEntity(
              "https://api.tosspayments.com/v1/payments/" + paymentKey,
              entity,
              String.class
      );

      // 🔥 여기에 주문 상태 업데이트 로직 넣는 것도 깔끔함
      return ResponseEntity.ok(response.getBody());

    } catch (HttpClientErrorException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getResponseBodyAsString());
    }
  }
}
