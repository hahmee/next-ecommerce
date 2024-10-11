package org.zerock.mallapi.dto;

import lombok.Data;
import lombok.Getter;
import org.zerock.mallapi.domain.TossPaymentMethod;
import org.zerock.mallapi.domain.TossPaymentStatus;
import org.zerock.mallapi.domain.TossPaymentType;

@Data
@Getter
public class PaymentSuccessDTO {

  String mId;
  String version;
  String paymentKey;
  String orderId;
  String orderName;
  String currency;
  TossPaymentMethod method;
  int totalAmount;
  String balanceAmount;
  String suppliedAmount;
  String vat;
  TossPaymentStatus status;
  String requestedAt;
  String approvedAt;
  String useEscrow;
  String cultureExpense;
  Object card;
  TossPaymentType type;

}
