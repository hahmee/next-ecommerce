package org.zerock.mallapi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
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

  private Long parentId;

  private List<CategoryDTO> subCategories;


}
