package org.zerock.mallapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.dto.ConfirmRequestDTO;
import org.zerock.mallapi.dto.TossPaymentResponseDTO;

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

      String responseBody = response.getBody();
      log.info("responseBody...." + responseBody);

      try {
        ObjectMapper objectMapper = new ObjectMapper();
        TossPaymentResponseDTO tossPaymentResponseDTO = objectMapper.readValue(responseBody, TossPaymentResponseDTO.class);

        String parsedOrderId = tossPaymentResponseDTO.getOrderId();
        log.info("✅ 주문 ID: " + parsedOrderId);

        // 주문 아이디로 유저 검색 후 로그인



        // 여기에서 parsedOrderId로 주문 상태 업데이트 가능
        // ex) orderService.updateStatus(parsedOrderId, "DONE");

      } catch (Exception jsonException) {
        log.error("❌ Toss 응답 파싱 실패", jsonException);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 응답 파싱 실패");
      }

      return ResponseEntity.ok(responseBody);

    } catch (HttpClientErrorException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getResponseBodyAsString());
    }
  }

}
