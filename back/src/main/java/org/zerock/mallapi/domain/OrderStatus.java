package org.zerock.mallapi.domain;

public enum OrderStatus {
    ORDER_CHECKING, //
    PAYMENT_CONFIRMED, //결제 완료
    PENDING,       // 결제 대기 중
    COMPLETED,     // 결제 완료
    CANCELLED,     // 주문 취소
    SHIPPED,       // 배송 중
    DELIVERED,     // 배송 완료
    RETURNED,      // 반품 완료
    REFUNDED;      // 환불 완료
}
