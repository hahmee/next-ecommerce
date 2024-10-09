package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "tbl_order")
public class Order extends BaseEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_owner")
    private Member owner;

    private Long orderId; //-- 주문 ID - id와 별개로 고객이 주문을 조회하거나 PG사의 고유한 주문번호를 전달할 때 사용됩니다.

    private int totalAmount;  //-- 총 주문 금액

    private OrderStatus status; // 주문의 상태

    private OrderShippingAddressInfo deliveryInfo; //-- 주문 정보

}
