package org.zerock.mallapi.dto;

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

  private String pname;

  private int price;

  private String pdesc;

  private boolean delFlag;

  private String brand;

  private List<String> categoryList;

  private String sku;

  private SalesStatus salesStatus;

  private String refundPolicy;

  private String changePolicy;

  @Builder.Default
  private List<MultipartFile> files = new ArrayList<>();

  @Builder.Default
  private List<String> uploadFileNames = new ArrayList<>();

}
