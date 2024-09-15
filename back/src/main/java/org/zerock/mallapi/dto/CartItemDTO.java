package org.zerock.mallapi.dto;

import lombok.Data;

@Data
public class CartItemDTO {

    private String email;

    private Long pno;

    private int qty;

    private Long cino;

    private ColorTagDTO color;

    private String size;

}
