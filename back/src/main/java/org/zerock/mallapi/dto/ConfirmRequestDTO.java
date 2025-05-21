package org.zerock.mallapi.dto;

import lombok.Data;

@Data
public class ConfirmRequestDTO {
    private String paymentKey;
    private String orderId;
    private long amount;
}
