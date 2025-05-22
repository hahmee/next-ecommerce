package org.zerock.mallapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Payment;
import org.zerock.mallapi.domain.TossPaymentStatus;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.util.GeneralException;
import org.zerock.mallapi.util.JWTUtil;

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
  private final OrderService orderService;
  private final MemberService memberService;
  private final PaymentService paymentService;


  @Override
  public DataResponseDTO<Map<String, Object>> confirmPayment(ConfirmRequestDTO confirmRequestDTO) {
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
      // 1️⃣ Toss 결제 승인 요청
      ResponseEntity<String> response = restTemplate.postForEntity(
              "https://api.tosspayments.com/v1/payments/" + paymentKey,
              entity,
              String.class
      );

      String responseBody = response.getBody();
      log.info("✅ Toss 응답: {}", responseBody);

      // 2️⃣ 응답 파싱
      ObjectMapper objectMapper = new ObjectMapper();
      TossPaymentResponseDTO tossPaymentResponseDTO = objectMapper.readValue(responseBody, TossPaymentResponseDTO.class);
      String parsedOrderId = tossPaymentResponseDTO.getOrderId();

      // 3️⃣ 사용자 조회
      Member member = orderService.getByOrderId(parsedOrderId);
      MemberDTO memberDTO = memberService.entityToDTO(member);
      Map<String, Object> claims = memberDTO.getClaims();

      // ✅ 4️⃣ 결제/주문/연결 테이블 처리
      PaymentRequestDTO paymentRequestDTO = PaymentRequestDTO.builder()
              .orderId(parsedOrderId)
//              .amount(tossPaymentResponseDTO.getTotalAmount())
              .paymentKey(tossPaymentResponseDTO.getPaymentKey())
              .amount(String.valueOf(tossPaymentResponseDTO.getTotalAmount()))
//              .amount(tossPaymentResponseDTO)
//              .orderName(tossPaymentResponseDTO.getOrderName())
//              .status(TossPaymentStatus.valueOf(tossPaymentResponseDTO.getStatus()))
//              .approvedAt(tossPaymentResponseDTO.getApprovedAt())
//              .method(tossPaymentResponseDTO.getMethod())
              .build();

      PaymentSuccessDTO savedPaymentInfo = paymentService.tossPaymentSuccess(paymentRequestDTO, member.getEmail());

      // 5️⃣ JWT 발급
      String accessToken = JWTUtil.generateToken(claims, 60);         // 1시간
      String refreshToken = JWTUtil.generateToken(claims, 60 * 24);   // 1일

      // 6️⃣ 응답 구성
      Map<String, Object> responseMap = new HashMap<>();
      responseMap.put("accessToken", accessToken);
      responseMap.put("refreshToken", refreshToken);
      responseMap.put("member", memberDTO);
      responseMap.put("payment", savedPaymentInfo); // optional

      return DataResponseDTO.of(responseMap);

    } catch (HttpClientErrorException e) {
      log.error("❌ Toss 결제 API 오류: {}", e.getResponseBodyAsString());
      throw new GeneralException(ErrorCode.TOSS_PAYMENT_FAIL, e.getResponseBodyAsString());

    } catch (Exception e) {
      log.error("❌ Toss 결제 처리 중 예외", e);
      throw new GeneralException(ErrorCode.INTERNAL_ERROR, "결제 승인 중 오류 발생");
    }
  }

}
