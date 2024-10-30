package org.zerock.mallapi.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.zerock.mallapi.domain.OrderShippingAddressInfo;
import org.zerock.mallapi.domain.OrderStatus;
import org.zerock.mallapi.domain.SalesStatus;

import java.util.List;

@Getter
@Setter
@ToString
public class StockRequestDTO {

    private Long pno;
    private SalesStatus salesStatus;

}
