package org.zerock.mallapi.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.OrderShippingAddressInfo;
import org.zerock.mallapi.domain.OrderStatus;

import java.util.List;

@Getter
@Setter
@ToString
public class OrderRequestDTO {

    private Long id;

    private String orderId; //-- 주문 ID -

    private int totalAmount;  //-- 총 주문 금액

    private int shippingFee;  //-- 배달료

    private int tax;  //-- 부가세

    private OrderStatus status; // 주문의 상태

    private OrderShippingAddressInfo deliveryInfo; //-- 주문 정보
    
    private List<CartItemListDTO> carts; //-- 카트 정보

//    private MemberDTO seller; //-- 판매자 정보

}
