package org.zerock.mallapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.util.GeneralException;
import org.zerock.mallapi.util.TokenResponseUtil;
import reactor.core.publisher.Mono;

import java.util.Map;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class TossServiceImpl implements TossService {

  @Value("${payment.toss.secret.key}")
  private String tossSecretKey;

  @Value("${payment.toss.payment.url}")
  private String tossUrl;

  private final OrderService orderService;
  private final PaymentService paymentService;
  private final ObjectMapper objectMapper = new ObjectMapper();

  private WebClient webClient;

  @PostConstruct
  public void init() {
    log.info("✅ tossUrl = {}", tossUrl);
    this.webClient = WebClient.builder()
            .baseUrl(tossUrl)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
  }

  @Override
  public DataResponseDTO<Map<String, Object>> confirmPayment(ConfirmRequestDTO confirmRequestDTO) {
    String paymentKey = confirmRequestDTO.getPaymentKey();

    // 이미 처리된 결제
    if (paymentService.existsByPaymentKey(paymentKey)) {
      log.info("이미 처리된 결제입니다: {}", paymentKey);
      PaymentDTO paymentDTO = paymentService.getByPaymentKey(paymentKey);
      return TokenResponseUtil.create(paymentDTO.getOwner());
    }

    try {
      Map<String, Object> requestBody = Map.of(
              "orderId", confirmRequestDTO.getOrderId(),
              "amount", confirmRequestDTO.getAmount()
      );

      String basicToken = java.util.Base64.getEncoder()
              .encodeToString((tossSecretKey + ":").getBytes());

      String responseBody = webClient.post()
              .uri("/{paymentKey}", paymentKey)
              .headers(headers -> headers.setBasicAuth(tossSecretKey, ""))
              .bodyValue(requestBody)
              .retrieve()
              .onStatus(
                      status -> status.is4xxClientError() || status.is5xxServerError(),
                      clientResponse -> clientResponse.bodyToMono(String.class)
                              .flatMap(errorBody -> {
                                log.error("❌ Toss API 오류 응답: {}", errorBody);
                                return Mono.error(new GeneralException(ErrorCode.TOSS_PAYMENT_FAIL, errorBody));
                              })
              )
              .bodyToMono(String.class)
              .block();

      PaymentSuccessDTO paymentSuccessDTO = objectMapper.readValue(responseBody, PaymentSuccessDTO.class);

      Member member = orderService.getByOrderId(paymentSuccessDTO.getOrderId());
      paymentService.savePaymentAfterSuccess(paymentSuccessDTO, member);

      MemberDTO memberDTO = new MemberDTO(
              member.getEmail(),
              member.getPassword(),
              member.getNickname(),
              member.isSocial(),
              member.getMemberRoleList().stream().toList(),
              member.getEncryptedId(),
              member.getCreatedAt(),
              member.getUpdatedAt()
      );

      return TokenResponseUtil.create(memberDTO);

    } catch (GeneralException e) {
      throw e; // 위에서 이미 로깅됨
    } catch (Exception e) {
      log.error("❌ Toss 결제 처리 중 예외", e);
      throw new GeneralException(ErrorCode.INTERNAL_ERROR, "결제 승인 중 오류 발생");
    }
  }
}
