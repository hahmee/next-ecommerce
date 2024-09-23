package org.zerock.mallapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.FileDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.service.CategoryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/category")
public class CategoryController {

  private final CategoryService categoryService;

  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @PostMapping("/")
  public DataResponseDTO<Long> register(@Valid @RequestBody CategoryDTO categoryDTO) {

    log.info("register: ?????????????" + categoryDTO);


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
  public DataResponseDTO<List<String>> pathList(@PathVariable("cno") Long cno) {
    return DataResponseDTO.of(categoryService.getAllCategoryPaths(cno));

  }


}

