package org.zerock.mallapi.dto;

import lombok.Data;

@Data
public class PaymentFailDTO {
  String errorCode;
  String errorMessage;
  String orderId;
}
