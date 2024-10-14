package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude="cart")
@Table(name = "tbl_cart_item", indexes = {
        @Index(columnList = "cart_cno", name = "idx_cartitem_cart"),
        @Index(columnList = "product_pno, cart_cno", name="idx_cartitem_pno_cart")
})
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cino;

    @ManyToOne
    @JoinColumn(name = "product_pno")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "cart_cno")
    private Cart cart;

    private int qty;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private ColorTag color;

    private String size;

    @ManyToOne
    @JoinColumn(name = "member_seller")
    private Member seller;//판매자

    public void changeQty(int qty){
        this.qty = qty;
    }

}

