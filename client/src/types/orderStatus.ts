export enum OrderStatus {
    ORDER_CHECKING = "주문확인", //주문 확인
    PAYMENT_CONFIRMED = "결제완료", //지불 완료
    PENDING = "보류",
    COMPLETED = "완료",
    CANCELLED = "취소",
    SHIPPED = "배송중",
    DELIVERED = "배송완료",
    RETURNED = "회수됨",
    REFUNDED = "환불됨"
}