package org.zerock.mallapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data //Getter, Setter, toString, equals, hashCode 등을 자동 생성
@NoArgsConstructor //매개변수가 없는 기본 생성자
public class PaymentSummaryDTO {
    private Long  totalAmount;  // 총 결제 금액
    private Long count;           // 결제 개수

    // 매개변수가 있는 생성자를 명시적으로 추가
    public PaymentSummaryDTO(Long totalAmount, Long count) {
        this.totalAmount = totalAmount;
        this.count = count;
    }
}
