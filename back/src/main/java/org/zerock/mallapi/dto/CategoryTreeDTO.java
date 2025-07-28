package org.zerock.mallapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryTreeDTO {

    private Long cno;
    private String cname;
    private String cdesc;
    private boolean delFlag;
    private List<CategoryTreeDTO> subCategories = new ArrayList<>();
    private String uploadFileName; // 이름들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)
    private String uploadFileKey; // 키들 배열 (수정 시 원래 있던 파일들 중 삭제 안 한 파일들)


    public CategoryTreeDTO(Long cno, String cname, String cdesc, boolean delFlag, String uploadFileKey, String uploadFileName) {
        this.cno = cno;
        this.cname = cname;
        this.cdesc = cdesc;
        this.delFlag = delFlag;
        this.uploadFileKey = uploadFileKey;
        this.uploadFileName = uploadFileName;
    }
}
