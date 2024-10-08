package org.zerock.mallapi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
//@Getter
//@Setter
@AllArgsConstructor
@NoArgsConstructor
public class  CategoryDTO {
  
  private Long cno;

  @NotNull(message = "카테고리명은 필수값입니다.")
  @Size(min = 1, max = 20, message = "카테고리명은 1~20 글자여야 합니다.")
  private String cname;

  @NotNull(message = "카테고리 설명은 필수값입니다.")
  @Size(min = 1, max = 200, message = "카테고리 설명은 1~200 글자여야 합니다.")
  private String cdesc;

  private boolean delFlag;

  private Long parentCategoryId; // 바로 위의 부모 id

  private List<CategoryDTO> subCategories;

  private MultipartFile file; //파일 객체 배열 (수정 시 새로운 파일들)

  @Builder.Default
  private String uploadFileName = null; // 이름들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)

  @Builder.Default
  private String uploadFileKey = null; // 키들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)


}
