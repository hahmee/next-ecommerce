package org.zerock.mallapi.dto;

import lombok.Builder;
import lombok.Data;
import org.zerock.mallapi.domain.TossPaymentMethod;
import org.zerock.mallapi.domain.TossPaymentStatus;
import org.zerock.mallapi.domain.TossPaymentType;

import java.util.List;

@Data
@Builder
public class AdminOrderDTO extends BaseDTO {

  Long id;

  MemberDTO owner; //결제한 사람

  String paymentKey;

  String orderId; //-- 주문 ID

  String orderName;

  TossPaymentMethod method; //--결제수단

  int totalAmount;  //-- 총 주문 금액

  TossPaymentStatus status; // 토스 주문의 상태

  TossPaymentType type; //토스 페이먼트 타입

  List<OrderDTO> orders; // 주문들

  Long itemLength; // 아이템 개수

}
