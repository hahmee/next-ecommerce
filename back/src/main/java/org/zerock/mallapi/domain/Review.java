package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "owner")
@Table(
        name = "tbl_review"
)
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rno;

    private String content; //리뷰내용

    private int rating;  // 별점 (1~5)

    private String orderId;

    @ManyToOne(fetch = FetchType.LAZY) //여러개의 리뷰는 하나의 상품과 연결
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToOne(fetch = FetchType.LAZY) //한개의 리뷰는 한개의 주문과 연결
    @JoinColumn(name = "oid")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "member_owner") //여러개의 리뷰는 하나의 유저와 연결
    private Member owner; // 유저


}
