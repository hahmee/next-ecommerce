package org.zerock.mallapi.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.domain.SalesStatus;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
  
  private Long pno;

  @NotNull(message = "상품명은 필수값입니다.")
  @Size(min = 1, max = 20, message = "상품명은 1~20 글자여야 합니다.")
  private String pname;

  @NotNull(message = "판매가격은 필수값입니다.")
  private int price;

  @NotNull(message = "상품 설명은 필수값입니다.")
  @Size(min = 1, message = "상품 설명은 한 글자 이상이여야 합니다.")
  private String pdesc;

  private boolean delFlag;

  @NotNull(message = "브랜드는 필수값입니다.")
  private String brand;

  @NotNull(message = "카테고리는 필수값입니다.")
  @Size(min = 1, message = "카테고리는 필수값입니다.")
  private List<String> categoryList;

  @NotNull(message = "SKU는 필수값입니다.")
  private String sku;

  @NotNull(message = "판매상태는 필수값입니다.")
  private SalesStatus salesStatus;

  @NotNull(message = "환불정책은 필수값입니다.")
  private String refundPolicy;

  @NotNull(message = "교환정책은 필수값입니다.")
  private String changePolicy;

  private List<FileDTO<MultipartFile>> files; //파일 객체 배열 (수정 시 새로운 파일들)

  @Builder.Default
  private List<FileDTO<String>> uploadFileNames = new ArrayList<>(); // 이름들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)


  @Builder.Default
  private List<FileDTO<String>> uploadFileKeys = new ArrayList<>(); // 키들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)


//  @Builder.Default //특정 필드를 특정 값으로 초기화
//  private List<MultipartFile> files = new ArrayList<>(); //파일 객체 배열 (수정 시 새로운 파일들)
//
//  @Builder.Default
//  private List<String> uploadFileNames = new ArrayList<>(); // 이름들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)
//
//  @Builder.Default
//  private List<String> uploadFileKeys = new ArrayList<>(); // 키들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)

}
