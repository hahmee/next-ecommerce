package org.zerock.mallapi.dto;

import lombok.Builder;
import lombok.Data;
import org.zerock.mallapi.domain.*;

@Data
@Builder
public class PaymentDTO extends BaseDTO {

  Long id;

  Member owner;

  String paymentKey;

  String orderId; //-- 주문 ID

  String orderName;

  TossPaymentMethod method; //--결제수단

  int totalAmount;  //-- 총 주문 금액

  TossPaymentStatus status; // 토스 주문의 상태

  TossPaymentType type; //토스 페이먼트 타입


}
