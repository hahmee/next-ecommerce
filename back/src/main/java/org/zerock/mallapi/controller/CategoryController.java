package org.zerock.mallapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.FileDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.service.CategoryService;
import org.zerock.mallapi.util.AwsFileUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/category")
public class CategoryController {

  private final CategoryService categoryService;
  private final AwsFileUtil awsFileUtil;
  private final String CATEGORY_IMG_DIR = "category";


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @PostMapping("/")
//  public DataResponseDTO<Long> register(@Valid @RequestBody CategoryDTO categoryDTO) {
  public DataResponseDTO<Long> register(@Valid CategoryDTO categoryDTO) {


    log.info("register: ?????????????" + categoryDTO);

    MultipartFile file = categoryDTO.getFile();//파일 객체들

    if(file != null) {

      Map<String,String> awsResult = awsFileUtil.uploadSingleFile(file, CATEGORY_IMG_DIR);//AWS에 저장

      log.info("awsResult.............." + awsResult);


      String uploadFileName = awsResult.get("uploadName");
      String uploadFileKey = awsResult.get("uploadKey");

      log.info("잘 나오나.." + uploadFileName);
      log.info("잘 나오나..2" + uploadFileKey);

      categoryDTO.setUploadFileName(uploadFileName);
      categoryDTO.setUploadFileKey(uploadFileKey);

    }

    //서비스 호출 
    Long pno = categoryService.addCategory(categoryDTO);

    return DataResponseDTO.of(pno);
  }


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/")
  public DataResponseDTO<List<CategoryDTO>> list() {
    log.info("categoryService.getAllCategories() " + categoryService.getAllCategories());
    return DataResponseDTO.of(categoryService.getAllCategories());

  }

  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/{cno}")
  public DataResponseDTO<CategoryDTO> read(@PathVariable(name="cno") Long cno) {

    CategoryDTO categoryDTO = categoryService.get(cno);

    log.info("categoryDTO========== " + categoryDTO);
    return DataResponseDTO.of(categoryDTO);
  }


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
  @PutMapping("/{cno}")
  public DataResponseDTO<CategoryDTO> modify(@PathVariable(name="cno")Long cno, @Valid @RequestBody CategoryDTO categoryDTO) {
    log.info("==============categoryDTO답이 이것입니다.... " + categoryDTO);
    log.info("==============cno " + cno);

    //수정 작업
    categoryService.modify(categoryDTO);

    CategoryDTO modifiedCategoryDTO = categoryService.get(cno);

    return DataResponseDTO.of(modifiedCategoryDTO);

  }

  @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
  @DeleteMapping("/{cno}")
  public DataResponseDTO<String> remove(@PathVariable("cno") Long cno) {

    categoryService.remove(cno);

    return DataResponseDTO.of("SUCCESS");
  }


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/paths/{cno}")
  public DataResponseDTO<List<CategoryDTO>> pathList(@PathVariable("cno") Long cno) {
    return DataResponseDTO.of(categoryService.getAllCategoryPaths(cno));

  }


}

