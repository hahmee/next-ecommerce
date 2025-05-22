package org.zerock.mallapi.dto;

import lombok.Data;

@Data
public class TossPaymentResponseDTO {
    private String orderId;
    private String orderName;
    private String paymentKey;
    private String status;
    private String approvedAt;
    private int totalAmount;
}
