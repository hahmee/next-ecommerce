package org.zerock.mallapi.dto;

import lombok.*;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;

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

  private String category;

  private String sku;

  private boolean inStock;

  private String refundPolicy;

  private String changePolicy;

  @Builder.Default
  private List<MultipartFile> files = new ArrayList<>();

  @Builder.Default
  private List<String> uploadFileNames = new ArrayList<>();

}
