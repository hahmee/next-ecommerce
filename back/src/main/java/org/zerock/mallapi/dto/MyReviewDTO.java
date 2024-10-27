package org.zerock.mallapi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyReviewDTO {

  private Long rno;

  @NotNull(message = "리뷰는 필수값입니다.")
  private String content;

  @NotNull(message = "별점은 필수값입니다.")
  private int rating;

  private String orderId;

  private Long oid; //Order의 고유 id

  private ProductDTO product;

  private MemberDTO owner;

}
