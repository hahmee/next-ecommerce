package org.zerock.mallapi.dto;

import org.zerock.mallapi.domain.Product;


public class ProductReviewDTO {
    private Product product;
    private Double averageRating;
    private Long reviewCount;

    public ProductReviewDTO(Product product, Double averageRating, Long reviewCount) {
        this.product = product;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }

}
