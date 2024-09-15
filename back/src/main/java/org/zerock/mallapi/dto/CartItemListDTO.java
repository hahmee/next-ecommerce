package org.zerock.mallapi.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder

@NoArgsConstructor
public class CartItemListDTO {

    private Long cino;

    private int qty;

    private Long pno;

    private String pname;

    private int price;

    private String imageFile;

    private String size;

    private ColorTagDTO color;

    public CartItemListDTO(Long cino, int qty, Long pno, String pname, int price, String imageFile, String size, ColorTagDTO color){
        this.cino = cino;
        this.qty = qty;
        this.pno = pno;
        this.pname = pname;
        this.price = price;
        this.imageFile = imageFile;
        this.size = size;
        this.color = color;

    }

}

