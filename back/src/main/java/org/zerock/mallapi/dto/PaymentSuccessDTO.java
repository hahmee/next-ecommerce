package org.zerock.mallapi.dto;

import lombok.Data;

@Data
public class PaymentSuccessDTO {

  String mId;
  String version;
  String paymentKey;
  String orderId;
  String orderName;
  String currency;
  String method;
  String totalAmount;
  String balanceAmount;
  String suppliedAmount;
  String vat;
  String status;
  String requestedAt;
  String approvedAt;
  String useEscrow;
  String cultureExpense;
  Object card;
  String type;

}
