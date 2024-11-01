package org.zerock.mallapi.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.zerock.mallapi.domain.OrderProductInfo;
import org.zerock.mallapi.domain.OrderShippingAddressInfo;
import org.zerock.mallapi.domain.OrderStatus;

@Getter
@Setter
@ToString
@Builder
public class OrderDTO extends BaseDTO {

    private Long id;

    private MemberDTO owner;

    private String orderId; //-- 주문 ID -

    private int totalAmount;  //-- 총 주문 금액

    private int shippingFee;  //-- 배달료

    private int tax;  //-- 부가세

    private OrderStatus status; // 주문의 상태

    private OrderShippingAddressInfo deliveryInfo; //-- 주문 정보

    private OrderProductInfo productInfo; //-- 제품 정보


}
