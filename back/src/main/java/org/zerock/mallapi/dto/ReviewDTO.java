package org.zerock.mallapi.dto;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.domain.BaseEntity;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.SalesStatus;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO extends BaseEntity {

  private Long rno;

  @NotNull(message = "리뷰는 필수값입니다.")
  private String content;

  @NotNull(message = "별점은 필수값입니다.")
  private int rating;

  private String orderId;

  private Long pno;

  private Long oid; //Order의 고유 id

  private OrderDTO order;

  private MemberDTO owner;

}
