export enum TossPaymentMethod {
    CARD = "카드",  // 카드 결제
    CASH = "현금",  // 현금 결제
    FAST = "간편결제"  // 현금 결제
}

export enum TossPaymentStatus {
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_FOR_DEPOSIT = "WAITING_FOR_DEPOSIT",
    DONE = "DONE",
    CANCELED = "CANCELED",
    PARTIAL_CANCELED = "PARTIAL_CANCELED",
    ABORTED = "ABORTED",
    EXPIRED = "EXPIRED"
}

export enum TossPaymentStatusKR {
    READY = "결제준비",
    IN_PROGRESS = "결제진행",
    WAITING_FOR_DEPOSIT = "입금대기",
    DONE = "결제완료",
    CANCELED = "결제취소",
    PARTIAL_CANCELED = "부분취소",
    ABORTED = "결제중단",
    EXPIRED = "결제만료"
}


export enum TossPaymentType {
    NORMAL = "NORMAL",          // 일반결제
    BILLING = "BILLING",        // 자동결제
    BRANDPAY = "BRANDPAY"       // 브랜드페이
}

export enum TossPaymentTypeKR {
    NORMAL = "일반결제",          // 일반결제
    BILLING = "자동결제",        // 자동결제
    BRANDPAY = "브랜드페이"       // 브랜드페이
}




