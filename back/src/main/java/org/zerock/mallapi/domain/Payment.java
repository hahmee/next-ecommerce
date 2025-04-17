package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "tbl_payment")
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_owner")
    private Member owner; //구매자

    private String paymentKey;

    private String orderId; //-- 주문 ID

    private String orderName;

    private TossPaymentMethod method; //--결제수단

    private int totalAmount;  //-- 총 주문 금액

    private TossPaymentStatus status; // 토스 주문의 상태

    private TossPaymentType type; //토스 페이먼트 타입

    private String country; //국가코드

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    @Builder.Default
    private List<Order> orders = new ArrayList<>(); //Order과 연결


}
