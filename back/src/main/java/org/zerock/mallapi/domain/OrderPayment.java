package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.Builder;

//주문에 대한 결제 정보들을 저장합니다.
@Entity
@Table(name = "tbl_order_payment")
@Builder
public class OrderPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private Long paymentId;



}
