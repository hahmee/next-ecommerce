package org.zerock.mallapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class TossPaymentResponseDTO {
    private String orderId;
    private String orderName;
    private String paymentKey;
    private String status;
    private String approvedAt;
    private long totalAmount;
}
