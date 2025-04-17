package org.zerock.mallapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.*;
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
  public DataResponseDTO<CategoryDTO> register(@Valid CategoryDTO categoryDTO) {

    MultipartFile file = categoryDTO.getFile();//파일 객체들

    if(file != null) {

      Map<String,String> awsResult = awsFileUtil.uploadSingleFile(file, CATEGORY_IMG_DIR);//AWS에 저장

      log.info("awsResult.............." + awsResult);

      String uploadFileName = awsResult.get("uploadName");
      String uploadFileKey = awsResult.get("uploadKey");

      categoryDTO.setUploadFileName(uploadFileName);
      categoryDTO.setUploadFileKey(uploadFileKey);

    }

    //서비스 호출 
    CategoryDTO result = categoryService.addCategory(categoryDTO);

    return DataResponseDTO.of(result);
  }


  @GetMapping("/list")
  public DataResponseDTO<List<CategoryDTO>> list() {

    log.info("categoryService.getAllCategories() " + categoryService.getAllCategories());
    return DataResponseDTO.of(categoryService.getAllCategories());

  }

  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/searchAdminList")
  public DataResponseDTO<PageResponseDTO<CategoryDTO>> searchAdminList(SearchRequestDTO searchRequestDTO) {
    log.info("searchRequestDTO========== " + searchRequestDTO);

    log.info("categoryDTO========== " + categoryService.getSearchAdminList(searchRequestDTO));


    return DataResponseDTO.of(categoryService.getSearchAdminList(searchRequestDTO));

  }


  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/{cno}")
  public DataResponseDTO<CategoryDTO> read(@PathVariable(name="cno") Long cno) {

    CategoryDTO categoryDTO = categoryService.get(cno);

    log.info("categoryDTO========== " + categoryDTO);
    return DataResponseDTO.of(categoryDTO);
  }


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
  @PutMapping("/{cno}")
//  public DataResponseDTO<CategoryDTO> modify(@PathVariable(name="cno")Long cno, @Valid @RequestBody CategoryDTO categoryDTO) {
  public DataResponseDTO<CategoryDTO> modify(@PathVariable(name="cno")Long cno, @Valid CategoryDTO categoryDTO) {
    
    //파일 수정 작업
    //이미 저장되었던 파일을 가져온다.
    CategoryDTO oldCategoryDTO = categoryService.get(cno);

    //보내온 dto에서 file이 null 이면 걍 놔두기, file이 뭐가 있다면 대체하기
    MultipartFile file = categoryDTO.getFile();

    // 새로 첨부했다면
    if (file != null && !file.isEmpty()) {

      Map<String,String> awsResult = awsFileUtil.uploadSingleFile(file, CATEGORY_IMG_DIR);//AWS에 저장

      //새로 업로드되어서 만들어진 파일 이름들
      String currentUploadFileName = awsResult.get("uploadName");
      String currentUploadFileKey = awsResult.get("uploadKey");

      categoryDTO.setUploadFileName(currentUploadFileName);
      categoryDTO.setUploadFileKey(currentUploadFileKey);

    }


    //수정 작업
    categoryService.modify(categoryDTO);

    CategoryDTO modifiedCategoryDTO = categoryService.get(cno);

    log.info("modifiedCategoryDTO..." + modifiedCategoryDTO);

    return DataResponseDTO.of(modifiedCategoryDTO);

  }

  @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
  @DeleteMapping("/{cno}")
  public DataResponseDTO<List<Long>> remove(@PathVariable("cno") Long cno) {

    List<Long> removedCno = categoryService.remove(cno);

//    return DataResponseDTO.of("SUCCESS");
    return DataResponseDTO.of(removedCno);

  }


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/paths/{cno}")
  public DataResponseDTO<List<CategoryDTO>> pathList(@PathVariable("cno") Long cno) {
    return DataResponseDTO.of(categoryService.getAllCategoryPaths(cno));

  }


}

