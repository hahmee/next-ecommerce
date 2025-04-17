package org.zerock.mallapi.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Builder
@Embeddable
@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderProductInfo {

    private Long pno; // 상품에 대해 조회하거나 삭제/변경 여부를 확인 하기 위해 참조값을 가짐

    private String pname;

    private int qty; // 몇 개

    private Long price; // 상품에 대한 최종적으로 결제해야하는 금액 (오리지널가..할인가 등 생략)

    private String thumbnailUrl;

    /*옵션 */
    private String size;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private ColorTag color;

}
