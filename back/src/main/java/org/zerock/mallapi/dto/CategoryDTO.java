package org.zerock.mallapi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@Builder
//@Getter
//@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
  
  private Long cno;

  @NotNull(message = "카테고리명은 필수값입니다.")
  @Size(min = 1, max = 20, message = "카테고리명은 1~20 글자여야 합니다.")
  private String cname;

  @NotNull(message = "카테고리 설명은 필수값입니다.")
  @Size(min = 1, max = 20, message = "카테고리 설명은 1~20 글자여야 합니다.")
  private String cdesc;

  private boolean delFlag;

  private Long parentCategoryId; // 바로 위의 부모 id

  private List<CategoryDTO> subCategories;


}
