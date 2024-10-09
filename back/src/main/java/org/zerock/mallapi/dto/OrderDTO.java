package org.zerock.mallapi.dto;

import lombok.Getter;
import org.zerock.mallapi.domain.OrderShippingAddressInfo;
import org.zerock.mallapi.domain.OrderStatus;

@Getter
public class OrderDTO {

    private Long id;

//    private Member owner;

    private Long orderId; //-- 주문 ID -

    private int totalAmount;  //-- 총 주문 금액

    private OrderStatus status; // 주문의 상태

    private OrderShippingAddressInfo deliveryInfo; //-- 주문 정보

}
