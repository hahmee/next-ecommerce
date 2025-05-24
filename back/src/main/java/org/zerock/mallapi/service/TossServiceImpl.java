package org.zerock.mallapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
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
import org.zerock.mallapi.util.TokenResponseUtil;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class TossServiceImpl implements TossService {

  @Value("${payment.toss.secret.key}")
  private String tossSecretKey;
  private final RestTemplate restTemplate;
  private final OrderService orderService;
  private final MemberService memberService;
  private final PaymentService paymentService;

  @Override
  public DataResponseDTO<Map<String, Object>> confirmPayment(ConfirmRequestDTO confirmRequestDTO) {
    String paymentKey = confirmRequestDTO.getPaymentKey();

    log.info("....paymentKey " + paymentKey);

    // ✅ 이미 처리된 결제라면 JWT만 발급하고 반환
    if (paymentService.existsByPaymentKey(paymentKey)) {
      log.info("✅ 이미 처리된 결제입니다: {}", paymentKey);

      PaymentDTO paymentDTO = paymentService.getByPaymentKey(paymentKey);
      MemberDTO memberDTO = paymentDTO.getOwner();
      return TokenResponseUtil.create(memberDTO);

    }

    // Toss 결제 승인 요청
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBasicAuth(tossSecretKey, "");

    Map<String, Object> body = Map.of(
            "orderId", confirmRequestDTO.getOrderId(),
            "amount", confirmRequestDTO.getAmount()
    );

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

    log.info("....entity " + entity); // 여기까진 괜찮음

    try {
      ResponseEntity<String> response = restTemplate.postForEntity(
              "https://api.tosspayments.com/v1/payments/" + paymentKey,
              entity,
              String.class
      );

      ObjectMapper mapper = new ObjectMapper();

      PaymentSuccessDTO paymentSuccessDTO = mapper.readValue(response.getBody(), PaymentSuccessDTO.class);

      log.info("....dto " + paymentSuccessDTO);

      Member member = orderService.getByOrderId(paymentSuccessDTO.getOrderId());

      log.info("member/// " + member); // 다 가져옴


      // 저장
      paymentService.savePaymentAfterSuccess(paymentSuccessDTO, member);

//      log.info("savedPayment////" + savedPayment);

      MemberDTO memberDTO = new MemberDTO(
              member.getEmail(),
              member.getPassword(),
              member.getNickname(),
              member.isSocial(),
              member.getMemberRoleList().stream().map(memberRole -> memberRole).collect(Collectors.toList()),
              member.getEncryptedId(),
              member.getCreatedAt(),
              member.getUpdatedAt()
      );

      return TokenResponseUtil.create(memberDTO);


    } catch (HttpClientErrorException e) {
      log.error("❌ Toss 결제 API 오류: {}", e.getResponseBodyAsString());
      throw new GeneralException(ErrorCode.TOSS_PAYMENT_FAIL, e.getResponseBodyAsString());

    } catch (Exception e) {
      log.error("❌ Toss 결제 처리 중 예외", e);
      throw new GeneralException(ErrorCode.INTERNAL_ERROR, "결제 승인 중 오류 발생");
    }
  }


}
